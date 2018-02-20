import { GLContext } from "../view/GLContext";
import { Lifeline } from "../model/Lifeline";
import { Raycaster, Vector2, Scene, Camera } from 'three';
import { DiagramView } from "../view/DiagramView";
import { Diagram } from "../model/Diagram";
import { Layer } from "../model/Layer";
import { LayoutControl } from "./LayoutControl";
import { CustomMesh } from "../view/CustomMesh";
import { State } from "./State";
import { Message } from "../model/Message";
import { OccurenceSpecification } from "../model/OccurenceSpecification";
import { RaycastControl } from "./RaycastControl";
import * as Globals from '../globals';

export class EventBus {

    public constructor(
        private _canvas: HTMLCanvasElement,
        private _callback: (event: Event) => void
    ) {
        this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('click', this.handleButtonPressed.bind(this));
    }

    private _sendMouseDown: boolean = true;
    private _sendMouseUp: boolean = true;
    private _sendMouseMovement: boolean = false;
    private _sendButtonPressed: boolean = true;

    public get sendMouseDown() {
        return this._sendMouseDown;
    }

    public get sendMouseUp() {
        return this._sendMouseUp;
    }

    public get sendMouseMovement() {
        return this._sendMouseMovement;
    }

    public get sendButtonPressed() {
        return this._sendButtonPressed;
    }

    public handleMouseMove(event: MouseEvent) {
        if (this.sendMouseMovement) {
            this._callback(event);
        }
    }

    // To do refactor
    private _intersection:Array<CustomMesh> = null;
    private holdMyLifeline: any = null;


    public handleMouseDown(event: MouseEvent) {
        if(event.which==1){
            RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event)
        }
        if (this.sendMouseDown) {
            this._callback(event);
        }
        
        switch (event.which) {
            case 1:
                
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_lifeline" ){
                    this._intersection = RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event);

                    let lifelineNew = new Lifeline('Standard name','',[], (this._intersection[0]).metadata.parent.parent);
                    (this._intersection[0]).metadata.parent.parent.AddLifeline(lifelineNew);
                    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
                    GLContext.instance.stateMachine.currentState = new State("NEUTRAL");
                    
                    
                    
                }
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" ){
                    this._intersection = RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event);
                    for(let element of this._intersection){
                        if(element.metadata.parent.parent instanceof Lifeline){
                            this.holdMyLifeline = element.metadata.parent.parent;
                            break;
                        }
                    }
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

    
    public handleMouseUp(event: MouseEvent) {
        if (this.sendMouseUp) {
            this._callback(event);
        }
        if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" && this.holdMyLifeline !== null){
            this._intersection = RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event);
            for(let element of this._intersection){
                if(element.metadata.parent.parent instanceof Lifeline){
                    let newMessage = new Message("general Message",null,null,new OccurenceSpecification(this.holdMyLifeline,null),new OccurenceSpecification(element.metadata.parent.parent,null));
                    this.holdMyLifeline.layer.AddMessage(newMessage);
                    newMessage.start.message = newMessage;
                    newMessage.end.message = newMessage;

                    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
                    GLContext.instance.stateMachine.currentState = new State("NEUTRAL");
                    
                    break;
                }
            }
            this.holdMyLifeline = null;
        }

    }

    public handleButtonPressed(event: MouseEvent) {
        if (this.handleButtonPressed) {
            this._callback(event);
        }
    }

}