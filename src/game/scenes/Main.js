import { Scene } from 'phaser';

export class Main extends Scene {
    constructor() {
        super('Main');

        this.metal = 0;
        this.plastic = 0;
        this.magnets = 0;
        this.happiness = 0;
    }

    create() {
        this.registry.set('metal', this.metal);
        this.registry.set('plastic', this.plastic);
        this.registry.set('magnets', this.magnets);
        this.registry.set('happiness', this.happiness);

        // Set a background color for the scene
        this.cameras.main.setBackgroundColor(0x008080);

        // Start background music
        if (!this.game.bgMusic || !this.game.bgMusic.isPlaying) {
            this.game.bgMusic = this.sound.add('bgMusic', {
                volume: 0.5,
                loop: true
            });
            this.game.bgMusic.play();
        }

        // Track music state
        this.isMusicPlaying = this.game.bgMusic && this.game.bgMusic.isPlaying;

        // Calculate dynamic sizing based on screen
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const scale = this.getScale();

        // CREATE 2x3 BUTTON MATRIX AT TOP
        this.createButtonMatrix(scale, screenWidth, screenHeight);

        // Create baby animations
        this.createBabyAnimations();

        // Create the baby character as an animated sprite
        this.baby = this.add.sprite(
            this.cameras.main.width / 2,
            (this.cameras.main.height * 3) / 4,
            'baby'
        );

        // Scale the baby based on screen size
        this.baby.setScale(scale * 2.5); // Adjust this multiplier as needed

        // Start the animation
        this.baby.play('baby-crawl');

        // Start the movement
        this.startMovement();

        // Create bottom taskbar
        this.createTaskbar();

        // Initialize menu state
        this.menuOpen = false;
    }

    createBabyAnimations() {
        // Create movement animation using only frames 5-9
        this.anims.create({
            key: 'baby-crawl',
            frames: this.anims.generateFrameNames('baby', {
                prefix: 'mm-crawl-',
                suffix: '.png',
                start: 5,
                end: 9,    // Only frames 5-9
                zeroPad: 0
            }),
            frameRate: 8,  // Adjust this for speed (try 6-12)
            repeat: -1     // Loop forever
        });
    }

    startMovement() {
        const screenWidth = this.cameras.main.width;
        const scale = this.getScale();
        const babyWidth = this.baby.displayWidth / 2;

        // Since frames 5-9 naturally face right, don't flip initially for moving left
        this.baby.setFlipX(false);

        // Move to left side
        this.tweens.add({
            targets: this.baby,
            x: babyWidth,
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
                // Flip the baby to face right for moving right
                this.baby.setFlipX(true);

                // Move to right side
                this.tweens.add({
                    targets: this.baby,
                    x: screenWidth - babyWidth,
                    duration: 4000,
                    ease: 'Linear',
                    onComplete: () => {
                        // Flip back to face left for moving back to center
                        this.baby.setFlipX(false);

                        // Return to center
                        this.tweens.add({
                            targets: this.baby,
                            x: screenWidth / 2,
                            duration: 3000,
                            ease: 'Linear',
                            onComplete: () => {
                                // Restart the cycle
                                this.startMovement();
                            }
                        });
                    }
                });
            }
        });

