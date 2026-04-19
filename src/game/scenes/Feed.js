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
        
        // Apply current tint
        this.updateBabyColor();
        
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
        
        // Listen for registry changes to update baby color
        this.registry.events.on('changedata', (parent, key, data) => {
            if (['phones', 'games', 'computers'].includes(key)) {
                this.updateBabyColor();
            }
        });
    }

    updateBabyColor() {
        if (!this.baby) return;

        const phones = this.registry.get('phones') || 0;
        const games = this.registry.get('games') || 0;
        const computers = this.registry.get('computers') || 0;

        // If no consumption, clear tint
        if (phones === 0 && games === 0 && computers === 0) {
            this.baby.clearTint();
            return;
        }

        // Find the maximum value and check for ties
        const maxValue = Math.max(phones, games, computers);
        const tiedCount = [phones, games, computers].filter(val => val === maxValue).length;
        
        // If there's a tie, stay neutral
        if (tiedCount > 1) {
            this.baby.clearTint();
        } else {
            // Apply color for the highest value
            if (computers === maxValue) {
                this.baby.setTint(0xff0000); // Red
            } else if (games === maxValue) {
                this.baby.setTint(0x00ff00); // Green
            } else if (phones === maxValue) {
                this.baby.setTint(0x0000ff); // Blue
            }
        }
    }

    createInventoryDisplay(screenWidth, screenHeight) {
        const inventoryY = 200;
        const itemSpacing = 280;
        const startX = screenWidth / 2 - itemSpacing;
        
        const items = [
            { 
                key: 'phone', 
                label: 'Phone', 
                count: this.registry.get('phonesFound') || 0, 
                statKey: 'phonesFound',
                displayStatKey: 'phones'
            },
            { 
                key: 'game', 
                label: 'Game', 
                count: this.registry.get('gamesFound') || 0, 
                statKey: 'gamesFound',
                displayStatKey: 'games'
            },
            { 
                key: 'computer', 
                label: 'Computer', 
                count: this.registry.get('computersFound') || 0, 
                statKey: 'computersFound',
                displayStatKey: 'computers'
            }
        ];
        
        items.forEach((item, index) => {
            const x = startX + (index * itemSpacing);
            
            const sprite = this.add.image(x, inventoryY, item.key);
            sprite.setScale(2.0);
            
            const countText = this.add.text(x, inventoryY + 120, `x${item.count}`, {
                fontFamily: 'Arial Black',
                fontSize: 32,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }).setOrigin(0.5);
            
            const labelText = this.add.text(x, inventoryY + 160, item.label, {
                fontFamily: 'Arial Black',
                fontSize: 24,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }).setOrigin(0.5);
            
            sprite.itemData = item;
            sprite.countText = countText;
            sprite.labelText = labelText;
            
            if (item.count > 0) {
                sprite.setTint(0xffffff);
                labelText.setColor('#ffffff');
                countText.setColor('#ffffff');
                
                sprite.setInteractive();
                
                sprite.on('pointerdown', () => {
                    if (!this.isEating) {
                        this.feedItem(sprite);
                    }
                });
                
                sprite.on('pointerover', () => sprite.setTint(0xffff00));
                sprite.on('pointerout', () => sprite.setTint(0xffffff));
            } else {
                sprite.setTint(0x666666);
                labelText.setColor('#666666');
                countText.setColor('#666666');
            }
        });
    }

    feedItem(sprite) {
        const item = sprite.itemData;
        const currentCount = this.registry.get(item.statKey) || 0;
        
        if (currentCount <= 0) return;
        
        this.isEating = true;
        
        this.registry.set(item.statKey, currentCount - 1);
        
        const currentDisplayStat = this.registry.get(item.displayStatKey) || 0;
        const newDisplayStat = Math.min(100, currentDisplayStat + 5);
        this.registry.set(item.displayStatKey, newDisplayStat);
        
        sprite.countText.setText(`x${currentCount - 1}`);
        
        if (currentCount - 1 <= 0) {
            sprite.setTint(0x666666);
            sprite.labelText.setColor('#666666');
            sprite.countText.setColor('#666666');
            sprite.disableInteractive();
        }
        
        this.createSimpleEatingAnimation(item);
        this.increaseHunger();
    }

    createSimpleEatingAnimation(item) {
        const itemX = this.baby.x;
        const itemY = this.baby.y - 100;
        
        const eatingItem = this.add.image(itemX, itemY, item.key);
        eatingItem.setScale(1.5);
        this.currentEatingItem = eatingItem;
        
        let biteCount = 0;
        const totalBites = 4;
        
        const takeBite = () => {
            if (biteCount >= totalBites) {
                this.finishEating();
                return;
            }
            
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
        
        this.time.delayedCall(100, () => {
            if (this.currentEatingItem && this.scene.isActive()) {
                takeBite();
            }
        });
    }

    finishEating() {
        if (this.currentEatingItem) {
            this.currentEatingItem.destroy();
            this.currentEatingItem = null;
        }
        
        this.createSatisfiedEffect();
        
        this.time.delayedCall(1000, () => {
            this.isEating = false;
        });
    }

    createSatisfiedEffect() {
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
        
        const energy = this.registry.get('energy') || 0;
        const fun = this.registry.get('fun') || 0;
        const cleanliness = this.registry.get('cleanliness') || 0;
        const newHappiness = (newHunger + energy + fun + cleanliness) / 4;
        this.registry.set('happiness', newHappiness);
    }
}