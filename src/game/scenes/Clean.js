import { Scene } from 'phaser';

export class Clean extends Scene {
    constructor() {
        super('Clean');

        this.hunger = 0;
        this.energy = 100;
        this.fun = 0;
        this.cleanliness = 100;
    }

    create() {

        this.hunger = this.registry.get('hunger');
        this.energy = this.registry.get('energy');
        this.fun = this.registry.get('fun');
        this.cleanliness = this.registry.get('cleanliness');

        console.log('Clean scene started');
        
        // Set background
        this.cameras.main.setBackgroundColor(0x87CEEB);

        // Get screen dimensions
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Create baby cleaning animation
        this.anims.create({
            key: 'baby-clean',
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
        this.baby.play('baby-clean');

        console.log('Baby created');

        // Start bubbles much sooner (200ms)
        this.time.delayedCall(200, () => {
            console.log('Starting bubble effect');
            this.startBubbleLoop();
        });

        // Return to Main after 5 seconds
        this.time.delayedCall(5000, () => {
            console.log('Returning to Main');
            this.scene.start('Main');
        });

        this.registry.events.on('changedata', this.updateData, this);
        var decreaseTimer = this.time.addEvent({
            delay: 6000, // ms
            callback: this.decreaseStats,
            args: [this],
            //callbackScope: thisArg,
            loop: true
        });
        var increaseTime = this.time.addEvent({
            delay: 100, // ms
            callback: this.increaseCleanliness,
            args: [this],
            loop: true
        });
    }

    increaseCleanliness(scene) {
        if (scene.cleanliness <= 99) {
            scene.cleanliness = scene.cleanliness + 1;
            var oldHappiness = scene.registry.get('happiness');
            scene.registry.set('cleanliness', scene.cleanliness);
            var newHappiness = (scene.hunger + scene.energy + scene.fun + scene.cleanliness) / 4;
            scene.registry.set('happiness', newHappiness);

            console.log("Old happiness: ", oldHappiness, " → New happiness: ", scene.registry.get('happiness'));
        }
    }

    decreaseStats(scene) {
        if (scene.hunger >= 1) {
            scene.hunger = scene.hunger - 1;
        }
        if (scene.fun >= 1) {
            scene.fun = scene.fun - 1;
        }
        if (scene.energy >= 1) {
            scene.energy = scene.energy - 1;
        }

        var oldHappiness = scene.registry.get('happiness');

        scene.registry.set('hunger', scene.hunger);
        scene.registry.set('fun', scene.fun);
        scene.registry.set('energy', scene.energy);

        var newHappiness = (scene.hunger + scene.energy + scene.fun + scene.cleanliness) / 4;
        scene.registry.set('happiness', newHappiness);

        console.log("Old happiness: ", oldHappiness, " → New happiness: ", scene.registry.get('happiness'));
    }

    startBubbleLoop() {
        const screenHeight = this.cameras.main.height;
        
        const createBubble = () => {
            try {
                // Random bubble selection
                const bubbleKeys = ['bubble1', 'bubble2', 'bubble3', 'bubble4', 'bubble5', 'bubble6', 'bubble7'];
                const randomKey = bubbleKeys[Math.floor(Math.random() * bubbleKeys.length)];
                
                // Start near baby, but add some horizontal spread
                const startX = this.baby.x + (Math.random() - 0.5) * 120; // ±60 pixels from baby center
                const startY = this.baby.y + (Math.random() - 0.5) * 40;  // ±20 pixels from baby center
                
                const bubble = this.add.image(startX, startY, randomKey);
                
                // EVEN SMALLER sizes - reduced once more
                // Range: 0.05 to 0.2 (was 0.08 to 0.3)
                const startScale = 0.05 + Math.random() * 0.15; // Much smaller starting sizes
                const growthFactor = 1.1 + Math.random() * 0.3; // Less growth (1.1x to 1.4x)
                const endScale = startScale * growthFactor;
                
                // FOCUS ON FLOATING UPWARD
                // End position: mostly upward with slight horizontal drift
                const horizontalDrift = (Math.random() - 0.5) * 80; // Small side-to-side drift
                const endX = startX + horizontalDrift;
                const endY = 50 + Math.random() * 100; // Float to top area of screen
                
                bubble.setScale(startScale);
                
                // Animate bubble - focus on upward movement
                this.tweens.add({
                    targets: bubble,
                    x: endX,
                    y: endY, // Always goes up
                    alpha: 0, // Fade to invisible
                    scale: endScale,
                    rotation: (Math.random() - 0.5) * Math.PI, // Less rotation
                    duration: 2000 + Math.random() * 2000, // 2 to 4 seconds
                    ease: 'Power1', // Gentler easing for floating effect
                    onComplete: () => {
                        bubble.destroy();
                    }
                });
                
            } catch (error) {
                console.error('Error creating bubble:', error);
            }
        };

        // Create more initial bubbles
        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(i * 100, () => {
                createBubble();
            });
        }
        
        // Much more frequent spawning
        const scheduleNext = () => {
            const delay = 150 + Math.random() * 300; // 150-450ms
            this.time.delayedCall(delay, () => {
                if (this.scene.isActive()) {
                    createBubble();
                    scheduleNext();
                }
            });
        };
        
        scheduleNext();
    }

    updateData(parent, key, data) {
        if (key === 'hunger') {
            this.hunger = data;
        } else if (key === 'energy') {
            this.energy = data;
        } else if (key === 'fun') {
            this.fun = data;
        } else if (key === 'cleanliness') {
            this.cleanliness = data;
        }
    }
}
