import { Scene } from 'phaser';

export class Sleep extends Scene {
    constructor() {
        super('Sleep');
    }

    create() {
        // Set a darker background color for the scene (darker teal)
        this.cameras.main.setBackgroundColor(0x004080);

        // Start background music if not playing (same as Main)
        if (!this.game.bgMusic || !this.game.bgMusic.isPlaying) {
            this.game.bgMusic = this.sound.add('bgMusic', {
                volume: 0.3, // Slightly quieter for sleep
                loop: true
            });
            this.game.bgMusic.play();
        }

        // Track music state
        this.isMusicPlaying = this.game.bgMusic && this.game.bgMusic.isPlaying;

        // Calculate dynamic sizing based on screen
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        // Get scale factor for consistent sizing
        const scale = this.getScale();

        // CREATE SINGLE WAKEUP BUTTON AT TOP RIGHT
        this.createWakeupButton(scale, screenWidth, screenHeight);

        // Create a larger circle using Phaser's graphics object - now scales with device
        this.circle = this.add.graphics();
        this.circle.fillStyle(0x800000); // Dark red color (darker than Main's red)
        const circleRadius = 50 * scale; // Scale the circle size
        this.circle.fillCircle(0, 0, circleRadius);

        // Position the circle at 3/4 down the screen (75% from top, 25% from bottom) - NO MOVEMENT
        this.circle.x = this.cameras.main.width / 2;
        this.circle.y = (this.cameras.main.height * 3) / 4;
        // Note: No startMovement() call - circle stays stationary

        // Create bottom taskbar (darker version)
        this.createTaskbar();

        // Initialize menu state
        this.menuOpen = false;
    }

    createWakeupButton(scale, screenWidth, screenHeight) {
        // Calculate positioning for top left
        const margin = 20 * scale; // Dynamic margin
        const buttonX = margin; // Left side with margin (changed from screenWidth - margin)
        const buttonY = margin; // Top with margin

        // Use the same scaling approach as Main scene buttons
        const imageScale = 0.08 * scale; // Same as Main scene matrix buttons
        const fontSize = Math.floor(20 * scale); // Same as Main scene

        // Create button image
        const buttonImage = this.add.image(buttonX, buttonY, 'wakeup');
        buttonImage.setScale(imageScale);
        buttonImage.setOrigin(0, 0); // Top-left origin (changed from 1, 0)

        // Add label text underneath, also left-aligned
        const buttonText = this.add.text(buttonX, buttonY + (buttonImage.displayHeight) + 15, 'Wake Up', {
            fontFamily: 'Arial Black',
            fontSize: fontSize,
            color: '#cccccc', // Slightly darker white
            stroke: '#000000',
            strokeThickness: 3, // Same as Main scene
            align: 'center'
        }).setOrigin(0, 0); // Left-aligned text (changed from 1, 0)

        // Make both image and text interactive
        buttonImage.setInteractive({useHandCursor: true});
        buttonText.setInteractive({useHandCursor: true});

        // Add hover effects (slightly different for sleep mode)
        buttonImage.on('pointerover', () => {
            buttonImage.setTint(0x999999);
            buttonText.setTint(0x999999);
        });

        buttonImage.on('pointerout', () => {
            buttonImage.clearTint();
            buttonText.clearTint();
        });

        buttonText.on('pointerover', () => {
            buttonImage.setTint(0x999999);
            buttonText.setTint(0x999999);
        });

        buttonText.on('pointerout', () => {
            buttonImage.clearTint();
            buttonText.clearTint();
        });

        // Handle clicks on both image and text - go back to Main
        const wakeUp = () => {
            console.log('Wake Up clicked - going to Main'); // Debug log
            this.scene.start('Main');
        };

        buttonImage.on('pointerup', wakeUp);
        buttonText.on('pointerup', wakeUp);
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
        // Simple scale calculation based on screen width - same as Main
        const screenWidth = this.cameras.main.width;
        if (screenWidth < 500) return 1.8;
        if (screenWidth < 800) return 1.5;
        if (screenWidth < 1200) return 1.3;
        return 1.1;
    }
    
    createTaskbar() {
        // Get scale factor
        const scale = this.getScale();
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Calculate sizes - same as Main
        const taskbarHeight = 60 * scale;
        const buttonWidth = 100 * scale;
        const buttonHeight = 42 * scale;
        const fontSize = 18 * scale;
        const clockFontSize = Math.floor(14 * scale);
        
        // Create darker Windows 98 style taskbar
        const taskbar = this.add.graphics();
        taskbar.fillStyle(0x808080); // Darker gray
        taskbar.fillRect(0, screenHeight - taskbarHeight, screenWidth, taskbarHeight);
        taskbar.setScrollFactor(0);
        
        // Create Start button background (darker)
        const buttonX = 8;
        const buttonY = screenHeight - taskbarHeight + 8;
        
        this.startButtonBg = this.add.graphics();
        this.startButtonBg.fillStyle(0x808080); // Darker gray
        this.startButtonBg.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button border (darker)
        this.startButtonBg.lineStyle(2, 0xaaaaaa); // Darker white
        this.startButtonBg.strokeRect(buttonX, buttonY, buttonWidth, 2);
        this.startButtonBg.strokeRect(buttonX, buttonY, 2, buttonHeight);
        this.startButtonBg.lineStyle(2, 0x404040); // Darker gray
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
                color: '#000000', // Lighter text
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);
        
