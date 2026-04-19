import { Scene } from 'phaser';

export class Main extends Scene {
    constructor() {
        super('Main');
        
        // Initialize stats
        this.computers = 0;
        this.phones = 0;
        this.games = 0;
        this.hunger = 0;
        this.energy = 100;
        this.fun = 0;
        this.cleanliness = 100;
        
        // UI state
        this.menuOpen = false;
        this.isMusicPlaying = false;
    }

    create() {
        // Initialize registry with current values
        this.initializeRegistry();
        
        // Set background and music
        this.cameras.main.setBackgroundColor(0x008080);
        this.setupBackgroundMusic();
        
        // Get screen dimensions
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Create all game elements
        this.createButtonMatrix(screenWidth, screenHeight);
        this.createBabyAnimations();
        this.createBaby();
        this.createTaskbar(screenWidth, screenHeight);
        
        // Start game systems
        this.startBabyMovement();
        this.startStatDecrease();
        this.startParticleSys();
        
        // Set up registry listener for color updates
        this.registry.events.on('changedata', this.handleRegistryChange, this);
        
        // Update baby color after a small delay
        this.time.delayedCall(100, () => this.updateBabyColor());
    }

    initializeRegistry() {
        // Set current stats
        this.registry.set('computers', this.computers);
        this.registry.set('phones', this.phones);
        this.registry.set('games', this.games);
        this.registry.set('hunger', this.hunger);
        this.registry.set('energy', this.energy);
        this.registry.set('fun', this.fun);
        this.registry.set('cleanliness', this.cleanliness);
        
        // Initialize collection stats if they don't exist
        ['phonesFound', 'gamesFound', 'computersFound'].forEach(stat => {
            if (!this.registry.has(stat)) {
                this.registry.set(stat, 0);
            }
        });
        
        // Calculate and set happiness
        this.updateHappiness();
    }

    updateHappiness() {
        const happiness = (this.hunger + this.energy + this.fun + this.cleanliness) / 4;
        this.registry.set('happiness', happiness);
    }

    setupBackgroundMusic() {
        if (!this.game.bgMusic || !this.game.bgMusic.isPlaying) {
            this.game.bgMusic = this.sound.add('bgMusic', {
                volume: 0.5,
                loop: true
            });
            this.game.bgMusic.play();
        }
        this.isMusicPlaying = this.game.bgMusic && this.game.bgMusic.isPlaying;
    }

    createBabyAnimations() {
        this.anims.create({
            key: 'baby-crawl',
            frames: this.anims.generateFrameNames('baby', {
                prefix: 'mm-crawl-',
                suffix: '.png',
                start: 5,
                end: 9,
                zeroPad: 0
            }),
            frameRate: 8,
            repeat: -1
        });
    }

    createBaby() {
        this.baby = this.add.sprite(
            this.cameras.main.width / 2,
            (this.cameras.main.height * 3) / 4,
            'baby'
        );
        this.baby.setScale(2.5);
        this.baby.play('baby-crawl');
        this.updateBabyColor();
    }

    updateBabyColor() {
        const phones = this.registry.get('phones') || 0;
        const games = this.registry.get('games') || 0;
        const computers = this.registry.get('computers') || 0;

        // If no consumption, clear tint
        if (phones === 0 && games === 0 && computers === 0) {
            if (this.baby) this.baby.clearTint();
            return;
        }

        // Find the maximum value and check for ties
        const maxValue = Math.max(phones, games, computers);
        const tiedCount = [phones, games, computers].filter(val => val === maxValue).length;
        
        let tintColor = 0xffffff;
        
        // If there's a tie, stay neutral
        if (tiedCount > 1) {
            tintColor = 0xffffff;
        } else {
            // Apply color for the highest value
            if (computers === maxValue) tintColor = 0xff0000; // Red
            else if (games === maxValue) tintColor = 0x00ff00; // Green
            else if (phones === maxValue) tintColor = 0x0000ff; // Blue
        }

        if (this.baby) {
            if (tintColor === 0xffffff) {
                this.baby.clearTint();
            } else {
                this.baby.setTint(tintColor);
            }
        }
    }

    startBabyMovement() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const babyWidth = this.baby.displayWidth / 2;

