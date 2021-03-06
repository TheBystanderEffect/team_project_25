import { Scene } from 'three';
import { GraphicElement } from './GraphicElement';
import { LayerView } from './LayerView';
import { LifelineView } from './LifelineView';
import { MessageView } from './MessageView';
import { setOpenDiagram } from '../globals';
import { GLContext } from './GLContext';
import { State } from "../controller/State";
import { Diagram } from '../model/Diagram';
import { Layer } from '../model/Layer';
import { LayoutControl } from '../controller/LayoutControl';
import { CameraControls } from './CameraControls';
import * as Globals from '../globals';
import { Serializer } from '../controller/Serializer';


export function toggleNav() {
    let side = document.getElementById("mySidenav");
    if (side.style.width === "0px") {
        side.style.width = "250px";
        document.getElementById("main").style.width = "250px";
        document.getElementById("openMenu").style.marginLeft = "250px";
        document.getElementById("openMenu").innerHTML = "Close";
    }
    else {
        side.style.width = "0px";
        document.getElementById("main").style.width = "0px";
        document.getElementById("openMenu").style.marginLeft = "0px";
        document.getElementById("openMenu").innerHTML = "Open";
    }
}

export function addViewpoint(cameraControls: CameraControls) {
    let btn = makeLoadViewpointButton(cameraControls, addViewpoint.counter);
    makeDeleteViewpointButton(btn, addViewpoint.counter++);
}

//Current placeholder for static function variable before better implementation arises
export namespace addViewpoint {
    export let counter = 1;
}

function loadDiagram(id: number) {
    // while(GLContext.instance.scene.children.length > 0){
    //     GLContext.instance.scene.remove(GLContext.instance.scene.children[0]);
    // }

     let req: XMLHttpRequest = new XMLHttpRequest();
     req.open('GET',`/api/data/diagram/${id}`);
     req.addEventListener("load", (ev: Event) => {
         Globals.setOpenDiagram(Serializer.instance.deserialize(req.responseText
         ));
         Globals.setDiagramSaved(true);
         for (let child of GLContext.instance.scene.children) {
             GLContext.instance.scene.remove(child);
         }
         LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
         GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement);
     });
     req.send();
}

// export function turnLayerViewOnOFF(cameraControls: CameraControls, viewpointId: number): HTMLElement {
    
//     let yaw: number = cameraControls.yawObject.rotation.y;
//     let pitch: number = cameraControls.pitchObject.rotation.x;
//     let btn = document.createElement("a");
//     let text = document.createTextNode(`viewpoint ${viewpointId}`);
//     btn.appendChild(text);
//     //solve how to give yourself the camera controls
//     btn.onclick = function(){cameraControls.loadViewpoint(x, y, z, yaw, pitch);};
//     document.getElementById("diagramOptions").appendChild(btn);
//     return btn;
// }

export function makeButton(diagramId: number) {
    let btn = document.createElement("a");
    let text = document.createTextNode(`Diagram ${diagramId}`);
    btn.appendChild(text);
    btn.className +=" sidenavButtom blue big";
    btn.id = `LOAD-DIAG-${diagramId}`;
    btn.onclick = loadDiagram.bind(null, diagramId);
    document.getElementById("diagramOptions").appendChild(btn);
}

export function makeLoadViewpointButton(cameraControls: CameraControls, viewpointId: number): HTMLElement {
    let x: number = cameraControls.yawObject.position.x;
    let y: number = cameraControls.yawObject.position.y;
    let z: number = cameraControls.yawObject.position.z;
    let yaw: number = cameraControls.yawObject.rotation.y;
    let pitch: number = cameraControls.pitchObject.rotation.x;
    let btn = document.createElement("a");
    let text = document.createTextNode(`viewpoint ${viewpointId}`);
    btn.appendChild(text);
    btn.className +=" sidenavButtom blue big";
    //solve how to give yourself the camera controls
    btn.onclick = function(){cameraControls.loadViewpoint(x, y, z, yaw, pitch);};
    document.getElementById("diagramOptions").appendChild(btn);
    return btn;
}

export function makeDeleteViewpointButton(loadBtn: HTMLElement, viewpointId: number) {
    let btn = document.createElement("a");
    let text = document.createTextNode(`Delete viewpoint ${viewpointId}`);
    btn.appendChild(text);
    btn.className +=" sidenavButtom blue big";
    btn.onclick = function() {
        document.getElementById("diagramOptions").removeChild(loadBtn); //Remove the load button
        document.getElementById("diagramOptions").removeChild(btn); //Remove this button};
    };
    document.getElementById("diagramOptions").appendChild(btn);
}