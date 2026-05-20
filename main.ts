namespace ScreenUtil {
    export const ScreenEl = SpriteKind.create();
    export const ImageScreenEl = SpriteKind.create();
}

const Exhibit = new Game(
    "Exhibit",
    {
        author: "Chemthunder",
        version: 1.0,
        license: "ARR",
        desc: "Adds some more easily usable utilities for creating screens!"
    }
)

const ExEntries = new Quilt();

class ScreenButton {
    private name: string;
    private color: number;
    private script: Function;

    public constructor(name: string, color: number, script: Function) {
        this.name = name;
        this.color = color;
        this.script = script;
    }

    public getName(): string {
        return this.name;
    }

    public getColor(): number {
        return this.color;
    }

    public getFunction(): Function {
        return this.script;
    }

    public run() {
        this.script();
    }
}

class ButtonScreen {
    private name: string;
    private entries: ScreenButton[];
    private state: boolean;

    public constructor(name: string) {
        this.name = name;
        this.entries = [];
        this.state = false;
    }

    public importEntries(entryList: ScreenButton[]) {
        this.entries = entryList;
    }

    public getName(): string {
        return this.name;
    }

    public getEntries(): ScreenButton[] {
        return this.entries;
    }

    public open() {
        if (this.entries.length > 0) {
            this.state = true;
            let list = this.entries;

            if (list.length < 5) {
                let borderThickness = 2;
                let yMult = 3;
                let widthMult = 8;
                let spacingWidthMult = 25;
                let yPosOff = 50;

                let titleImage = image.create(this.name.length * 15, 30);
                let titleSprite = ExEntries.sprite(
                    "gui#title",
                    titleImage,
                    ScreenUtil.ScreenEl
                );

                titleSprite.z = 10;
                titleSprite.setPosition(screen.width / 2, screen.height / 2 - (yPosOff + 5));
                titleImage.printCenter(this.name, titleImage.height / 2, 1);

                animation.runMovementAnimation(titleSprite,
                    animation.animationPresets(
                        animation.bobbing
                    ),
                    2000,
                    true
                );

                let spriteList: Sprite[] = [];

                for (let entry of list) {
                    let index = list.indexOf(entry);

                    let d = image.create(entry.getName().length * widthMult, 20);
                    d.fill(entry.getColor());
                    let s = image.create(d.width - borderThickness, d.height - borderThickness);
                    s.fill(game.Color.Black);

                    let dS = ExEntries.sprite(
                        "gui#" + entry.getName().toLowerCase() + "#displayEntry",
                        d,
                        ScreenUtil.ScreenEl
                    );

                    let sS = ExEntries.sprite(
                        "gui#" + entry.getName().toLowerCase() + "#displayShadow",
                        s,
                        ScreenUtil.ScreenEl
                    );

                    s.printCenter(
                        entry.getName(),
                        (d.height / 2 - d.height / yMult),
                        entry.getColor()
                    );

                    dS.z = 2;
                    sS.z = dS.z + 1;

                    dS.setPosition(
                        screen.width / 2,
                        (screen.height / 2 - (yPosOff - 20)) + (index * spacingWidthMult)
                    );

                    sS.setPosition(
                        dS.x,
                        dS.y
                    );

                    spriteList.push(sS);
                }

                let cursorPos = 0;
                let ci = image.create(5, 5);
                ci.fill(game.Color.Yellow);

                let cursor = ExEntries.sprite(
                    "gui#cursor",
                    ci,
                    ScreenUtil.ScreenEl
                );

                cursor.setPosition(screen.width / 2, 90);
                cursor.z = 9;

                controller.down.onEvent(ControllerButtonEvent.Pressed, function cycleDown() {
                    if (this.state) {
                        if (cursorPos == list.length - 1) {
                            cursorPos = 0;
                        } else {
                            cursorPos++;
                        }
                    }
                });

                controller.up.onEvent(ControllerButtonEvent.Pressed, function cycleUp() {
                    if (this.state) {
                        if (cursorPos == 0) {
                            cursorPos = list.length - 1;
                        } else {
                            cursorPos--;
                        }
                    }
                });

                controller.A.onEvent(ControllerButtonEvent.Pressed, function select() {
                    if (this.state) {
                        list.get(cursorPos).run();
                    }
                });

                forever(function cursorPositioner() {
                    if (this.state) {
                        cursor.setPosition(
                            spriteList[cursorPos].x - 50,
                            spriteList[cursorPos].y
                        );
                    }
                });
            } else {

                let spriteList: Sprite[] = [];

                for (let e of list) {
                    let ei = image.create(900, 16);
                    let es = ExEntries.sprite("gui#" + e.getName() + "#displayEntry", ei, ScreenUtil.ScreenEl);
                    
                    ei.print(
                        e.getName(),
                        ei.width / 2,
                        ei.height / 2,
                        e.getColor()
                    );

                    es.setPosition(
                        1,
                        1 + (list.indexOf(e) * 10)
                    );

                    spriteList.push(es);
                }

                let cursorPos = 0;
                let ci = image.create(4, 4);
                ci.fill(game.Color.Yellow);
                let cursor = ExEntries.sprite(
                    "gui#cursor",
                    ci,
                    ScreenUtil.ScreenEl
                );

                controller.down.onEvent(ControllerButtonEvent.Pressed, function cycleDown() {
                    if (this.state) {
                        if (cursorPos == list.length - 1) {
                            cursorPos = 0;
                        } else {
                            cursorPos++;
                        }
                    }
                });

                controller.up.onEvent(ControllerButtonEvent.Pressed, function cycleUp() {
                    if (this.state) {
                        if (cursorPos == 0) {
                            cursorPos = list.length - 1;
                        } else {
                            cursorPos--;
                        }
                    }
                });

                controller.A.onEvent(ControllerButtonEvent.Pressed, function select() {
                    if (this.state) {
                        list.get(cursorPos).run();
                    }
                });

                forever(function () {
                    if (this.state) {
                        cursor.setPosition(
                            150,
                            spriteList[cursorPos].y + 5
                        );
                    }
                });
            }
        } else {
            throw "Cannot open ButtonScreen while empty! " + this.name;
        }
    }

