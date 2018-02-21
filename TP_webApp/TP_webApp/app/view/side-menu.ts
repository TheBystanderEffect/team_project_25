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


export function makeButton(diagramId: number) {
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`Diagram ${diagramId}`);
    btn.appendChild(text);
    document.getElementById("mySidenav").appendChild(btn);
}

export function makeLoadViewpointButton(cameraControls: CameraControls, viewpointId: number): HTMLElement {
    let x: number = cameraControls.yawObject.position.x;
    let y: number = cameraControls.yawObject.position.y;
    let z: number = cameraControls.yawObject.position.z;
    let yaw: number = cameraControls.yawObject.rotation.y;
    let pitch: number = cameraControls.pitchObject.rotation.x;
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`viewpoint ${viewpointId}`);
    btn.appendChild(text);
    //solve how to give yourself the camera controls
    btn.onclick = function(){cameraControls.loadViewpoint(x, y, z, yaw, pitch);};
    document.getElementById("mySidenav").appendChild(btn);
    return btn;
}

export function makeDeleteViewpointButton(loadBtn: HTMLElement, viewpointId: number) {
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`Delete viewpoint ${viewpointId}`);
    btn.appendChild(text);
    btn.onclick = function() {
        document.getElementById("mySidenav").removeChild(loadBtn); //Remove the load button
        document.getElementById("mySidenav").removeChild(btn); //Remove this button};
    };
    document.getElementById("mySidenav").appendChild(btn);
}