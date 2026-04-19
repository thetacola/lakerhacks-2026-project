import { Scene } from 'phaser';

export class Play extends Scene {
    constructor() {
        super('Play');

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

        // Set basketball court background color
        this.cameras.main.setBackgroundColor(0x8B4513); // Brown court color

        // Get screen dimensions
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Game variables
        this.score = 0;
        this.timeLeft = 30; // 30 seconds
        this.gameActive = true;
        this.ballInMotion = false;
        this.shootingMode = false; // New mode system

        // Create court background
        this.createCourt(screenWidth, screenHeight);

        // Create basketball
        this.createBall(screenWidth, screenHeight);

        // Create basketball hoop
        this.createHoop(screenWidth, screenHeight);

        this.physics.add.collider(this.ball, this.hoopStand);
        this.physics.add.collider(this.ball, this.hoopNet);

        // Create UI
        this.createUI(screenWidth, screenHeight);

        // Start game timer
        this.startTimer();

        // Set up simple input
        this.setupSimpleInput();

        console.log('Basketball game started!');

        this.registry.events.on('changedata', this.updateData, this);
        var decreaseTimer = this.time.addEvent({
            delay: 6000, // ms
            callback: this.decreaseStats,
            args: [this],
            //callbackScope: thisArg,
            loop: true
        });
    }

    decreaseStats(scene) {
        if (scene.hunger >= 1) {
            scene.hunger = scene.hunger - 1;
        }
        if (scene.cleanliness >= 1) {
            scene.cleanliness = scene.cleanliness - 1;
        }
        if (scene.energy >= 3) {
            scene.energy = scene.energy - 3;
        } else {
            scene.energy = 0;
        }

        var oldHappiness = scene.registry.get('happiness');

        scene.registry.set('hunger', scene.hunger);
        scene.registry.set('fun', scene.fun);
        scene.registry.set('cleanliness', scene.cleanliness);

        var newHappiness = (scene.hunger + scene.energy + scene.fun + scene.cleanliness) / 4;
        scene.registry.set('happiness', newHappiness);

        console.log("Old happiness: ", oldHappiness, " → New happiness: ", scene.registry.get('happiness'));
    }

    createCourt(screenWidth, screenHeight) {
        // Create court floor
        const court = this.add.graphics();
        court.fillStyle(0xD2B48C); // Tan color
        court.fillRect(0, screenHeight * 0.7, screenWidth, screenHeight * 0.3);

        // Add court lines
        court.lineStyle(3, 0xFFFFFF);
        court.strokeRect(50, screenHeight * 0.7, screenWidth - 100, screenHeight * 0.25);

        // Free throw line
        court.strokeRect(screenWidth * 0.3, screenHeight * 0.7, screenWidth * 0.4, screenHeight * 0.15);

        // Center circle
        court.strokeCircle(screenWidth / 2, screenHeight * 0.85, 40);
    }

