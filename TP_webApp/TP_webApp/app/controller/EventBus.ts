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

export enum EventType {
    BUTTON = "BUTTON",
    MOUSE_DOWN = "MOUSE_DOWN",
    MOUSE_UP = "MOUSE_UP",
    MOUSE_MOVE = "MOUSE_MOVE",
    SCENE_UPDATE = "SCENE_UPDATE"
}

export class EventBus {

    public constructor(
        private _canvas: HTMLCanvasElement,
        private _callback: (event: Event, eventType: EventType) => void
    ) {
        this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('click', this.handleButtonPressed.bind(this));
    }

    private _sendMouseDown: boolean = true;
    private _sendMouseUp: boolean = true;
    private _sendMouseMovement: boolean = true;
    private _sendButtonPressed: boolean = true;
    private _sendSceneUpdate: boolean = true;

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
            this._callback(event, EventType.MOUSE_MOVE);
        }
    }

    public handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        if (this.sendMouseDown) {
            this._callback(event, EventType.MOUSE_DOWN);
        } 
    }

    
    public handleMouseUp(event: MouseEvent) {
        if (this.sendMouseUp) {
            this._callback(event, EventType.MOUSE_UP);
        }
    }

    public handleButtonPressed(event: MouseEvent) {
        if (this.handleButtonPressed) {
            this._callback(event, EventType.BUTTON);
        }
    }

    public handleSceneUpdate(event: Event) {
        if (this.handleSceneUpdate) {
            this._callback(event, EventType.SCENE_UPDATE);
        }
    }

}