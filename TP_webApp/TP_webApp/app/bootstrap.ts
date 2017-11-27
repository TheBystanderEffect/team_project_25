/*
The entry point of the application
*/
import * as Globals from './globals';
import { Font, FontLoader } from 'three';
import { GLContext } from './view/GLContext';
import { toggleNav, makeButton, addLifeline, addLayer, addMessage} from './view/side-menu'; 

import { LayoutControl } from "./controller/LayoutControl" //testing layout
import { Diagram } from "./model/Diagram" //testing layout
import { Layer } from "./model/Layer" //testing layout
import { Lifeline } from "./model/Lifeline" //testing layout
import { Message } from "./model/Message" //testing layout
import { OccurenceSpecification } from "./model/OccurenceSpecification" //testing layout

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
    GLContext.instance.initializeScene();
    document.getElementById("openMenu").addEventListener("click", toggleNav);
    document.getElementById("sideLife").addEventListener("click", addLifeline);
    document.getElementById("sideMessage").addEventListener("click", addMessage);
    document.getElementById("sideLayer").addEventListener("click", addLayer);

    // populate diagram list
    diagramList.forEach((item: any) => {
        makeButton(item.id);
    });

    //testing of layout
    console.log("testing layout");
    var diag = new Diagram();
    (window as any).diag = diag;
    var ll1 = new Lifeline("ll1"," ",[],l1);
    var ll2 = new Lifeline("ll2"," ",[],l1);
    var ll3 = new Lifeline("ll3"," ",[],l1);
    var l1: Layer = new Layer([ll1,ll2,ll3],[],[]);
    ll1.layer=l1;
    ll2.layer=l1;
    ll3.layer=l1;
    //var l2 = new Layer([ll3],[],[]);
    var m1 = new Message("test",1,1,new OccurenceSpecification(ll1, null), new OccurenceSpecification(ll2, null));
    l1.AddMessage(m1);
    m1.start.message = m1;
    m1.end.message = m1;
    var m2 = new Message("test2",1,1,new OccurenceSpecification(ll2, null), new OccurenceSpecification(ll3, null));
    l1.AddMessage(m2);
    m2.start.message = m1;
    m2.end.message = m1;
    var m3 = new Message("test3",1,1,new OccurenceSpecification(ll3, null), new OccurenceSpecification(ll2, null));
    l1.AddMessage(m3);
    m3.start.message = m1;
    m3.end.message = m1;
    var m4 = new Message("test4",1,1,new OccurenceSpecification(ll2, null), new OccurenceSpecification(ll1, null));
    l1.AddMessage(m4);
    m4.start.message = m1;
    m4.end.message = m1;
    diag.addLayer(l1);
    //diag.addLayer(l2);
    LayoutControl.magic(diag);
    GLContext.instance.scene.add(diag.diagramView);
    console.log(diag.diagramView);
    console.log("did it work?")

});