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
import { Serializer } from "./Serializer";

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
            let newId = parseInt(xhr.response);
            return newId;
        } else {
            throw new Error("Couldn't get new GraphId");
        }
    }

    public saveDiagram(diagram: Diagram): void {
        let serializedDiagram = Serializer.instance.serialize(diagram);
        let url = "/api/data/diagram";
        if (Globals.IS_DIAGRAM_SAVED) {
<<<<<<< HEAD
            url += `/${Globals.CURRENTLY_OPENED_DIAGRAM.id}`;
=======
            url += `/${diagram.id}`;
>>>>>>> dev
        }
        let xhr = new XMLHttpRequest();

        xhr.onerror = function () {
            alert("Error while calling Web API");
        }
        xhr.open(Globals.IS_DIAGRAM_SAVED ? "PUT" : "POST", url);
        xhr.setRequestHeader('Content-type','application/json')
    
        xhr.send(serializedDiagram);
    }

    public getDiagram(diagramId: number):void{

        //TODO get url from config
        let url = "/api/data/diagram/" + diagramId;
        let xhr = new XMLHttpRequest();

        xhr.onerror = function () {
            alert("Error while calling Web API");
        }

        xhr.open("GET", url);
        xhr.send()
    }
}