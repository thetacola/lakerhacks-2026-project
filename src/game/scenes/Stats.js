import { Scene } from 'phaser';

export class Stats extends Scene
{
    constructor ()
    {
        super('Stats');

        this.computers = 0;
        this.phones = 0;
        this.games = 0;
        this.happiness = 0;
    }

    init() {

        this.cameras.main.setBackgroundColor(0x00ff00);
        // this.cameras.main.height - 40, this.cameras.main.width

        var bg = this.add.graphics();
        bg.fillStyle(0xc0c0c0);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        bg.lineStyle(2, 0xffffff);
        bg.strokeRect(0, 33, this.cameras.main.width, 2);
        bg.strokeRect(0, 33, 2, this.cameras.main.height);
        bg.lineStyle(2, 0x808080);
        bg.strokeRect(0, this.cameras.main.height - 2, this.cameras.main.width, 2);
        bg.strokeRect(this.cameras.main.width - 2, 0, 2, this.cameras.main.height);

        var menuBar = this.add.graphics();
        menuBar.fillGradientStyle(
            0x0414c8,
            0x008abf,
            0x0414c8,
            0x008abf,
            1.0
        );
        menuBar.fillRect(0, 0, this.cameras.main.width, 32);
    }

    create ()
    {

        this.computers = this.registry.get('computers') || 0;
        this.phones = this.registry.get('phones') || 0;
        this.games = this.registry.get('games') || 0;
        this.happiness = this.registry.get('happiness');

        this.add.text(10, 16, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            align: 'left'
        }).setOrigin(0.0, 0.5);

        this.computersButton = createLoadingBar('Computers', 10, 100, this.computers, this);
        this.phonesButton = createLoadingBar('Phones', 10, 150, this.phones, this);
        this.gamesButton = createLoadingBar('Game Consoles', 10, 200, this.games, this);
        this.happinessPercent = createLoadingBar('Happiness', 10, 250, this.happiness, this);

        const statusBg = this.add.image(10, 275, 'dialog-box').setOrigin(0.0);

        const statText = this.make.text({
            x: 20,
            y: 280,
            text: '',
            align: 'left',
            style: {
                font: 'bold 25px Arial',
                fill: 'white',
                wordWrap: { width: 924 }
            }
        }).setOrigin(0.0, 0.0);

        const backButton = this.add.text(100, 600, 'Back', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setOrigin(0.5);

        this.computersButton.setInteractive();
        this.phonesButton.setInteractive();
        this.gamesButton.setInteractive();
        this.happinessPercent.setInteractive();
        backButton.setInteractive();

        this.computersButton.on('pointerdown', () => {
           statText.setText('Computers contain valuable materials like precious metals, rare earth elements, and reusable components. When disposed of improperly, they can leak toxic substances like lead, mercury, and cadmium into the environment. Proper recycling allows these materials to be recovered and reused, reducing the need for new mining and preventing environmental contamination.');
        });
        this.phonesButton.on('pointerdown', () => {
           statText.setText('Mobile phones contain precious metals like gold, silver, and platinum, as well as rare earth elements. Despite their small size, phones have a significant environmental impact due to the mining required for their components. Recycling phones helps recover these valuable materials and prevents toxic substances from entering landfills and groundwater.');
        });
        this.gamesButton.on('pointerdown', () => {
            statText.setText('Game consoles contain complex electronic components including processors, memory chips, and circuit boards with valuable metals. They often contain hazardous materials like lead-based solder and flame retardants. Proper e-waste recycling ensures these materials are safely processed and valuable components can be reused in new electronics.');
        });
        this.happinessPercent.on('pointerdown', () => {
           statText.setText('Your creature\'s overall happiness is based on its needs. Unfortunately, the creature has not yet learned how to speak, as such they cannot communicate these needs to you. Making sure they\'re fed, well-rested, entertained, and clean will all ensure a happy critter.')
        });
        backButton.on('pointerup', () => {
            this.scene.start('Main');
        });

        this.registry.events.on('changedata', this.updateData, this);

        function createLoadingBar (text, posX, posY, percent, scene) {
            var bar = scene.add.image(posX, posY, 'loading-bar').setOrigin(0.0, 0.5);

            var numObjs = Math.round((percent / 5));
            for (var i = 0; i < numObjs; i++) {
                var offsetX = posX + (i * 30);
                scene.add.image(offsetX + 1, posY, 'loading-bar-unit').setOrigin(0.0, 0.5);
            }

            scene.add.text(posX, posY, text, {
                fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'left'
            }).setOrigin(0.0, 0.5);

            return bar;
        }
    }

    updateData (parent, key, data) {
        if (key === 'computers') {
            this.computers = data;
        } else if (key === 'phones') {
            this.phones = data;
        } else if (key === 'games') {
            this.games = data;
        } else if (key === 'happiness') {
            this.happiness = data;
        }
    }
}
