import { GLContext } from "../view/GLContext";
import { Lifeline } from "../model/Lifeline";
import { LayoutControl } from "./LayoutControl";
import { State } from "./State";
import { Message } from "../model/Message";
import { OccurenceSpecification } from "../model/OccurenceSpecification";
import { RaycastControl } from "./RaycastControl";
import * as Globals from '../globals';
export class EventBus {
    constructor(_canvas, _callback) {
        this._canvas = _canvas;
        this._callback = _callback;
        this._sendMouseDown = true;
        this._sendMouseUp = true;
        this._sendMouseMovement = false;
        this._sendButtonPressed = true;
        // To do refactor
        this._intersection = null;
        this.holdMyLifeline = null;
        this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('click', this.handleButtonPressed.bind(this));
    }
    get sendMouseDown() {
        return this._sendMouseDown;
    }
    get sendMouseUp() {
        return this._sendMouseUp;
    }
    get sendMouseMovement() {
        return this._sendMouseMovement;
    }
    get sendButtonPressed() {
        return this._sendButtonPressed;
    }
    handleMouseMove(event) {
        if (this.sendMouseMovement) {
            this._callback(event);
        }
    }
    handleMouseDown(event) {
        if (event.which == 1) {
            console.log('raycast debug');
            RaycastControl.instance.cast(GLContext.instance.camera, GLContext.instance.scene, event);
            console.log('end raycast debug');
        }
        if (this.sendMouseDown) {
            this._callback(event);
        }
        switch (event.which) {
            case 1:
                if (GLContext.instance.stateMachine.currentState.code == "MODIFYING_lifeline") {
                    console.log("fuck");
                    this._intersection = RaycastControl.instance.cast(GLContext.instance.camera, GLContext.instance.scene, event);
                    // let raycaster = new Raycaster();
                    // let vector2 = new Vector2(0,0)
                    // vector2.x =   ( event.offsetX / window.innerWidth ) * 2 - 1;
                    // vector2.y = - ( event.offsetY / window.innerHeight ) * 2 + 1;
                    // raycaster.setFromCamera(vector2,GLContext.instance.camera);
                    // let layersinDiagram = GLContext.instance.scene.children[0].children;
                    // this._intersection = raycaster.intersectObjects(layersinDiagram);
                    let lifelineNew = new Lifeline('Standard name', '', [], (this._intersection[0]).metadata.parent.parent);
                    (this._intersection[0]).metadata.parent.parent.AddLifeline(lifelineNew);
                    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
                    GLContext.instance.stateMachine.currentState = new State("NEUTRAL");
                }
                if (GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message") {
                    this._intersection = RaycastControl.instance.cast(GLContext.instance.camera, GLContext.instance.scene, event);
                    for (let element of this._intersection) {
                        if (element.metadata.parent.parent instanceof Lifeline) {
                            this.holdMyLifeline = element.metadata.parent.parent;
                            break;
                        }
                    }
                    // let raycaster = new Raycaster();
                    // let vector2 = new Vector2(0,0)
                    // vector2.x =   ( event.offsetX / window.innerWidth ) * 2 - 1;
                    // vector2.y = - ( event.offsetY / window.innerHeight ) * 2 + 1;
                    // raycaster.setFromCamera(vector2,GLContext.instance.camera);
                    // let lifelinesinDiagram :any[]= [];
                    // GLContext.instance.scene.children[0].children.forEach(element => {
                    //     element.children.forEach(element2 => {
                    //         lifelinesinDiagram.push(element2);
                    //     });
                    // });
                    // this._intersection = raycaster.intersectObjects(lifelinesinDiagram);
                    // console.log((this._intersection[0].object as CustomMesh).metadata.parent.parent);
                }
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
    }
    handleMouseUp(event) {
        if (this.sendMouseUp) {
            this._callback(event);
        }
        console.log("begin");
        if (GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" && this.holdMyLifeline !== null) {
            this._intersection = RaycastControl.instance.cast(GLContext.instance.camera, GLContext.instance.scene, event);
            for (let element of this._intersection) {
                if (element.metadata.parent.parent instanceof Lifeline) {
                    let newMessage = new Message("general Message", null, null, new OccurenceSpecification(this.holdMyLifeline, null), new OccurenceSpecification(element.metadata.parent.parent, null));
                    this.holdMyLifeline.layer.AddMessage(newMessage);
                    newMessage.start.message = newMessage;
                    newMessage.end.message = newMessage;
                    console.log("Message created");
                    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                    console.log("after magic");
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
                    console.log("finish");
                    GLContext.instance.stateMachine.currentState = new State("NEUTRAL");
                    break;
                }
            }
            this.holdMyLifeline = null;
            // let raycaster = new Raycaster();
            // let vector2 = new Vector2(0,0)
            // vector2.x =   ( event.offsetX / window.innerWidth ) * 2 - 1;
            // vector2.y = - ( event.offsetY / window.innerWidth ) * 2 + 1;
            // raycaster.setFromCamera(vector2,GLContext.instance.camera);
            // let lifelinesinDiagram :any[]= [];
            // GLContext.instance.scene.children[0].children.forEach(element => {
            //     element.children.forEach(element2 => {
            //         lifelinesinDiagram.push(element2);
            //     });
            // });
            // console.log("before raycast");
            // let endIntersection = raycaster.intersectObjects(lifelinesinDiagram);
            // console.log("after raycast");
            // console.log("begin Message creation");
            //let newMessage = new Message("general Message",null,null,new OccurenceSpecification((this._intersection[0].object as CustomMesh).metadata.parent.parent,null),new OccurenceSpecification((endIntersection[0].object as CustomMesh).metadata.parent.parent,null));
            // console.log('start intersection');
            // console.log(this._intersection);
            // console.log('end intersection');
            // console.log(endIntersection);
            // (this._intersection[0].object as CustomMesh).metadata.parent.parent.layer.AddMessage(newMessage);
            // newMessage.start.message = newMessage;
            // newMessage.end.message = newMessage;
            // console.log("end of Message creation");
            // LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
            // console.log("after magic");
            // GLContext.instance.scene.children = [];
            // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            // console.log("finish");
            // GLContext.instance.stateMachine.currentState = new State("NEUTRAL");
        }
    }
    handleButtonPressed(event) {
        if (this.handleButtonPressed) {
            this._callback(event);
        }
    }
}
//# sourceMappingURL=EventBus.js.map