        this.startButton.setScrollFactor(0);
        
        // Make start button interactive
        this.startButton.setInteractive();
        this.startButton.on('pointerup', () => this.toggleStartMenu());

        // SYSTEM TRAY AREA (RIGHT SIDE) - darker
        const systemTrayWidth = 140 * scale;
        const systemTrayHeight = taskbarHeight - 8;
        const systemTrayX = screenWidth - systemTrayWidth - 4;
        const systemTrayY = screenHeight - taskbarHeight + 4;

        // Create system tray background with inset border (darker Windows 98 style)
        this.systemTray = this.add.graphics();
        this.systemTray.fillStyle(0x808080); // Darker gray
        this.systemTray.fillRect(systemTrayX, systemTrayY, systemTrayWidth, systemTrayHeight);
        
        // Inset border for system tray (darker)
        this.systemTray.lineStyle(1, 0x404040); // Darker gray for top and left
        this.systemTray.strokeRect(systemTrayX, systemTrayY, systemTrayWidth, 1);
        this.systemTray.strokeRect(systemTrayX, systemTrayY, 1, systemTrayHeight);
        this.systemTray.lineStyle(1, 0xaaaaaa); // Darker white for bottom and right
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
            this.musicButton.setTint(0x999999);
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

        // Create clock text (lighter color)
        this.clockText = this.add.text(clockX, clockY, '', {
            fontFamily: 'Arial',
            fontSize: clockFontSize,
            color: '#000000', // Lighter text for dark background
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
        
        // Scene list - ONLY Wake Up is enabled
        const scenes = [
            { name: 'Main', label: 'Wake Up', enabled: true }, // Only enabled option
            { name: 'MainMenu', label: 'Main Menu', enabled: false },
            { name: 'Game', label: 'Game', enabled: false },
            { name: 'Stats', label: 'Stats', enabled: false },
            { name: 'Play', label: 'Play', enabled: false },
            { name: 'Feed', label: 'Feed', enabled: false },
            { name: 'Gather', label: 'Gather', enabled: false },
            { name: 'Clean', label: 'Clean', enabled: false },
            { name: 'GameOver', label: 'Game Over', enabled: false }
        ];
        
        // Menu dimensions - same as Main
        const menuWidth = 220 * scale;
        const itemHeight = 40 * scale;
        const menuHeight = scenes.length * itemHeight + 15;
        const fontSize = 16 * scale;
        const taskbarHeight = 60 * scale;
        
        const menuX = 8;
        const menuY = screenHeight - taskbarHeight - menuHeight;
        
        // Create menu background (darker)
        this.startMenu = this.add.graphics();
        this.startMenu.fillStyle(0x808080); // Darker gray
        this.startMenu.fillRect(menuX, menuY, menuWidth, menuHeight);
        this.startMenu.lineStyle(1, 0x404040); // Darker border
        this.startMenu.strokeRect(menuX, menuY, menuWidth, menuHeight);
        this.startMenu.setScrollFactor(0);
        
        // Create menu items
        this.menuItems = [];
        scenes.forEach((scene, index) => {
            const itemY = menuY + 8 + (index * itemHeight);
            
            // Determine color based on enabled state
            let textColor;
            if (scene.enabled) {
                textColor = '#ffff99'; // Bright yellow for Wake Up
            } else {
                textColor = '#666666'; // Dark gray for disabled items
            }
            
            const menuItem = this.add.text(menuX + 15, itemY + itemHeight / 2, scene.label, {
                fontFamily: 'Arial',
                fontSize: fontSize,
                color: textColor
            }).setOrigin(0, 0.5);
            
            menuItem.setScrollFactor(0);
            
            // Only make enabled items interactive
            if (scene.enabled) {
                menuItem.setInteractive();
                
                menuItem.on('pointerover', () => {
                    menuItem.setBackgroundColor('#004080'); // Darker blue
                    menuItem.setColor('#ffffff');
                });
                
                menuItem.on('pointerout', () => {
                    menuItem.setBackgroundColor(null);
                    menuItem.setColor('#ffff99'); // Restore yellow
                });
                
                menuItem.on('pointerup', () => {
                    console.log(`Menu item clicked: ${scene.label} -> ${scene.name}`); // Debug log
                    this.closeStartMenu();
                    this.scene.start(scene.name);
                });
            }
            // Disabled items have no interactivity - they're just visual
            
            this.menuItems.push(menuItem);
        });
        
        // Click outside to close
        this.time.delayedCall(100, () => {
            this.input.once('pointerup', (pointer, currentlyOver) => {
                // Only close if not clicking on menu items
                if (currentlyOver.length === 0) {
                    this.closeStartMenu();
                }
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
}