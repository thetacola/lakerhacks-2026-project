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

        this.add.text(512, 32, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // TODO: change to image
        const metalButton = this.add.text(100, 100, 'Metal', { fill: '#0f0' });
        const plasticButton = this.add.text(100, 130, 'Plastic', { fill: '#0f0' });
        const magnetsButton = this.add.text(100, 160, 'Magnets', { fill: '#0f0' })

        metalButton.setInteractive();
        plasticButton.setInteractive();
        magnetsButton.setInteractive();


        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });

    }
}
