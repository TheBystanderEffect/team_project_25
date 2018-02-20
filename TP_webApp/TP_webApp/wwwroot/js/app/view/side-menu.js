import * as Globals from '../globals';
import { Serializer } from '../controller/Serializer';
export function addLifeline() {
    // if ( GLContext.instance.stateMachine.currentState.code == "NEUTRAL" ){
    //     GLContext.instance.stateMachine.currentState = new State("MODIFYING").specialize('lifeline');
    // }
}
export function addMessage() {
    // if ( GLContext.instance.stateMachine.currentState.code == "NEUTRAL" ){
    //     GLContext.instance.stateMachine.currentState = new State("MODIFYING").specialize('Message');;
    //  }
}
export function addLayer() {
    // if ( GLContext.instance.stateMachine.currentState.code == "NEUTRAL" ){
    //     let diag: Diagram = Globals.CURRENTLY_OPENED_DIAGRAM;
    //     diag.addLayer(new Layer([],[],[]));
    //     LayoutControl.magic(diag);
    //     GLContext.instance.scene.children = [];
    //     GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
    //  }
}
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
export function addViewpoint(cameraControls) {
    let btn = makeLoadViewpointButton(cameraControls, addViewpoint.counter);
    makeDeleteViewpointButton(btn, addViewpoint.counter++);
}
//Current placeholder for static function variable before better implementation arises
(function (addViewpoint) {
    addViewpoint.counter = 1;
})(addViewpoint || (addViewpoint = {}));
function loadDiagram(id) {
    // while(GLContext.instance.scene.children.length > 0){
    //     GLContext.instance.scene.remove(GLContext.instance.scene.children[0]);
    // }
    let req = new XMLHttpRequest();
    req.open('GET', `/api/data/diagram/${id}`);
    req.addEventListener("load", (ev) => {
        Globals.setOpenDiagram(Serializer.instance.deserialize(req.responseText, "Diagram"));
    });
    req.send();
}
export function makeButton(diagramId) {
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`Diagram ${diagramId}`);
    btn.appendChild(text);
    btn.id = `LOAD-DIAG-${diagramId}`;
    btn.onclick = loadDiagram.bind(null, diagramId);
    document.getElementById("mySidenav").appendChild(btn);
}
export function makeLoadViewpointButton(cameraControls, viewpointId) {
    let x = cameraControls.yawObject.position.x;
    let y = cameraControls.yawObject.position.y;
    let z = cameraControls.yawObject.position.z;
    let yaw = cameraControls.yawObject.rotation.y;
    let pitch = cameraControls.pitchObject.rotation.x;
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`viewpoint ${viewpointId}`);
    btn.appendChild(text);
    //solve how to give yourself the camera controls
    btn.onclick = function () { cameraControls.loadViewpoint(x, y, z, yaw, pitch); };
    document.getElementById("mySidenav").appendChild(btn);
    return btn;
}
export function makeDeleteViewpointButton(loadBtn, viewpointId) {
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`Delete viewpoint ${viewpointId}`);
    btn.appendChild(text);
    btn.onclick = function () {
        document.getElementById("mySidenav").removeChild(loadBtn); //Remove the load button
        document.getElementById("mySidenav").removeChild(btn); //Remove this button};
    };
    document.getElementById("mySidenav").appendChild(btn);
}
//# sourceMappingURL=side-menu.js.map