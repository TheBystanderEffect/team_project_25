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

export class CommunicationController {

    private static _instance: CommunicationController;
    private serialized: string;
    private constructor() {}

    private _sendMouseDown: boolean = true;
    private _sendMouseUp: boolean = true;
    private _sendMouseMovement: boolean = false;
    private _sendButtonPressed: boolean = true;

    public static get instance():CommunicationController{
        if (this._instance == undefined){
            this._instance = new CommunicationController();
        }
        return this._instance;
    }

    public getNewDiagramId():number{

        //TODO get url from config
        let url = "/api/data/nextId";
        let xhr = new XMLHttpRequest();

        xhr.onerror = function () {
            alert("Error while calling Web API");
        }

        xhr.open("GET", url, false);
        xhr.send();

        if (xhr.status === 200) {
            let newId = xhr.response;
            return newId;
        } else {
            throw new Error("Couldn't get new GraphId");
        }
    }

    public saveDiagram(serializedDiagram: string, callback: Function):void{
        let url = "/api/data/diagram";
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
            callback();
        }

        xhr.onerror = function () {
            alert("Error while calling Web API");
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('Content-type','application/json')
    
        xhr.send(serializedDiagram);
    }

    public getDiagram(diagramId: number, callback: Function):void{

        //TODO get url from config
        let url = "/api/data/diagram/" + diagramId;
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
            let data = xhr.responseText;
            callback(data);
        }

        xhr.onerror = function () {
            alert("Error while calling Web API");
        }

        xhr.open("GET", url);
        xhr.send()
    }
}