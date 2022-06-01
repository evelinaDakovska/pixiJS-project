import { Application, Loader, Texture, AnimatedSprite, Sprite } from "pixi.js";
import { getSpine } from "./spine-example";
import { getLayersExample } from "./layers-example";
import "./style.css";
import gsap from "gsap";
import { Spine } from "pixi-spine";

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    getLayersExample(app);

    resizeCanvas();

    const birdFromSprite = getBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(gameWidth / 2, 530);

    const spineExample = getSpine();
    spineExample.position.y = 580;

    const button = getButton(spineExample);
    const sorcerer = getSorcerer(button);

    app.stage.addChild(birdFromSprite);
    app.stage.addChild(spineExample);
    app.stage.addChild(sorcerer);
    app.stage.addChild(button);
    app.stage.interactive = true;
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("rabbit", "./assets/simpleSpriteSheet.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        Texture.from("birdUp.png"),
        Texture.from("birdMiddle.png"),
        Texture.from("birdDown.png"),
    ]);

    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
}

function getButton(spineExample: Spine) {
    let isRunning = false;
    const playButton = Texture.from("./assets/spine-assets/playBtn.png");
    const button = Sprite.from(playButton);
    button.width = 100;
    button.height = 150;
    button.position.x = 350;
    button.position.y = 10;
    button.visible = false;
    button.interactive = true;
    button.buttonMode = true;
    button.on("mouseup", () => {
        if (!isRunning) {
            gsap.to(spineExample, { duration: 5, ease: "none", x: 800, repeat: -1 });
            spineExample.state.setAnimation(0, "running", true);
            isRunning = true;
        } else {
            spineExample.state.setEmptyAnimation(0, 0);
            gsap.to(gsap.exportRoot(), { timeScale: 0 });
            isRunning = false;
        }
    });

    return button;
}

function getSorcerer(button: Sprite) {
    const sorcerer = Sprite.from("./assets/spine-assets/sorcerer.png");
    sorcerer.height = 150;
    sorcerer.width = 150;
    sorcerer.position.x = gameWidth / 2.5;
    sorcerer.position.y = gameWidth / 6;
    gsap.from(sorcerer, {
        alpha: 0.0,
        duration: 3,
        onComplete() {
            button.visible = true;
        },
    });
    return sorcerer;
}