    public close() {
        this.state = false;
        sprites.destroyAllSpritesOfKind(ScreenUtil.ScreenEl);
    }
}

class ScreenImageLayer {
    private extract: Image;
    private holder: Sprite;

    public constructor(extract: Image, holder: Sprite) {
        this.extract = extract;
        this.holder = holder;
    }

    public getExtract(): Image {
        return this.extract;
    }

    public getHolder(): Sprite {
        return this.holder;
    }
}

class ImageScreen {
    private layers: ScreenImageLayer[];

    public constructor(name: string, maxLayers: number) {
        this.layers = [];

        for (let i = 0; i < maxLayers; i++) {
            const li = image.create(screen.width, screen.height);
            const ls = ExEntries.sprite("imageScreen#" + name.toLowerCase(), li, ScreenUtil.ImageScreenEl);

            ls.setPosition(
                screen.width / 2,
                screen.height / 2
            );

            ls.z = i;

            const createdLayer = new ScreenImageLayer(li, ls);
            this.layers.push(createdLayer);
        }
    }

    public accessLayer(layer: number): Image {
        return this.layers.get(layer).getExtract();
    }

    public accessLayerDirect(layer: number): ScreenImageLayer {
        return this.layers.get(layer);
    }
}

game.consoleOverlay.setVisible(true, 1);
const FirstEntry = new ScreenButton("First", 4, function () {
    
});

const SecondEntry = new ScreenButton("Second", 5, function () {

});

const ThirdEntry = new ScreenButton("Third", 5, function () {

});

const FourthEntry = new ScreenButton("Fourth", 5, function () {

});

const FifthEntry = new ScreenButton("Fifth", 5, function () {

});

const exTest = new ButtonScreen("exTest");

exTest.importEntries([
    FirstEntry,
    SecondEntry,
    ThirdEntry,
    FourthEntry,
    FifthEntry
]);

exTest.open();