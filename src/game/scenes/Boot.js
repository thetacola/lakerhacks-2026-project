import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.image('menu-bar', 'assets/menu-bar.png');
        this.load.image('loading-bar', 'assets/loading-bar.png');
        this.load.image('loading-bar-unit', 'assets/loading-bar-unit.png')
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