        // Horizontal movement cycle
        this.baby.setFlipX(false);
        this.tweens.add({
            targets: this.baby,
            x: babyWidth,
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
                this.baby.setFlipX(true);
                this.tweens.add({
                    targets: this.baby,
                    x: screenWidth - babyWidth,
                    duration: 4000,
                    ease: 'Linear',
                    onComplete: () => {
                        this.baby.setFlipX(false);
                        this.tweens.add({
                            targets: this.baby,
                            x: screenWidth / 2,
                            duration: 3000,
                            ease: 'Linear',
                            onComplete: () => this.startBabyMovement()
                        });
                    }
                });
            }
        });

        // Vertical bounce movement
        this.tweens.add({
            targets: this.baby,
            y: ((screenHeight * 3) / 4) - 120,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    startStatDecrease() {
        this.time.addEvent({
            delay: 6000,
            callback: () => {
                // Decrease stats
                this.hunger = Math.max(0, this.hunger - 1);
                this.energy = Math.max(0, this.energy - 1);
                this.fun = Math.max(0, this.fun - 1);
                this.cleanliness = Math.max(0, this.cleanliness - 1);

                // Update registry
                this.registry.set('hunger', this.hunger);
                this.registry.set('energy', this.energy);
                this.registry.set('fun', this.fun);
                this.registry.set('cleanliness', this.cleanliness);

                // Update happiness
                this.updateHappiness();
            },
            loop: true
        });
    }

    startParticleSys() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.hunger < 20) {
                    const startX = this.baby.x + (Math.random() - 0.5) * 120;
                    const startY = this.baby.y + (Math.random() - 0.5) * 40;

                    const bubble = this.add.image(startX, startY, 'particle_crt');

                    const startScale = Math.random() * 5;
                    const growthFactor = 1.1 + Math.random();
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
                }
                if (this.energy < 20) {
                    const startX = this.baby.x + (Math.random() - 0.5) * 120;
                    const startY = this.baby.y + (Math.random() - 0.5) * 40;

                    const bubble = this.add.image(startX, startY, 'particle_z');

                    const startScale = Math.random() * 5;
                    const growthFactor = 1.1 + Math.random();
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
                }
                if (this.fun < 20) {
                    const startX = this.baby.x + (Math.random() - 0.5) * 120;
                    const startY = this.baby.y + (Math.random() - 0.5) * 40;

                    const bubble = this.add.image(startX, startY, 'particle_ball');

                    const startScale = Math.random() * 5;
                    const growthFactor = 1.1 + Math.random();
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
                }
                if (this.cleanliness < 20) {
                    const startX = this.baby.x + (Math.random() - 0.5) * 120;
                    const startY = this.baby.y + (Math.random() - 0.5) * 40;

                    const bubble = this.add.image(startX, startY, 'particle_smelly');

                    const startScale = Math.random() * 5;
                    const growthFactor = 1.1 + Math.random();
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
                }
            },
            loop: true
        });
    }

    handleRegistryChange(parent, key, data) {
        // Update local stats on registry changes
        if (['computers', 'phones', 'games', 'hunger', 'energy', 'fun', 'cleanliness'].includes(key)) {
            this[key] = data;
        }

        // Update baby color when e-waste stats change
        if (['phones', 'games', 'computers'].includes(key)) {
            this.updateBabyColor();
        }
    }

    createButtonMatrix(screenWidth, screenHeight) {
        // Define button matrix layout (2 rows, 3 columns)
        const buttons = [
            { key: 'stats', label: 'Stats', scene: 'Stats' },
            { key: 'play', label: 'Play', scene: 'Play' },
            { key: 'feed', label: 'Feed', scene: 'Feed' },
            { key: 'gather', label: 'Gather', scene: 'Gather' },
            { key: 'clean', label: 'Clean', scene: 'Clean' },
            { key: 'sleep', label: 'Sleep', scene: 'Sleep' }
        ];

        // LEFT-ORIENTED matrix layout settings
        const cols = 3;
        const rows = 2;
        const buttonSpacingX = 160; // Reduced spacing between buttons
        const buttonSpacingY = 120;  // Same vertical spacing
        const startX = 80;          // Much closer to left edge (was 200)
        const startY = 80;          // Same top position

        // FIXED sizing - no more scale multiplication
        const imageScale = 0.06;    // Fixed scale
        const fontSize = 16;        // Fixed font size

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
                strokeThickness: 2,
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
        // Return fixed scale of 1 - no more dynamic scaling
        return 1;
    }
    
    createTaskbar(screenWidth, screenHeight) {
        // FIXED sizes - no more scaling
        const taskbarHeight = 50;
        const buttonWidth = 80;
        const buttonHeight = 35;
        const fontSize = 14;
        const clockFontSize = 12;
        
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
        const systemTrayWidth = 120;
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
        if (key === 'computers') {
            this.computers = data;
        } else if (key === 'phones') {
            this.phones = data;
        } else if (key === 'games') {
            this.games = data;
        } else if (key === 'hunger') {
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