        this.bounceMovement();
    }

    bounceMovement() {
        const screenHeight = this.cameras.main.height;
        const scale = this.getScale();
        const bounceDistance = 120 * scale;

        this.tweens.add({
            targets: this.baby,
            y: ((screenHeight * 3) / 4) - bounceDistance,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    createButtonMatrix(scale, screenWidth, screenHeight) {
        // Define button matrix layout (2 rows, 3 columns)
        const buttons = [
            // Row 1
            { key: 'stats', label: 'Stats', scene: 'Stats' },
            { key: 'play', label: 'Play', scene: 'Play' },
            { key: 'feed', label: 'Feed', scene: 'Feed' },
            // Row 2
            { key: 'gather', label: 'Gather', scene: 'Gather' },
            { key: 'clean', label: 'Clean', scene: 'Clean' },
            { key: 'sleep', label: 'Sleep', scene: 'Sleep' }
        ];

        // Matrix layout settings
        const cols = 3;
        const rows = 2;
        const buttonSpacingX = screenWidth * 0.2; // 20% of screen width between buttons
        const buttonSpacingY = screenHeight * 0.15; // 15% of screen height between buttons
        const startX = screenWidth * 0.2; // Start 20% from left
        const startY = screenHeight * 0.1; // Start 10% from top

        // Image and text sizing
        const imageScale = 0.08 * scale; // Slightly smaller for better matrix layout
        const fontSize = Math.floor(20 * scale);

        buttons.forEach((buttonData, index) => {
            // Calculate position in matrix
            const col = index % cols;
            const row = Math.floor(index / cols);
            const buttonX = startX + (col * buttonSpacingX);
            const buttonY = startY + (row * buttonSpacingY);

            // Create button image
            const buttonImage = this.add.image(buttonX, buttonY, buttonData.key);
            buttonImage.setScale(imageScale);

            // Add label text underneath
            const buttonText = this.add.text(buttonX, buttonY + (buttonImage.displayHeight / 2) + 15, buttonData.label, {
                fontFamily: 'Arial Black',
                fontSize: fontSize,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }).setOrigin(0.5);

            // Make both image and text interactive
            buttonImage.setInteractive({useHandCursor: true});
            buttonText.setInteractive({useHandCursor: true});

            // Add hover effects
            buttonImage.on('pointerover', () => {
                buttonImage.setTint(0xcccccc);
                buttonText.setTint(0xcccccc);
            });

            buttonImage.on('pointerout', () => {
                buttonImage.clearTint();
                buttonText.clearTint();
            });

            buttonText.on('pointerover', () => {
                buttonImage.setTint(0xcccccc);
                buttonText.setTint(0xcccccc);
            });

            buttonText.on('pointerout', () => {
                buttonImage.clearTint();
                buttonText.clearTint();
            });

            // Handle clicks on both image and text
            const goToScene = () => {
                this.scene.start(buttonData.scene);
            };

            buttonImage.on('pointerup', goToScene);
            buttonText.on('pointerup', goToScene);
        });
        this.registry.events.on('changedata', this.updateData, this);
    }

    toggleMusic() {
        if (this.game.bgMusic) {
            if (this.isMusicPlaying) {
                // Turn music off
                this.game.bgMusic.pause();
                this.musicButton.setTexture('musicOff');
                this.isMusicPlaying = false;
            } else {
                // Turn music on
                this.game.bgMusic.resume();
                this.musicButton.setTexture('musicOn');
                this.isMusicPlaying = true;
            }
        }
    }

    updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        const timeString = `${hours}:${minutes} ${ampm}`;
        
        if (this.clockText) {
            this.clockText.setText(timeString);
        }
    }
    
    getScale() {
        // More conservative scale calculation for browser compatibility
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Base reference size (your original game size)
        const baseWidth = 1024;
        const baseHeight = 768;
        
        // Calculate relative scale but cap it to prevent oversizing
        const scaleX = screenWidth / baseWidth;
        const scaleY = screenHeight / baseHeight;
        
        // Use smaller scale and clamp between reasonable bounds
        const scale = Math.min(scaleX, scaleY);
        
        // More conservative clamping - prevent things from getting too big
        return Math.max(0.4, Math.min(1.2, scale));
    }
    
    createTaskbar() {
        // Get scale factor
        const scale = this.getScale();
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Calculate sizes - base 40 becomes 60
        const taskbarHeight = 60 * scale;
        const buttonWidth = 100 * scale;
        const buttonHeight = 42 * scale;
        const fontSize = 18 * scale;
        const clockFontSize = Math.floor(14 * scale);
        
        // Create Windows 98 style taskbar
        const taskbar = this.add.graphics();
        taskbar.fillStyle(0xc0c0c0);
        taskbar.fillRect(0, screenHeight - taskbarHeight, screenWidth, taskbarHeight);
        taskbar.setScrollFactor(0);
        
        // Create Start button background
        const buttonX = 8;
        const buttonY = screenHeight - taskbarHeight + 8;
        
        this.startButtonBg = this.add.graphics();
        this.startButtonBg.fillStyle(0xc0c0c0);
        this.startButtonBg.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button border
        this.startButtonBg.lineStyle(2, 0xffffff);
        this.startButtonBg.strokeRect(buttonX, buttonY, buttonWidth, 2);
        this.startButtonBg.strokeRect(buttonX, buttonY, 2, buttonHeight);
        this.startButtonBg.lineStyle(2, 0x808080);
        this.startButtonBg.strokeRect(buttonX, buttonY + buttonHeight - 2, buttonWidth, 2);
        this.startButtonBg.strokeRect(buttonX + buttonWidth - 2, buttonY, 2, buttonHeight);
        
        this.startButtonBg.setScrollFactor(0);
        
        // Start button text
        this.startButton = this.add.text(
            buttonX + buttonWidth / 2, 
            buttonY + buttonHeight / 2, 
            'Start', 
            {
                fontFamily: 'Arial', 
                fontSize: fontSize, 
                color: '#000000',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);
        
        this.startButton.setScrollFactor(0);
        
        // Make start button interactive
        this.startButton.setInteractive();
        this.startButton.on('pointerup', () => this.toggleStartMenu());

        // SYSTEM TRAY AREA (RIGHT SIDE)
        const systemTrayWidth = 140 * scale;
        const systemTrayHeight = taskbarHeight - 8;
        const systemTrayX = screenWidth - systemTrayWidth - 4;
        const systemTrayY = screenHeight - taskbarHeight + 4;

        // Create system tray background with inset border (Windows 98 style)
        this.systemTray = this.add.graphics();
        this.systemTray.fillStyle(0xc0c0c0);
        this.systemTray.fillRect(systemTrayX, systemTrayY, systemTrayWidth, systemTrayHeight);
        
        // Inset border for system tray
        this.systemTray.lineStyle(1, 0x808080);
        this.systemTray.strokeRect(systemTrayX, systemTrayY, systemTrayWidth, 1);
        this.systemTray.strokeRect(systemTrayX, systemTrayY, 1, systemTrayHeight);
        this.systemTray.lineStyle(1, 0xffffff);
        this.systemTray.strokeRect(systemTrayX, systemTrayY + systemTrayHeight - 1, systemTrayWidth, 1);
        this.systemTray.strokeRect(systemTrayX + systemTrayWidth - 1, systemTrayY, 1, systemTrayHeight);
        
        this.systemTray.setScrollFactor(0);

        // MUSIC BUTTON (inside system tray, left side)
        const musicButtonSize = systemTrayHeight - 8;
        const musicButtonX = systemTrayX + 6;
        const musicButtonY = systemTrayY + 4;

        // Create music toggle button
        this.musicButton = this.add.image(
            musicButtonX + (musicButtonSize / 2), 
            musicButtonY + (musicButtonSize / 2), 
            this.isMusicPlaying ? 'musicOn' : 'musicOff'
        );
        this.musicButton.setDisplaySize(musicButtonSize, musicButtonSize);
        this.musicButton.setInteractive({useHandCursor: true});
        this.musicButton.setScrollFactor(0);

        // Add hover effects
        this.musicButton.on('pointerover', () => {
            this.musicButton.setTint(0xcccccc);
        });

        this.musicButton.on('pointerout', () => {
            this.musicButton.clearTint();
        });

        // Handle click to toggle music
        this.musicButton.on('pointerup', () => {
            this.toggleMusic();
        });

        // CLOCK (inside system tray, right side)
        const clockX = musicButtonX + musicButtonSize + 8;
        const clockY = systemTrayY + (systemTrayHeight / 2);

        // Create clock text
        this.clockText = this.add.text(clockX, clockY, '', {
            fontFamily: 'Arial',
            fontSize: clockFontSize,
            color: '#000000',
            fontWeight: 'normal'
        }).setOrigin(0, 0.5);
        
        this.clockText.setScrollFactor(0);

        // Initialize clock
        this.updateClock();

        // Update clock every second
        this.clockTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateClock,
            callbackScope: this,
            loop: true
        });
    }
    
    toggleStartMenu() {
        if (this.menuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }
    
    openStartMenu() {
        this.menuOpen = true;
        
        const scale = this.getScale();
        const screenHeight = this.cameras.main.height;
        
        // Scene list - updated to include Sleep
        const scenes = [
            { name: 'MainMenu', label: 'Main Menu' },
            { name: 'Game', label: 'Game' },
            { name: 'Stats', label: 'Stats' },
            { name: 'Play', label: 'Play' },
            { name: 'Feed', label: 'Feed' },
            { name: 'Gather', label: 'Gather' },
            { name: 'Clean', label: 'Clean' },
            { name: 'Sleep', label: 'Sleep' },
            { name: 'GameOver', label: 'Game Over' }
        ];
        
        // Menu dimensions - increased sizing
        const menuWidth = 220 * scale;
        const itemHeight = 40 * scale;
        const menuHeight = scenes.length * itemHeight + 15;
        const fontSize = 16 * scale;
        const taskbarHeight = 60 * scale;
        
        const menuX = 8;
        const menuY = screenHeight - taskbarHeight - menuHeight;
        
        // Create menu background
        this.startMenu = this.add.graphics();
        this.startMenu.fillStyle(0xc0c0c0);
        this.startMenu.fillRect(menuX, menuY, menuWidth, menuHeight);
        this.startMenu.lineStyle(1, 0x000000);
        this.startMenu.strokeRect(menuX, menuY, menuWidth, menuHeight);
        this.startMenu.setScrollFactor(0);
        
        // Create menu items
        this.menuItems = [];
        scenes.forEach((scene, index) => {
            const itemY = menuY + 8 + (index * itemHeight);
            
            const menuItem = this.add.text(menuX + 15, itemY + itemHeight / 2, scene.label, {
                fontFamily: 'Arial',
                fontSize: fontSize,
                color: '#000000'
            }).setOrigin(0, 0.5);
            
            menuItem.setScrollFactor(0);
            menuItem.setInteractive();
            
            menuItem.on('pointerover', () => {
                menuItem.setBackgroundColor('#0080ff');
                menuItem.setColor('#ffffff');
            });
            
            menuItem.on('pointerout', () => {
                menuItem.setBackgroundColor(null);
                menuItem.setColor('#000000');
            });
            
            menuItem.on('pointerup', () => {
                this.closeStartMenu();
                this.scene.start(scene.name);
            });
            
            this.menuItems.push(menuItem);
        });
        
        // Click outside to close
        this.time.delayedCall(100, () => {
            this.input.once('pointerup', () => {
                this.closeStartMenu();
            });
        });
    }
    
    closeStartMenu() {
        this.menuOpen = false;
        
        if (this.startMenu) {
            this.startMenu.destroy();
            this.startMenu = null;
        }
        
        if (this.menuItems) {
            this.menuItems.forEach(item => item.destroy());
            this.menuItems = [];
        }
    }

    updateData(parent, key, data) {
        if (key === 'metal') {
            this.metal = data;
        } else if (key === 'plastic') {
            this.plastic = data;
        } else if (key === 'magnets') {
            this.magnets = data;
        } else if (key === 'happiness') {
            this.happiness = data;
        }
    }
}