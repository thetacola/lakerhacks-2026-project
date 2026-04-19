import { Scene } from 'phaser';

export class Stats extends Scene
{
    constructor ()
    {
        super('Stats');
    }

    init() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        // this.cameras.main.height - 40, this.cameras.main.width

        this.background = this.add.image(512, 384, 'background').setAlpha(0.5);
        this.background.displayWidth = this.cameras.main.width;
        this.background.displayHeight = this.cameras.main.height;
    }

    create ()
    {

        this.add.image(512, 16, 'menu-bar');

        this.add.text(10, 16, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            align: 'left'
        }).setOrigin(0.0, 0.5);

        const metalButton =  createLoadingBar('Metals', 10, 100, 65, this);
        const plasticButton = createLoadingBar('Plastic', 10, 150, 72.8, this);
        const magnetsButton = createLoadingBar('Magnets', 10, 200, 22, this);
        const happinessPercent = createLoadingBar('Happiness', 10, 250, 100, this);

        const statusBg = this.add.image(10, 275, 'dialog-box').setOrigin(0.0);

        const statText = this.make.text({
            x: 512,
            y: 275,
            text: '',
            align: 'center',
            style: {
                font: 'bold 25px Arial',
                fill: 'white',
                wordWrap: { width: 924 }
            }
        }).setOrigin(0.5, 0.0);

        const backButton = this.add.text(100, 600, 'Back', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'left'
        }).setOrigin(0.5);

        metalButton.setInteractive();
        plasticButton.setInteractive();
        magnetsButton.setInteractive();
        backButton.setInteractive();

        metalButton.on('pointerdown', () => {
           statText.setText('E-waste oftentimes contains heavy metals, such as lead and mercury. When these metals are put in a landfill, they oftentimes seep into the soil and groundwater, contaminating the environment and leading to health problems for those who live around it. Instead of going to a landfill, these metals can instead be recycled, being put into new electronic devices and preventing them from spreading into the environment.')
        });
        plasticButton.on('pointerdown', () => {
           statText.setText('Many different electronic devices use plastic, especially in their exterior cases. When put into landfills, the plastic falls apart, leaving microplastics in the soil. Most other materials are broken up and decomposed by bacteria, however plastics are an exception. The items themselves can last for hundreds of years, though the microscopic plastic particles still remain. Unfortunately, there is also no known way for many different types of plastics used in electronic devices to be recycled. Thankfully, $lil_guy_name can handle plastic no problem!');
        });
        magnetsButton.on('pointerdown', () => {
            statText.setText('The risks of magnets in e-waste is similar to that of metals. However, magnets oftentimes contain specific metals that are considered as both in limited supply and essential to electronics. Like metals, magnets can seep out contaminants into the surrounding soil and groundwater when in a landfill. Recycling magnets makes sure that these rare metals still have some supply, and prevents them from causing harm in a landfill.');
        });
        backButton.on('pointerup', () => {
            this.scene.start('Main');
        });



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
}
