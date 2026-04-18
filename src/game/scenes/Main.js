import { Scene } from 'phaser';

export class Main extends Scene
{
    constructor ()
    {
        super('Main');
    }

    create ()
    {
        // Set a background color for the scene
        this.cameras.main.setBackgroundColor(0x028af8);
        
        // Create a larger circle using Phaser's graphics object
        this.circle = this.add.graphics();
        this.circle.fillStyle(0xff0000); // Red color
        this.circle.fillCircle(0, 0, 50); // Circle with radius of 50 pixels
        
        // Position the circle at the center of the screen
        this.circle.x = this.cameras.main.width / 2;
        this.circle.y = this.cameras.main.height / 2;
        
        // Start the movement
        this.startMovement();
        
        // Create bottom taskbar
        this.createTaskbar();
        
        // Initialize menu state
        this.menuOpen = false;
    }
    
    createTaskbar ()
    {
        // Create Windows 98 style taskbar
        const taskbar = this.add.graphics();
        taskbar.fillStyle(0xc0c0c0); // Light gray
        taskbar.fillRect(0, this.cameras.main.height - 40, this.cameras.main.width, 40);
        
        // Create Start button background
        this.startButtonBg = this.add.graphics();
        this.startButtonBg.fillStyle(0xc0c0c0);
        this.startButtonBg.fillRect(5, this.cameras.main.height - 35, 60, 30);
        
        // Start button border
        this.startButtonBg.lineStyle(2, 0xffffff);
        this.startButtonBg.strokeRect(5, this.cameras.main.height - 35, 60, 2);
        this.startButtonBg.strokeRect(5, this.cameras.main.height - 35, 2, 30);
        this.startButtonBg.lineStyle(2, 0x808080);
        this.startButtonBg.strokeRect(5, this.cameras.main.height - 7, 60, 2);
        this.startButtonBg.strokeRect(63, this.cameras.main.height - 35, 2, 30);
        
        // Start button text
        this.startButton = this.add.text(35, this.cameras.main.height - 20, 'Start', {
            fontFamily: 'Arial', 
            fontSize: 14, 
            color: '#000000'
        }).setOrigin(0.5);
        
        // Make start button interactive
        this.startButton.setInteractive();
        this.startButton.on('pointerup', () => this.toggleStartMenu());
    }
    
    toggleStartMenu ()
    {
        if (this.menuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }
    
    openStartMenu ()
    {
        this.menuOpen = true;
        
        // Scene list
        const scenes = [
            { name: 'MainMenu', label: 'Main Menu' },
            { name: 'Game', label: 'Game' },
            { name: 'Stats', label: 'Stats' },
            { name: 'Play', label: 'Play' },
            { name: 'Feed', label: 'Feed' },
            { name: 'Gather', label: 'Gather' },
            { name: 'Clean', label: 'Clean' },
            { name: 'GameOver', label: 'Game Over' }
        ];
        
        // Menu dimensions
        const menuWidth = 180;
        const menuHeight = scenes.length * 25 + 10;
        const menuX = 5;
        const menuY = this.cameras.main.height - 40 - menuHeight;
        
        // Create menu background
        this.startMenu = this.add.graphics();
        this.startMenu.fillStyle(0xc0c0c0);
        this.startMenu.fillRect(menuX, menuY, menuWidth, menuHeight);
        
        // Menu border
        this.startMenu.lineStyle(1, 0x000000);
        this.startMenu.strokeRect(menuX, menuY, menuWidth, menuHeight);
        
        // Create menu items
        this.menuItems = [];
        scenes.forEach((scene, index) => {
            const itemY = menuY + 5 + (index * 25);
            
            const menuItem = this.add.text(menuX + 10, itemY + 12, scene.label, {
                fontFamily: 'Arial',
                fontSize: 12,
                color: '#000000'
            }).setOrigin(0, 0.5);
            
            // Make interactive
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
        this.input.once('pointerup', (pointer) => {
            const menuBounds = new Phaser.Geom.Rectangle(menuX, menuY, menuWidth, menuHeight);
            if (!menuBounds.contains(pointer.x, pointer.y)) {
                this.closeStartMenu();
            }
        });
    }
    
    closeStartMenu ()
    {
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
    
    startMovement ()
    {
        // Move to left side
        this.tweens.add({
            targets: this.circle,
            x: 50,
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
                // Move to right side
                this.tweens.add({
                    targets: this.circle,
                    x: this.cameras.main.width - 50,
                    duration: 4000,
                    ease: 'Linear',
                    onComplete: () => {
                        // Return to center
                        this.tweens.add({
                            targets: this.circle,
                            x: this.cameras.main.width / 2,
                            duration: 3000,
                            ease: 'Linear',
                            onComplete: () => {
                                this.startMovement();
                            }
                        });
                    }
                });
            }
        });
        
        this.bounceMovement();
    }
    
    bounceMovement ()
    {
        this.tweens.add({
            targets: this.circle,
            y: this.cameras.main.height / 2 - 100,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
}