    createHoop(screenWidth, screenHeight) {
        // Hoop position - moved slightly lower as requested
        this.hoopX = screenWidth * 0.75; // 75% across screen (good horizontal position)
        this.hoopY = screenHeight * 0.6; // Moved down from 0.55 to 0.6 (a little lower)

        // Basketball hoop stand
        this.hoopStand = this.add.image(this.hoopX, this.hoopY, 'hoop-stand');

        this.physics.world.enable(this.hoopStand);
        this.hoopStand.body.setSize(56, 1640);
        this.hoopStand.body.setOffset(202, 0);
        this.hoopStand.setScale(1.2);
        this.hoopStand.body.setImmovable(true);

        // Basketball hoop net (collision area for scoring)
        this.hoopNet = this.add.image(this.hoopX, this.hoopY, 'hoop-net');

        this.physics.world.enable(this.hoopNet);
        this.hoopNet.body.setSize(4, 144);
        this.hoopNet.body.setOffset(50, 100);
        this.hoopNet.setScale(1.2);
        this.physics.world.enable(this.hoopNet);
        this.hoopNet.body.setImmovable(true);

        // FIXED: Scoring zone positioned MUCH HIGHER (25% of screen height above previous position)
        const scoreZoneOffset = screenHeight * 0.25; // 25% of screen height
        this.scoringZone = this.add.zone(this.hoopX, this.hoopY - 20 - scoreZoneOffset, 100, 30); // MUCH HIGHER
        this.physics.world.enable(this.scoringZone);
        this.scoringZone.body.setImmovable(true);
        
        // Debug: Enable this to see exactly where scoring zone is relative to hoop
        const debugZone = this.add.graphics();
        debugZone.fillStyle(0xff0000, 0.3);
        debugZone.fillRect(this.hoopX - 50, (this.hoopY - 20 - scoreZoneOffset) - 15, 100, 30);
        debugZone.setVisible(true); // Temporarily visible to see new position
        
        console.log(`Hoop positioned at: ${this.hoopX}, ${this.hoopY}`);
        console.log(`Scoring zone at: ${this.hoopX}, ${this.hoopY - 20 - scoreZoneOffset} (moved up by ${scoreZoneOffset}px)`);
        console.log(`Screen size: ${screenWidth} x ${screenHeight}`);
    }

    createBall(screenWidth, screenHeight) {
        // Ball starts much lower, closer to ground level
        this.ballStartX = 200;
        this.ballStartY = screenHeight * 0.8; // MUCH LOWER - moved from 0.6 to 0.8 (near ground)
        
        // Create baby sprite at ball starting position (baby stays put)
        this.createBaby(this.ballStartX, this.ballStartY);
        
        // FIXED: Create basketball using the dedicated basketball image - LARGER SIZE
        this.ball = this.add.image(this.ballStartX, this.ballStartY, 'backetball'); // Using your basketball image
        this.ball.setScale(1.2); // Increased from 0.8 to 1.2 (50% larger)
        this.physics.world.enable(this.ball);

        // Ball physics properties
        this.ball.body.setBounce(0.6);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setDrag(30);
        this.ball.body.setGravityY(500);
        this.ball.body.setAllowGravity(false);
        
        // Make ball glow to show it's interactive
        this.ball.setTint(0xffffaa); // Light yellow tint
        
        console.log(`Basketball created at: ${this.ballStartX}, ${this.ballStartY}`);
        console.log(`Baby positioned at same location`);
    }

