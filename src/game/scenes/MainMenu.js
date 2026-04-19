import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    init () {
        var bg = this.add.graphics();
        bg.fillStyle(0xc0c0c0);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        bg.lineStyle(2, 0xffffff);
        bg.strokeRect(0, 0, this.cameras.main.width, 2);
        bg.strokeRect(0, 0, 2, this.cameras.main.height);
        bg.lineStyle(2, 0x808080);
        bg.strokeRect(0, this.cameras.main.height - 2, this.cameras.main.width, 2);
        bg.strokeRect(this.cameras.main.width - 2, 0, 2, this.cameras.main.height);
    }

    create ()
    {
        //this.add.image(512, 384, 'background');

        this.add.image(this.cameras.main.width / 2, 300, 'logo');

        const mainButton = this.add.text(this.cameras.main.width / 2, 460, 'Main', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const statsButton = this.add.text(this.cameras.main.width / 2, 500, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const playButton = this.add.text(this.cameras.main.width / 2, 540, 'Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const feedButton = this.add.text(this.cameras.main.width / 2, 580, 'Feed', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const gatherButton = this.add.text(this.cameras.main.width / 2, 620, 'Gather', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const cleanButton = this.add.text(this.cameras.main.width / 2, 660, 'Clean', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        mainButton.setInteractive();
        statsButton.setInteractive();
        playButton.setInteractive();
        feedButton.setInteractive();
        gatherButton.setInteractive();
        cleanButton.setInteractive();

        mainButton.on('pointerup', () => this.scene.start('Main'))
        statsButton.on('pointerup', () => this.scene.start('Stats'))
        playButton.on('pointerup', () => this.scene.start('Play'))
        feedButton.on('pointerup', () => this.scene.start('Feed'))
        gatherButton.on('pointerup', () => this.scene.start('Gather'))
        cleanButton.on('pointerup', () => this.scene.start('Clean'))
    }
}
