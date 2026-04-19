import { Scene } from 'phaser';

export class Stats extends Scene
{
    constructor ()
    {
        super('Stats');

        this.metalButton;
        this.plasticButton;
        this.magnetsButton;
        this.happinessPercent;
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

        this.add.text(10, 16, 'Stats', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            align: 'left'
        }).setOrigin(0.0, 0.5);

        this.metalButton =  createLoadingBar('Metals', 10, 100, 65, this);
        this.plasticButton = createLoadingBar('Plastic', 10, 150, 72.8, this);
        this.magnetsButton = createLoadingBar('Magnets', 10, 200, 22, this);
        this.happinessPercent = createLoadingBar('Happiness', 10, 250, 100, this);

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

        this.metalButton.setInteractive();
        this.plasticButton.setInteractive();
        this.magnetsButton.setInteractive();
        backButton.setInteractive();

        this.metalButton.on('pointerdown', () => {
           statText.setText('E-waste oftentimes contains heavy metals, such as lead and mercury. When these metals are put in a landfill, they oftentimes seep into the soil and groundwater, contaminating the environment and leading to health problems for those who live around it. Instead of going to a landfill, these metals can instead be recycled, being put into new electronic devices and preventing them from spreading into the environment.')
        });
        this.plasticButton.on('pointerdown', () => {
           statText.setText('Many different electronic devices use plastic, especially in their exterior cases. When put into landfills, the plastic falls apart, leaving microplastics in the soil. Most other materials are broken up and decomposed by bacteria, however plastics are an exception. The items themselves can last for hundreds of years, though the microscopic plastic particles still remain. Unfortunately, there is also no known way for many different types of plastics used in electronic devices to be recycled. Thankfully, $lil_guy_name can handle plastic no problem!');
        });
        this.magnetsButton.on('pointerdown', () => {
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

    updateData (parent, key, data) {
        if (key === 'metal') {
            this.metalButton =  createLoadingBar('Metals', 10, 100, data, this);
            this.metalButton.setInteractive();
            this.metalButton.on('pointerdown', () => {
                statText.setText('E-waste oftentimes contains heavy metals, such as lead and mercury. When these metals are put in a landfill, they oftentimes seep into the soil and groundwater, contaminating the environment and leading to health problems for those who live around it. Instead of going to a landfill, these metals can instead be recycled, being put into new electronic devices and preventing them from spreading into the environment.')
            });
        } else if (key === 'plastic') {
            this.plasticButton = createLoadingBar('Plastic', 10, 150, data, this);
            this.plasticButton.setInteractive();
            this.plasticButton.on('pointerdown', () => {
                statText.setText('Many different electronic devices use plastic, especially in their exterior cases. When put into landfills, the plastic falls apart, leaving microplastics in the soil. Most other materials are broken up and decomposed by bacteria, however plastics are an exception. The items themselves can last for hundreds of years, though the microscopic plastic particles still remain. Unfortunately, there is also no known way for many different types of plastics used in electronic devices to be recycled. Thankfully, $lil_guy_name can handle plastic no problem!');
            });
        } else if (key === 'magnets') {
            this.magnetsButton = createLoadingBar('Magnets', 10, 200, data, this);
            this.magnetsButton.setInteractive();
            this.magnetsButton.on('pointerdown', () => {
                statText.setText('The risks of magnets in e-waste is similar to that of metals. However, magnets oftentimes contain specific metals that are considered as both in limited supply and essential to electronics. Like metals, magnets can seep out contaminants into the surrounding soil and groundwater when in a landfill. Recycling magnets makes sure that these rare metals still have some supply, and prevents them from causing harm in a landfill.');
            });
        } else if (key === 'happiness') {
            this.happinessPercent = createLoadingBar('Happiness', 10, 250, data, this);
        }
    }
}
