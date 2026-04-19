import { Scene } from 'phaser';

export class Feed extends Scene {
    constructor() {
        super('Feed');
    }

    create() {
        console.log('Feed scene started');
        
        // Get screen dimensions
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Set background color
        this.cameras.main.setBackgroundColor(0x87CEEB);
        
        // Create baby animation (same as Clean scene)
        this.anims.create({
            key: 'baby-feed',
            frames: this.anims.generateFrameNames('baby', {
                prefix: 'mm-crawl-',
                suffix: '.png',
                start: 0,
                end: 4,
                zeroPad: 0
            }),
            frameRate: 6,
            repeat: -1
        });
        
        // Create baby sprite
        this.baby = this.add.sprite(screenWidth / 2, (screenHeight * 3) / 4, 'baby', 'mm-crawl-0.png');
        this.baby.setScale(2.5);
        this.baby.play('baby-feed');
        
        // Create title
        this.add.text(screenWidth / 2, 50, 'FEED THE RECYCLER', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        // Create inventory display
        this.createInventoryDisplay(screenWidth, screenHeight);
        
        // Add back button
        const backButton = this.add.text(50, 50, 'BACK', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Main');
        });
        
        // Variables for eating animation
        this.isEating = false;
        this.currentEatingItem = null;
    }

    createInventoryDisplay(screenWidth, screenHeight) {
        const inventoryY = 200; // Moved down a bit to accommodate larger icons
        const itemSpacing = 280; // Increased spacing for larger icons
        const startX = screenWidth / 2 - itemSpacing;
        
        // Define item properties - get current counts from registry
        const items = [
            { 
                key: 'phone', 
                label: 'Phone', 
                count: this.registry.get('phonesFound') || 0, 
                statKey: 'phonesFound',
                displayStatKey: 'phones' // This is what shows in Stats scene
            },
            { 
                key: 'game', 
                label: 'Game', 
                count: this.registry.get('gamesFound') || 0, 
                statKey: 'gamesFound',
                displayStatKey: 'games' // This is what shows in Stats scene
            },
            { 
                key: 'computer', 
                label: 'Computer', 
                count: this.registry.get('computersFound') || 0, 
                statKey: 'computersFound',
                displayStatKey: 'computers' // This is what shows in Stats scene
            }
        ];
        
        console.log('Current counts:', items.map(item => `${item.label}: ${item.count}`));
        
        // Create simple display without containers
        items.forEach((item, index) => {
            const x = startX + (index * itemSpacing);
            
            // Create item sprite - 4x LARGER (was 0.5, now 2.0)
            const sprite = this.add.image(x, inventoryY, item.key);
            sprite.setScale(2.0); // 4x larger than before
            
            // Create count text - moved further down and larger font
            const countText = this.add.text(x, inventoryY + 120, `x${item.count}`, {
                fontFamily: 'Arial Black',
                fontSize: 32, // Larger font (was 20)
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3, // Thicker stroke
                align: 'center'
            }).setOrigin(0.5);
            
            // Create label text - moved further down and larger font
            const labelText = this.add.text(x, inventoryY + 160, item.label, {
                fontFamily: 'Arial Black',
                fontSize: 24, // Larger font (was 16)
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3, // Thicker stroke
                align: 'center'
            }).setOrigin(0.5);
            
            // Store references
            sprite.itemData = item;
            sprite.countText = countText;
            sprite.labelText = labelText;
            
            // Make interactive if items are available
            if (item.count > 0) {
                sprite.setTint(0xffffff);
                labelText.setColor('#ffffff');
                countText.setColor('#ffffff');
                
                sprite.setInteractive();
                
                sprite.on('pointerdown', () => {
                    if (!this.isEating) {
                        console.log(`Clicked ${item.label}, current count: ${item.count}`);
                        this.feedItem(sprite);
                    }
                });
                
                sprite.on('pointerover', () => {
                    sprite.setTint(0xffff00);
                });
                
                sprite.on('pointerout', () => {
                    sprite.setTint(0xffffff);
                });
            } else {
                sprite.setTint(0x666666);
                labelText.setColor('#666666');
                countText.setColor('#666666');
            }
        });
    }

