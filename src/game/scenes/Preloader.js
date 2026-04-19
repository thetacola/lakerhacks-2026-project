import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        // Use full paths as shown in README - no setPath()
        this.load.image('musicOn', 'assets/sound_on.png');
        this.load.image('musicOff', 'assets/sound_mute.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('stats', 'assets/stats.png');
        this.load.image('play', 'assets/play.png');
        this.load.image('feed', 'assets/feed.png');
        this.load.image('gather', 'assets/gather.png');
        this.load.image('clean', 'assets/clean.png');
        this.load.image('sleep', 'assets/sleep.png');
        this.load.image('wakeup', 'assets/wakeup.png');
        this.load.audio('bgMusic', 'assets/bgm.mp3');
        this.load.image('menu-bar', 'assets/menu-bar.png');
        this.load.image('loading-bar', 'assets/loading-bar.png');
        this.load.image('loading-bar-unit', 'assets/loading-bar-unit.png');
        this.load.image('dialog-box', 'assets/dialog-box.png');

    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
