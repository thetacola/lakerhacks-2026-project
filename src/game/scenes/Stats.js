import { Scene } from 'phaser';

export class Stats extends Scene
{
    constructor ()
    {
        super('Stats');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);
        this.add.image(512, 16, 'menu-bar');

        this.add.text(10, 16, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            align: 'left'
        }).setOrigin(0.0, 0.5);

        const metalButton =  createLoadingBar('Metals', 10, 100, 65, this);
        const plasticButton = this.add.text(10, 150, 'Plastic', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setOrigin(0.0, 0.5);
        const magnetsButton = this.add.text(10, 200, 'Magnets', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setOrigin(0.0, 0.5);
        const happinessPercent = this.add.text(10, 250, 'Happiness', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setOrigin(0.0, 0.5);
        const statText = this.make.text({
            x: 512,
            y: 350,
            text: '',
            align: 'center',
            style: {
                font: 'bold 25px Arial',
                fill: 'white',
                wordWrap: { width: 600 }
            }
        }).setOrigin(0.5);

        const backButton = this.add.text(100, 600, 'Back', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setOrigin(0.5);

        metalButton.setInteractive();
        plasticButton.setInteractive();
        magnetsButton.setInteractive();

        metalButton.on('pointerdown', () => {
           statText.setText('TODO: information about e-waste metals https://www.sciencedirect.com/science/article/abs/pii/S0957582022003160')
        });



        function createLoadingBar (text, posX, posY, percent, scene) {
            var bar = scene.add.image(posX, posY, 'loading-bar').setOrigin(0.0, 0.5);

            var numObjs = Math.round((percent / 5));
            for (var i = 0; i < numObjs; i++) {
                var offsetX = posX + (i * 30);
                scene.add.image(offsetX, posY, 'loading-bar-unit').setOrigin(0.0, 0.5);
            }

            scene.add.text(10, 100, text, {
                fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'left'
            }).setOrigin(0.0, 0.5);

            return bar;
        }
    }
}
