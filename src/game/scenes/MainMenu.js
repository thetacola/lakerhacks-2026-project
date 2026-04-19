import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    init () {
        // Windows 98 style background
        var bg = this.add.graphics();
        bg.fillStyle(0xc0c0c0); // Classic Windows gray
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Outer border (raised effect)
        bg.lineStyle(2, 0xffffff);
        bg.strokeRect(0, 0, this.cameras.main.width, 2);
        bg.strokeRect(0, 0, 2, this.cameras.main.height);
        bg.lineStyle(2, 0x808080);
        bg.strokeRect(0, this.cameras.main.height - 2, this.cameras.main.width, 2);
        bg.strokeRect(this.cameras.main.width - 2, 0, 2, this.cameras.main.height);
    }

    create ()
    {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Game title - replacing the Phaser logo
        this.add.text(centerX, 250, 'E-Waste Recycler Monster', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#000080', // Dark blue like Windows 98 title bars
            stroke: '#ffffff',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(centerX, 320, 'Help the monster grow by recycling e-waste!', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // Windows 98 style Start Game button
        this.createWindows98Button(centerX, centerY + 50, 'Start Game', () => {
            this.scene.start('Main');
        });
    }

    createWindows98Button(x, y, text, callback) {
        const buttonWidth = 200;
        const buttonHeight = 50;
        
        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xc0c0c0); // Same gray as background
        buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
        
        // Button border (raised effect)
        // Top and left borders (white for raised look)
        buttonBg.lineStyle(2, 0xffffff);
        buttonBg.strokeRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, 2); // Top
        buttonBg.strokeRect(x - buttonWidth/2, y - buttonHeight/2, 2, buttonHeight); // Left
        
        // Bottom and right borders (dark gray for shadow)
        buttonBg.lineStyle(2, 0x808080);
        buttonBg.strokeRect(x - buttonWidth/2, y + buttonHeight/2 - 2, buttonWidth, 2); // Bottom
        buttonBg.strokeRect(x + buttonWidth/2 - 2, y - buttonHeight/2, 2, buttonHeight); // Right
        
        // Inner shadow for more depth
        buttonBg.lineStyle(1, 0x000000);
        buttonBg.strokeRect(x - buttonWidth/2 + 2, y + buttonHeight/2 - 3, buttonWidth - 4, 1); // Bottom inner
        buttonBg.strokeRect(x + buttonWidth/2 - 3, y - buttonHeight/2 + 2, 1, buttonHeight - 4); // Right inner

        // Button text
        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // Create interactive area
        const buttonArea = this.add.zone(x, y, buttonWidth, buttonHeight);
        buttonArea.setInteractive();

        // Button hover and click effects
        buttonArea.on('pointerover', () => {
            buttonText.setColor('#0000ff'); // Blue text on hover
        });

        buttonArea.on('pointerout', () => {
            buttonText.setColor('#000000'); // Back to black
        });

        buttonArea.on('pointerdown', () => {
            // Pressed effect - reverse the border colors
            buttonBg.clear();
            buttonBg.fillStyle(0xc0c0c0);
            buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
            
            // Pressed borders (inverted)
            buttonBg.lineStyle(2, 0x808080);
            buttonBg.strokeRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, 2); // Top (dark)
            buttonBg.strokeRect(x - buttonWidth/2, y - buttonHeight/2, 2, buttonHeight); // Left (dark)
            
            buttonBg.lineStyle(2, 0xffffff);
            buttonBg.strokeRect(x - buttonWidth/2, y + buttonHeight/2 - 2, buttonWidth, 2); // Bottom (light)
            buttonBg.strokeRect(x + buttonWidth/2 - 2, y - buttonHeight/2, 2, buttonHeight); // Right (light)

            // Move text slightly to simulate press
            buttonText.setPosition(x + 1, y + 1);
        });

        buttonArea.on('pointerup', () => {
            // Reset to normal state
            buttonBg.clear();
            buttonBg.fillStyle(0xc0c0c0);
            buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
            
            // Normal raised borders
            buttonBg.lineStyle(2, 0xffffff);
            buttonBg.strokeRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, 2);
            buttonBg.strokeRect(x - buttonWidth/2, y - buttonHeight/2, 2, buttonHeight);
            
            buttonBg.lineStyle(2, 0x808080);
            buttonBg.strokeRect(x - buttonWidth/2, y + buttonHeight/2 - 2, buttonWidth, 2);
            buttonBg.strokeRect(x + buttonWidth/2 - 2, y - buttonHeight/2, 2, buttonHeight);
            
            buttonBg.lineStyle(1, 0x000000);
            buttonBg.strokeRect(x - buttonWidth/2 + 2, y + buttonHeight/2 - 3, buttonWidth - 4, 1);
            buttonBg.strokeRect(x + buttonWidth/2 - 3, y - buttonHeight/2 + 2, 1, buttonHeight - 4);

            // Reset text position
            buttonText.setPosition(x, y);
            
            // Execute callback
            if (callback) {
                callback();
            }
        });

        return { buttonBg, buttonText, buttonArea };
    }
}