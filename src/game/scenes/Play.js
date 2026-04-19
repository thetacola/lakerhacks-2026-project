import { Scene } from 'phaser';

export class Play extends Scene
{
    constructor ()
    {
        super('Play');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        // Calculate dynamic sizing based on screen
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Create baby animations
        this.createBallAnimations();

        this.hoopX = 900;
        this.hoopY = 400;
        this.hoopStand = this.add.image(this.hoopX, this.hoopY, 'hoop-stand');
        this.physics.world.enable(this.hoopStand);

        // Create the baby character as an animated sprite
        this.babyBasketball = this.add.sprite(
            100,
            (this.cameras.main.height * 3) / 4,
                                    'baby-basketball'
        );
        this.physics.world.enable(this.babyBasketball);



        this.hoopNet = this.add.image(this.hoopX, this.hoopY, 'hoop-net');
        this.physics.world.enable(this.hoopNet);

        this.physics.add.collider(this.babyBasketball, this.hoopStand);
        this.physics.add.collider(this.babyBasketball, this.hoopNet);

        this.physics.world.setBoundsCollision();

        this.physics.world.gravity.x = 1;
        this.physics.world.defaults.debugShowBody = true;;

        // Scale the baby based on screen size
        this.babyBasketball.setScale(2.5); // Adjust this multiplier as needed

        // Start the animation
        this.babyBasketball.play('baby-basketball');

        this.input.once('pointerdown', () => {

            this.scene.start('Main');

        });
    }


    createBallAnimations() {
        // Create movement animation using only frames 5-9
        this.anims.create({
            key: 'baby-basketball',
            frames: this.anims.generateFrameNames('baby-basketball', {
                prefix: 'mm-basketball-',
                suffix: '.png',
                start: 0,
                end: 2,    // Only frames 5-9
                zeroPad: 0
            }),
            frameRate: 8,  // Adjust this for speed (try 6-12)
        repeat: -1     // Loop forever
        });
    }
}
