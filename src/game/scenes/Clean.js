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

        // Set background
        this.cameras.main.setBackgroundColor(0x87CEEB);

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

        // Apply current tint
        this.updateBabyColor();

        // Listen for registry changes to update baby color
        this.registry.events.on('changedata', (parent, key, data) => {
            if (['phones', 'games', 'computers'].includes(key)) {
                this.updateBabyColor();
            }
            // Also handle other data updates
            if (key === 'hunger') {
                this.hunger = data;
            } else if (key === 'energy') {
                this.energy = data;
            } else if (key === 'fun') {
                this.fun = data;
            } else if (key === 'cleanliness') {
                this.cleanliness = data;
            }
        });

        // Start bubbles
        this.time.delayedCall(200, () => {
            this.startBubbleLoop();
        });

        // Return to Main after 5 seconds
        this.time.delayedCall(5000, () => {
            this.scene.start('Main');
        });

        // Set up timers
        this.time.addEvent({
            delay: 6000,
            callback: this.decreaseStats,
            args: [this],
            loop: true
        });
        
        this.time.addEvent({
            delay: 100,
            callback: this.increaseCleanliness,
            args: [this],
            loop: true
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

    increaseCleanliness(scene) {
        if (scene.cleanliness <= 99) {
            scene.cleanliness = scene.cleanliness + 1;
            scene.registry.set('cleanliness', scene.cleanliness);
            const newHappiness = (scene.hunger + scene.energy + scene.fun + scene.cleanliness) / 4;
            scene.registry.set('happiness', newHappiness);
        }
    }

    decreaseStats(scene) {
        if (scene.hunger >= 1) scene.hunger = scene.hunger - 1;
        if (scene.fun >= 1) scene.fun = scene.fun - 1;
        if (scene.energy >= 1) scene.energy = scene.energy - 1;

        scene.registry.set('hunger', scene.hunger);
        scene.registry.set('fun', scene.fun);
        scene.registry.set('energy', scene.energy);

        const newHappiness = (scene.hunger + scene.energy + scene.fun + scene.cleanliness) / 4;
        scene.registry.set('happiness', newHappiness);
    }

    startBubbleLoop() {
        const createBubble = () => {
            try {
                const bubbleKeys = ['bubble1', 'bubble2', 'bubble3', 'bubble4', 'bubble5', 'bubble6', 'bubble7'];
                const randomKey = bubbleKeys[Math.floor(Math.random() * bubbleKeys.length)];
                
                const startX = this.baby.x + (Math.random() - 0.5) * 120;
                const startY = this.baby.y + (Math.random() - 0.5) * 40;
                
                const bubble = this.add.image(startX, startY, randomKey);
                
                const startScale = 0.05 + Math.random() * 0.15;
                const growthFactor = 1.1 + Math.random() * 0.3;
                const endScale = startScale * growthFactor;
                
                const horizontalDrift = (Math.random() - 0.5) * 80;
                const endX = startX + horizontalDrift;
                const endY = 50 + Math.random() * 100;
                
                bubble.setScale(startScale);
                
                this.tweens.add({
                    targets: bubble,
                    x: endX,
                    y: endY,
                    alpha: 0,
                    scale: endScale,
                    rotation: (Math.random() - 0.5) * Math.PI,
                    duration: 2000 + Math.random() * 2000,
                    ease: 'Power1',
                    onComplete: () => bubble.destroy()
                });
            } catch (error) {
                console.error('Error creating bubble:', error);
            }
        };

        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(i * 100, () => createBubble());
        }
        
        const scheduleNext = () => {
            const delay = 150 + Math.random() * 300;
            this.time.delayedCall(delay, () => {
                if (this.scene.isActive()) {
                    createBubble();
                    scheduleNext();
                }
            });
        };
        
        scheduleNext();
    }
}