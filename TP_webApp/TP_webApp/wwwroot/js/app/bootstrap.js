/*
The entry point of the application
*/
import * as Globals from './globals';
import { FontLoader } from 'three';
import { GLContext } from './view/GLContext';
import { toggleNav, makeButton, addViewpoint } from './view/side-menu';
import { LayoutControl } from "./controller/LayoutControl"; //testing layout
import { Serializer } from './controller/Serializer';
import { Assets } from './view/Assets';
/*
Load resources
*/
function loadFont(font_url) {
    let font_loader = new FontLoader();
    return new Promise((resolve, reject) => {
        font_loader.load(font_url, (font) => {
            resolve(font);
        }, () => { }, (error) => {
            reject(error);
        });
    });
}
// load a font and set it upon load
let fontLoad = loadFont(Globals.FONT_URL).then((font) => {
    Globals.setFont(font);
}).catch((error) => {
    console.log(error);
});
function loadDiagramList() {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', '/api/data/diagram/?select=_id');
        req.addEventListener("load", (ev) => {
            let arr = JSON.parse(req.responseText);
            resolve(arr);
        });
        req.send();
    });
}
let diagramListLoad = loadDiagramList();
//preload geom and texture assets
function LoadAssets() {
    return new Promise((resolve, reject) => {
        let assets = new Assets();
        resolve(assets);
    });
}
//set them upon load
let assetsLoad = LoadAssets().then((assets) => {
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
]).then(([fontResult, diagramList, assetsLoad]) => {
    // Initialize application
    GLContext.instance.initializeScene();
    document.getElementById("openMenu").addEventListener("click", toggleNav);
    document.getElementById("resetViewpoint").addEventListener("click", function () { GLContext.instance.cameraControls.loadViewpoint(0, 0, 0, 0, 0); });
    document.getElementById("saveViewpoint").addEventListener("click", function () { addViewpoint(GLContext.instance.cameraControls); });
    // populate diagram list
    diagramList.forEach((item) => {
        makeButton(item._id);
    });
    Globals.setOpenDiagram(Serializer.instance.createTestDiagram());
    Globals.setDiagramSaved(false);
    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement);
});
//# sourceMappingURL=bootstrap.js.map