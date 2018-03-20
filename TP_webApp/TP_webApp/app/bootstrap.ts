/*
The entry point of the application
*/
import * as Globals from './globals';
import { Font, FontLoader } from 'three';
import { GLContext } from './view/GLContext';
import { toggleNav, makeButton, addViewpoint} from './view/side-menu';

import { LayoutControl } from "./controller/LayoutControl" //testing layout
import { Diagram } from "./model/Diagram" //testing layout
import { Layer } from "./model/Layer" //testing layout
import { Lifeline } from "./model/Lifeline" //testing layout
import { Message } from "./model/Message" //testing layout
import { OccurenceSpecification } from "./model/OccurenceSpecification" //testing layout
import { Serializer } from './controller/Serializer';
import { Assets } from './view/Assets';

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
        req.open('GET','/api/data/diagram/?select=_id');
        req.addEventListener("load", ( ev: Event ) => {
            let arr = JSON.parse(req.responseText);
            resolve(arr);
        });
        req.send();
    });
}

let diagramListLoad = loadDiagramList();

//preload geom and texture assets
function LoadAssets(): Promise<Assets> {

        return new Promise((resolve, reject) => {
            let assets: Assets = new Assets();
            resolve(assets);
        });
    }  
//set them upon load
let assetsLoad = LoadAssets().then((assets: Assets) => {
    Globals.setAssets(assets);
}).catch((error) => {
    console.log(error);
});

/*
Synchronize completion of loading
*/

Promise.all([
    fontLoad, 
    diagramListLoad,
    assetsLoad
]).then(([
    fontResult,
    diagramList,
    assetsLoad
]) => {
    // Initialize application
    GLContext.instance.initializeScene();
    document.getElementById("openMenu").addEventListener("click", toggleNav);
    document.getElementById("resetViewpoint").addEventListener("click", function() {GLContext.instance.cameraControls.loadViewpoint(0, 0, 0, 0, 0); });
    document.getElementById("saveViewpoint").addEventListener("click", function() {addViewpoint(GLContext.instance.cameraControls)});

    // populate diagram list
    diagramList.forEach((item: any) => {
        makeButton(item._id);
    });

    Globals.setOpenDiagram(Serializer.instance.createTestDiagram());
    Globals.setDiagramSaved(false);

    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement);

});