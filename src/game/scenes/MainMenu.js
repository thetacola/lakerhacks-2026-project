import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'logo');

        const mainButton = this.add.text(512, 460, 'Main', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const statsButton = this.add.text(512, 500, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const playButton = this.add.text(512, 540, 'Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const feedButton = this.add.text(512, 580, 'Feed', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const gatherButton = this.add.text(512, 620, 'Gather', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const cleanButton = this.add.text(512, 660, 'Clean', {
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
