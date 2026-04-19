import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Main } from './scenes/Main';
import { Stats } from './scenes/Stats';
import { Play } from './scenes/Play';
import { Feed } from './scenes/Feed';
import { Gather } from './scenes/Gather';
import { Clean } from './scenes/Clean';
import { Sleep } from './scenes/Sleep';
import { AUTO, Game, Scale } from 'phaser';

const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.FIT,  // Changed from EXPAND to FIT
        autoCenter: Scale.CENTER_BOTH,
        width: 1024,      // Fixed width
        height: 768       // Fixed height
    },
    audio: {
        disableWebAudio: false
    },
    physics: {
        default: 'arcade'
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Main,
        Stats,
        Play,
        Feed,
        Gather,
        Clean,
        Sleep
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
