import { Scene } from 'phaser';

export class Gather extends Scene {
    constructor() {
        super('Gather');
    }

    create() {
        console.log('Gather scene started');
        
        // Get screen dimensions first
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Create sky and ground background
        this.createBackground(screenWidth, screenHeight);

        // Initialize game state
        this.targetClicks = 10 + Math.floor(Math.random() * 21); // Random 10-30
        this.currentClicks = 0;
        this.trashItems = []; // Array to track spawned trash

        console.log(`Target clicks: ${this.targetClicks}`);

        // Add garbage pile in front of baby (positioned before baby for correct layering)
        this.garbagePile = this.add.image(screenWidth / 2, (screenHeight * 3) / 4 + 40, 'garbagepile');
        this.garbagePile.setScale(0.3); // Much smaller - like a small object
        this.garbagePile.setOrigin(0.5, 0.8); // Position so it sits naturally on ground

        // Use the same baby animation as Sleep scene (frames 10-14)
        this.anims.create({
            key: 'baby-gather',
            frames: this.anims.generateFrameNames('baby', {
                prefix: 'mm-crawl-',
                suffix: '.png',
                start: 10,
                end: 14,
                zeroPad: 0
            }),
            frameRate: 6,
            repeat: -1
        });

        // Create baby sprite at center (will appear behind garbage pile due to layering)
        this.baby = this.add.sprite(screenWidth / 2, (screenHeight * 3) / 4, 'baby', 'mm-crawl-10.png');
        this.baby.setScale(2.5);
        this.baby.play('baby-gather');

        // Create TAP prompt at top center
        this.tapPrompt = this.add.text(screenWidth / 2, 60, 'TAP', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Create click counter below TAP
        this.clickCounter = this.add.text(screenWidth / 2, 110, `${this.currentClicks} / ${this.targetClicks}`, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // Make entire screen interactive for clicking
        this.input.on('pointerdown', (pointer) => {
            this.spawnTrash(pointer.x, pointer.y);
        });

        console.log('Gather scene setup complete');
    }

    createBackground(screenWidth, screenHeight) {
        // Calculate horizon line (where sky meets ground)
        const horizonY = screenHeight * 0.6; // 60% down from top

        // Create sky gradient (light blue to darker blue)
        const skyGradient = this.add.graphics();
        
        // Sky colors: light blue at top, slightly darker at horizon
        const skyTopColor = 0x87CEEB; // Light sky blue
        const skyBottomColor = 0x4682B4; // Steel blue
        
        // Create gradient effect with multiple horizontal strips
        const skySteps = 20;
        for (let i = 0; i < skySteps; i++) {
            const y = (i / skySteps) * horizonY;
            const height = horizonY / skySteps;
            
            // Interpolate between top and bottom colors
            const ratio = i / skySteps;
            const r1 = (skyTopColor >> 16) & 0xFF;
            const g1 = (skyTopColor >> 8) & 0xFF;
            const b1 = skyTopColor & 0xFF;
            const r2 = (skyBottomColor >> 16) & 0xFF;
            const g2 = (skyBottomColor >> 8) & 0xFF;
            const b2 = skyBottomColor & 0xFF;
            
            const r = Math.round(r1 + (r2 - r1) * ratio);
            const g = Math.round(g1 + (g2 - g1) * ratio);
            const b = Math.round(b1 + (b2 - b1) * ratio);
            
            const color = (r << 16) | (g << 8) | b;
            skyGradient.fillStyle(color);
            skyGradient.fillRect(0, y, screenWidth, height);
        }

        // Create ground gradient (brown dirt/soil colors)
        const groundGradient = this.add.graphics();
        
        // Ground colors: lighter brown at horizon to darker brown at bottom
        const groundTopColor = 0xD2B48C; // Tan/light brown
        const groundBottomColor = 0x8B4513; // Saddle brown
        
        const groundHeight = screenHeight - horizonY;
        const groundSteps = 15;
        
        for (let i = 0; i < groundSteps; i++) {
            const y = horizonY + (i / groundSteps) * groundHeight;
            const height = groundHeight / groundSteps;
            
            // Interpolate between ground colors
            const ratio = i / groundSteps;
            const r1 = (groundTopColor >> 16) & 0xFF;
            const g1 = (groundTopColor >> 8) & 0xFF;
            const b1 = groundTopColor & 0xFF;
            const r2 = (groundBottomColor >> 16) & 0xFF;
            const g2 = (groundBottomColor >> 8) & 0xFF;
            const b2 = groundBottomColor & 0xFF;
            
            const r = Math.round(r1 + (r2 - r1) * ratio);
            const g = Math.round(g1 + (g2 - g1) * ratio);
            const b = Math.round(b1 + (b2 - b1) * ratio);
            
            const color = (r << 16) | (g << 8) | b;
            groundGradient.fillStyle(color);
            groundGradient.fillRect(0, y, screenWidth, height);
        }

        // Add some simple clouds in the sky
        this.addClouds(screenWidth, horizonY);

        // Add some grass/texture details on the ground
        this.addGroundDetails(screenWidth, screenHeight, horizonY);
    }

    addClouds(screenWidth, horizonY) {
        // Create simple white clouds using graphics
        const cloudGraphics = this.add.graphics();
        cloudGraphics.fillStyle(0xFFFFFF, 0.8); // White with some transparency
        
        // Add 3-4 simple clouds
        const numClouds = 3 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < numClouds; i++) {
            const cloudX = (screenWidth / (numClouds + 1)) * (i + 1);
            const cloudY = 50 + Math.random() * (horizonY * 0.4);
            const cloudSize = 30 + Math.random() * 40;
            
            // Draw cloud as overlapping circles
            cloudGraphics.fillCircle(cloudX, cloudY, cloudSize);
            cloudGraphics.fillCircle(cloudX + cloudSize * 0.6, cloudY, cloudSize * 0.8);
            cloudGraphics.fillCircle(cloudX - cloudSize * 0.6, cloudY, cloudSize * 0.8);
            cloudGraphics.fillCircle(cloudX, cloudY - cloudSize * 0.4, cloudSize * 0.6);
        }
    }

    addGroundDetails(screenWidth, screenHeight, horizonY) {
        // Add some small grass tufts and texture to the ground
        const grassGraphics = this.add.graphics();
        
        // Add scattered grass patches
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * screenWidth;
            const y = horizonY + Math.random() * (screenHeight - horizonY) * 0.3;
            const grassColor = 0x228B22 + Math.floor(Math.random() * 0x002200); // Variations of green
            
            grassGraphics.fillStyle(grassColor, 0.6);
            
            // Draw small grass tuft
            grassGraphics.fillRect(x, y, 3, 8 + Math.random() * 6);
            grassGraphics.fillRect(x + 2, y - 2, 3, 6 + Math.random() * 4);
        }
        
        // Add some dirt patches/texture
        const dirtGraphics = this.add.graphics();
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * screenWidth;
            const y = horizonY + Math.random() * (screenHeight - horizonY);
            const size = 2 + Math.random() * 4;
            const dirtColor = 0x654321 + Math.floor(Math.random() * 0x111111);
            
            dirtGraphics.fillStyle(dirtColor, 0.3);
            dirtGraphics.fillCircle(x, y, size);
        }
    }

    spawnTrash(clickX, clickY) {
        // Only spawn if we haven't reached target
        if (this.currentClicks >= this.targetClicks) {
            return;
        }

        console.log(`Spawning trash at click ${this.currentClicks + 1}`);

        try {
            // Generate random trash frame (trash1 to trash58)
            const frameNumber = 1 + Math.floor(Math.random() * 58); // 1-58
            const frameName = `trash${frameNumber}.png`;
        
            console.log(`Selected frame: ${frameName}`);

            // Get screen dimensions
            const screenWidth = this.cameras.main.width;
            const screenHeight = this.cameras.main.height;

            // Spawn at baby center (not click position)
            const startX = this.baby.x;
            const startY = this.baby.y;

            // Create trash item - add error handling
            let trash;
            try {
                trash = this.add.image(startX, startY, 'trash', frameName);
            } catch (frameError) {
                console.warn(`Frame ${frameName} not found, using trash1.png instead`);
                trash = this.add.image(startX, startY, 'trash', 'trash1.png');
            }
        
            // SLIGHTLY BIGGER trash - increased scale moderately
            const scale = 1.8 + Math.random() * 2.0; // 1.8 to 3.8 (was 1.2 to 2.8)
            trash.setScale(scale);

            // Determine bounce direction (left or right off screen)
            const bounceLeft = Math.random() < 0.5;
        
            // Calculate positions for multiple bounces
            const bounceCount = 2 + Math.floor(Math.random() * 2); // 2-3 bounces
            const totalDuration = 3000 + Math.random() * 2000; // 3-5 seconds total
        
            // Calculate intermediate bounce positions
            const bouncePositions = [];
            const groundY = screenHeight - 50; // Ground level
        
            for (let i = 0; i < bounceCount; i++) {
                const progress = (i + 1) / (bounceCount + 1);
                const bounceX = bounceLeft ? 
                    startX - (progress * (startX + 200)) : // Moving left
                    startX + (progress * (screenWidth - startX + 200)); // Moving right
            
                bouncePositions.push({
                    x: bounceX,
                    y: groundY,
                    bounceHeight: 150 - (i * 30) // Each bounce gets smaller
                });
            }
        
            // Final exit position (off screen)
            const finalX = bounceLeft ? -150 : screenWidth + 150;
            const finalY = groundY;

            // Create the bouncing sequence
            let currentBounce = 0;
        
            const performBounce = () => {
                if (currentBounce >= bouncePositions.length) {
                    // Final exit bounce
                    this.tweens.add({
                        targets: trash,
                        x: finalX,
                        duration: 800,
                        ease: 'Power2'
                    });
                
                    this.tweens.add({
                        targets: trash,
                        y: startY - 100, // Small final arc
                        duration: 400,
                        ease: 'Power2',
                        yoyo: true,
                        onComplete: () => {
                            this.tweens.add({
                                targets: trash,
                                y: finalY,
                                duration: 400,
                                ease: 'Power2',
                                onComplete: () => {
                                    // Clean up
                                    const index = this.trashItems.indexOf(trash);
                                    if (index > -1) {
                                        this.trashItems.splice(index, 1);
                                    }
                                    trash.destroy();
                                }
                            });
                        }
                    });
                    return;
                }
            
                const bounce = bouncePositions[currentBounce];
                const bounceDuration = totalDuration / (bounceCount + 1);
            
                // Move to bounce position
                this.tweens.add({
                    targets: trash,
                    x: bounce.x,
                    duration: bounceDuration * 0.7, // 70% of time for horizontal movement
                    ease: 'Power1'
                });
            
                // Bounce up and down
                this.tweens.add({
                    targets: trash,
                    y: startY - bounce.bounceHeight,
                    duration: bounceDuration * 0.35,
                    ease: 'Power2',
                    yoyo: true,
                    onComplete: () => {
                        currentBounce++;
                        performBounce();
                    }
                });
            };
        
            // Start the bouncing sequence
            performBounce();

            // Add rotation for more dynamic effect
            this.tweens.add({
                targets: trash,
                rotation: (Math.random() - 0.5) * Math.PI * 6, // More rotation
                duration: totalDuration,
                ease: 'Linear'
            });

            // Add to tracking array
            this.trashItems.push(trash);

            // Update counter
            this.currentClicks++;
            this.clickCounter.setText(`${this.currentClicks} / ${this.targetClicks}`);

            console.log(`Trash spawned successfully. Clicks: ${this.currentClicks}/${this.targetClicks}`);

            // Check if objective complete
            if (this.currentClicks >= this.targetClicks) {
                console.log('Objective complete! Returning to Main in 2 seconds...');
            
                // Change prompt to indicate completion
                this.tapPrompt.setText('COMPLETE!');
                this.tapPrompt.setColor('#00ff00');

                // Return to Main after brief delay - NO STATS MODIFICATION
                this.time.delayedCall(2000, () => {
                    console.log('Returning to Main without modifying stats');
                    this.scene.start('Main');
                });
            }

        } catch (error) {
            console.error('Error spawning trash:', error);
        
            // Fallback: still increment counter even if trash spawn fails
            this.currentClicks++;
            this.clickCounter.setText(`${this.currentClicks} / ${this.targetClicks}`);
        
            if (this.currentClicks >= this.targetClicks) {
                this.tapPrompt.setText('COMPLETE!');
                this.tapPrompt.setColor('#00ff00');
                this.time.delayedCall(2000, () => {
                    this.scene.start('Main');
                });
            }
        }
    }
}