    createBaby(x, y) {
        // Create baby animation for basketball playing
        this.anims.create({
            key: 'baby-basketball',
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
        
        // Create baby sprite at the specified position
        this.baby = this.add.sprite(x, y, 'baby', 'mm-crawl-0.png');
        this.baby.setScale(2.5); // Same size as other scenes
        this.baby.play('baby-basketball');
        
        // Baby stays put - no physics or movement
        console.log(`Baby created at: ${x}, ${y}`);
    }

    createUI(screenWidth, screenHeight) {
        // Score display
        this.scoreText = this.add.text(50, 50, 'Score: 0', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Timer display
        this.timerText = this.add.text(screenWidth - 200, 50, 'Time: 30', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Instructions - SIMPLIFIED
        this.instructionText = this.add.text(screenWidth / 2, 100, 'CLICK ANYWHERE TO SHOOT!', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        // Add secondary instruction
        this.instructionText2 = this.add.text(screenWidth / 2, 140, 'Aim for the hoop!', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // Power indicator (shows current power level)
        this.powerText = this.add.text(50, screenHeight - 100, 'Power: 50%', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });

        // Back button
        const backButton = this.add.text(50, screenHeight - 50, 'BACK TO MAIN', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setInteractive().on('pointerdown', () => {
            this.scene.start('Main');
        });

        backButton.on('pointerover', () => backButton.setTint(0xcccccc));
        backButton.on('pointerout', () => backButton.clearTint());
    }

    setupSimpleInput() {
        // MUCH SIMPLER INPUT - just click to shoot
        this.power = 50; // Start with medium power
        this.powerDirection = 1; // 1 for increasing, -1 for decreasing
        
        // Power oscillation
        this.powerTimer = this.time.addEvent({
            delay: 100, // Update every 100ms
            callback: () => {
                if (!this.ballInMotion && this.gameActive) {
                    this.power += this.powerDirection * 3;
                    
                    if (this.power >= 100) {
                        this.power = 100;
                        this.powerDirection = -1;
                    } else if (this.power <= 20) {
                        this.power = 20;
                        this.powerDirection = 1;
                    }
                    
                    this.updatePowerDisplay();
                }
            },
            loop: true
        });

        // Simple click anywhere to shoot
        this.input.on('pointerdown', (pointer) => {
            if (!this.gameActive || this.ballInMotion) {
                console.log('Cannot shoot - game not active or ball in motion');
                return;
            }

            console.log(`Shooting with power: ${this.power}`);
            this.shootBallSimple(pointer.x, pointer.y);
        });
    }

    updatePowerDisplay() {
        // Update power text with color coding
        let color = '#ffffff';
        if (this.power > 80) color = '#ff0000'; // Red for high power
        else if (this.power > 60) color = '#ffff00'; // Yellow for medium power
        else color = '#00ff00'; // Green for low power
        
        this.powerText.setText(`Power: ${Math.round(this.power)}%`);
        this.powerText.setColor(color);
        
        // Also tint the ball based on power
        const tintValue = Math.floor(255 - (this.power * 0.5)); // Darker = more power
        const tintColor = (255 << 16) | (tintValue << 8) | tintValue;
        this.ball.setTint(tintColor);
    }

    shootBallSimple(targetX, targetY) {
        if (this.ballInMotion) return;

        this.ballInMotion = true;
        console.log(`Shooting toward: ${targetX}, ${targetY}`);

        // BABY HOP ANIMATION - make baby hop when shooting
        this.makeBabyHop();

        // Calculate direction from ball to click point
        const deltaX = targetX - this.ball.x;
        const deltaY = targetY - this.ball.y;
        
        // Normalize direction
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedX = deltaX / distance;
        const normalizedY = deltaY / distance;

        // Calculate velocity based on power and direction
        const baseVelocity = (300 + (this.power * 5)) * 2; // 600-1600 velocity range
        const velocityX = normalizedX * baseVelocity;
        const velocityY = normalizedY * baseVelocity;

        console.log(`Ball velocity: ${velocityX}, ${velocityY}`);

        this.ball.body.setAllowGravity(true);
        // Apply velocity to ball
        this.ball.body.setVelocity(velocityX, velocityY);
        
        // Clear ball tint during flight
        this.ball.clearTint();

        // Reset ball after a delay
        this.time.delayedCall(4000, () => {
            this.ball.body.setAllowGravity(false);
            this.resetBall();
        });

        // Stop power oscillation during shot
        if (this.powerTimer) {
            this.powerTimer.paused = true;
        }
    }

    makeBabyHop() {
        // Store baby's original position
        const originalY = this.baby.y;
        
        // Make baby hop up and down
        this.tweens.add({
            targets: this.baby,
            y: originalY - 40, // Hop up 40 pixels
            duration: 200, // Quick hop up
            ease: 'Power2',
            yoyo: true, // Come back down
            onComplete: () => {
                // Ensure baby is back at exact original position
                this.baby.setY(originalY);
            }
        });
        
        // Add a little horizontal "push" animation
        this.tweens.add({
            targets: this.baby,
            scaleX: 2.3, // Squish slightly horizontally
            scaleY: 2.7, // Stretch slightly vertically
            duration: 150,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                // Reset to normal scale
                this.baby.setScale(2.5);
            }
        });
        
        console.log('Baby hopping animation started!');
    }

    scoreBasket() {
        // FIXED: Much stricter scoring conditions to prevent multiple scores
        if (this.ball.body.velocity.y > 100 && // Ball must be falling fast (not just drifting)
            !this.ball.justScored && 
            !this.ball.hasScored) { // Additional flag to prevent any double scoring
            
            console.log('Ball scored! Velocity Y:', this.ball.body.velocity.y);
            
            this.ball.justScored = true;
            this.ball.hasScored = true; // Set permanent flag for this throw
            
            this.score += 2; // 2 points per basket
            this.scoreText.setText(`Score: ${this.score}`);

            // Visual feedback
            const scorePopup = this.add.text(this.hoopX, this.hoopY - 50, '+2', {
                fontFamily: 'Arial Black',
                fontSize: 32,
                color: '#00ff00',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);

            this.tweens.add({
                targets: scorePopup,
                y: scorePopup.y - 50,
                alpha: 0,
                duration: 1000,
                onComplete: () => scorePopup.destroy()
            });

            // Don't reset scoring flags - they stay true until ball is reset
            console.log(`Score! Total: ${this.score}`);
        }
    }

    resetBall() {
        if (!this.scene.isActive()) return;

        // Stop the ball
        if (this.ball && this.ball.body) {
            this.ball.body.setVelocity(0, 0);
        }

        // Reset ball position to baby's position (baby never moves)
        if (this.ball) {
            this.ball.setPosition(this.baby.x, this.baby.y); // Reset to baby's position
            this.ballInMotion = false;
        
            // Reset both scoring flags when ball is reset
            this.ball.justScored = false;
            this.ball.hasScored = false;
        
            // Restart power oscillation
            if (this.powerTimer) {
                this.powerTimer.paused = false;
            }
        
            // Reset power display
            this.updatePowerDisplay();
        }

        console.log('Ball reset to baby position - scoring flags cleared');
    }

    startTimer() {
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.timerText.setText(`Time: ${this.timeLeft}`);
                } else {
                    this.endGame();
                }
            },
            loop: true
        });

        // Set up collision detection for scoring
        this.physics.add.overlap(this.ball, this.scoringZone, () => {
            this.scoreBasket();
        });
    }

    endGame() {
        this.gameActive = false;
        
        // Stop timers
        if (this.gameTimer) {
            this.gameTimer.destroy();
        }
        if (this.powerTimer) {
            this.powerTimer.destroy();
        }

        // Stop ball
        if (this.ball && this.ball.body) {
            this.ball.body.setVelocity(0, 0);
        }

        // Create game over overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Game over text
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'GAME OVER!', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Final score
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `Final Score: ${this.score}`, {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        // Performance message
        let message;
        if (this.score >= 20) message = 'Amazing! Great shooting!';
        else if (this.score >= 10) message = 'Good job! Keep practicing!';
        else if (this.score >= 4) message = 'Not bad! Try again!';
        else message = 'Keep practicing!';

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, message, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // Restart button
        const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 120, 'PLAY AGAIN', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });

        restartButton.on('pointerover', () => restartButton.setTint(0xcccccc));
        restartButton.on('pointerout', () => restartButton.clearTint());

        // Back to main button
        const mainButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 180, 'BACK TO MAIN', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        mainButton.on('pointerdown', () => {
            this.scene.start('Main');
        });

        mainButton.on('pointerover', () => mainButton.setTint(0xcccccc));
        mainButton.on('pointerout', () => mainButton.clearTint());

        console.log(`Game ended! Final score: ${this.score}`);

        if (this.fun < 100 - (this.score * 5)) {
            this.fun = this.fun + (this.score * 5);
        } else {
            this.fun = 100;
        }

        var oldHappiness = this.registry.get('happiness');

        this.registry.set('fun', this.fun);

        var newHappiness = (this.hunger + this.energy + this.fun + this.cleanliness) / 4;
        this.registry.set('happiness', newHappiness);

        console.log("Old happiness: ", oldHappiness, " → New happiness: ", this.registry.get('happiness'));
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