    feedItem(sprite) {
        const item = sprite.itemData;
        console.log(`Feeding ${item.label}`);
        
        // Check current count from registry
        const currentCount = this.registry.get(item.statKey) || 0;
        console.log(`Current ${item.statKey}:`, currentCount);
        
        if (currentCount <= 0) {
            console.log('No items to feed');
            return;
        }
        
        this.isEating = true;
        
        // Decrease count in registry (for inventory)
        this.registry.set(item.statKey, currentCount - 1);
        console.log(`Updated ${item.statKey} to:`, currentCount - 1);
        
        // ALSO UPDATE THE DISPLAY STAT (for Stats scene bars) - ADD 5 POINTS PER ITEM
        const currentDisplayStat = this.registry.get(item.displayStatKey) || 0;
        const newDisplayStat = Math.min(100, currentDisplayStat + 5); // Add 5 points, max 100
        this.registry.set(item.displayStatKey, newDisplayStat);
        console.log(`Updated ${item.displayStatKey} from ${currentDisplayStat} to ${newDisplayStat}`);
        
        // Update display
        sprite.countText.setText(`x${currentCount - 1}`);
        
        // If count is 0, disable interaction
        if (currentCount - 1 <= 0) {
            sprite.setTint(0x666666);
            sprite.labelText.setColor('#666666');
            sprite.countText.setColor('#666666');
            sprite.disableInteractive();
        }
        
        // Create eating animation
        this.createSimpleEatingAnimation(item);
        
        // Increase hunger stat
        this.increaseHunger();
    }

    createSimpleEatingAnimation(item) {
        console.log('Starting eating animation for:', item.label);
        
        // Position item above baby
        const itemX = this.baby.x;
        const itemY = this.baby.y - 100;
        
        // Create the item sprite - larger for eating animation too
        const eatingItem = this.add.image(itemX, itemY, item.key);
        eatingItem.setScale(1.5); // Larger eating item (was 0.8)
        this.currentEatingItem = eatingItem;
        
        // Simple eating animation using scale and alpha
        let biteCount = 0;
        const totalBites = 4;
        
        const takeBite = () => {
            console.log(`Taking bite ${biteCount + 1}/${totalBites}`);
            
            if (biteCount >= totalBites) {
                console.log('Finished eating');
                this.finishEating();
                return;
            }
            
            // Shrink the item and make it more transparent
            const newScale = eatingItem.scaleX * 0.7;
            const newAlpha = eatingItem.alpha * 0.8;
            
            this.tweens.add({
                targets: eatingItem,
                scaleX: newScale,
                scaleY: newScale,
                alpha: newAlpha,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    biteCount++;
                    if (biteCount < totalBites) {
                        // Schedule next bite with a delay
                        this.time.delayedCall(200, () => {
                            if (this.currentEatingItem && this.scene.isActive()) {
                                takeBite();
                            }
                        });
                    } else {
                        this.finishEating();
                    }
                }
            });
        };
        
        // Start eating animation after a small delay
        this.time.delayedCall(100, () => {
            if (this.currentEatingItem && this.scene.isActive()) {
                takeBite();
            }
        });
    }

    finishEating() {
        console.log('Finishing eating animation');
        
        // Remove eating item
        if (this.currentEatingItem) {
            this.currentEatingItem.destroy();
            this.currentEatingItem = null;
        }
        
        // Create satisfied particles
        this.createSatisfiedEffect();
        
        // Reset eating state after particles
        this.time.delayedCall(1000, () => {
            console.log('Eating state reset');
            this.isEating = false;
        });
    }

    createSatisfiedEffect() {
        console.log('Creating satisfied effect');
        
        // Create small heart particles to show satisfaction
        for (let i = 0; i < 5; i++) {
            const heart = this.add.text(
                this.baby.x + (Math.random() - 0.5) * 100,
                this.baby.y - 50,
                '♥',
                {
                    fontSize: '24px',
                    color: '#ff69b4'
                }
            );
            
            // Animate hearts floating up
            this.tweens.add({
                targets: heart,
                y: heart.y - 100,
                alpha: 0,
                scale: 1.5,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => heart.destroy()
            });
        }
    }

    increaseHunger() {
        const currentHunger = this.registry.get('hunger') || 0;
        const newHunger = Math.min(100, currentHunger + 20);
        this.registry.set('hunger', newHunger);
        
        // Update happiness
        const energy = this.registry.get('energy') || 0;
        const fun = this.registry.get('fun') || 0;
        const cleanliness = this.registry.get('cleanliness') || 0;
        const newHappiness = (newHunger + energy + fun + cleanliness) / 4;
        this.registry.set('happiness', newHappiness);
        
        console.log(`Hunger increased to ${newHunger}, happiness: ${newHappiness}`);
    }
}