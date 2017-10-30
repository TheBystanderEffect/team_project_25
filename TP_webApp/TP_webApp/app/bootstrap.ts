/*
The entry point of the application
*/
import * as Globals from './globals';
import { Font, FontLoader, Scene } from 'three';
import { initializeScene } from './view/scene-init';
import { toggleNav, makeButton } from './view/side-menu'; 

/*
Load resources
*/

function loadFont(font_url: string): Promise<Font> {

    let font_loader: FontLoader = new FontLoader();

    return new Promise<Font>((resolve, reject) => {
        font_loader.load(font_url, (font: Font): void => {
            resolve(font);
        },
        () => {},
        (error) => {
            reject(error);
        });
    });
}

// load a font and set it upon load
let fontLoad = loadFont(Globals.FONT_URL).then((font: Font) => {
    Globals.setFont(font);
}).catch((error) => {
    console.log(error);
});

function loadDiagramList(): Promise<any[]> {

    return new Promise((resolve, reject) => {
        let req: XMLHttpRequest = new XMLHttpRequest();
        req.open('GET','/api/data/diagram/?select=id');
        req.addEventListener("load", ( ev: Event ) => {
            let arr = JSON.parse(req.responseText);
            resolve(arr);
        });
        req.send();
    });
}

let diagramListLoad = loadDiagramList();

/*
Synchronize completion of loading
*/

Promise.all([
    fontLoad, 
    diagramListLoad
]).then(([
    fontResult,
    diagramList
]) => {
    // Initialize application
    let scene: Scene = initializeScene();
    document.getElementById("openMenu").addEventListener("click", toggleNav);

    // populate diagram list
    diagramList.forEach((item: any) => {
        makeButton(scene, item.id);
    });
});