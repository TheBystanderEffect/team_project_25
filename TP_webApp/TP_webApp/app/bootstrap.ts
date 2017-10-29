/*
The entry point of the application
*/
import * as Globals from './globals';
import { Font, FontLoader } from 'three';
import { initializeScene } from './view/scene-init';

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

function loadDiagramList(): Promise<undefined> {

    return new Promise((resolve, reject) => {
        let req: XMLHttpRequest = new XMLHttpRequest();
        req.open('GET','/api/data/diagram/');
        req.addEventListener("load", ( ev: Event ) => {
            console.log(JSON.parse(req.responseText));
            resolve();
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
    undefined
]) => {
    /*
    Initialize application
    */
    initializeScene();
});