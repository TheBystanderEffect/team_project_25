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
            console.log(xhr.responseText);
            let newId = xhr.response;
            return newId;
        } else {
            throw new Error("Couldn't get new GraphId");
        }
    }

    //proste zavolam    /savediagram/{IDdiagram}
    public saveDiagram(serializedDiagram: string):void{
        debugger;
        //TODO get url from config
        let url = "/api/data/diagram";
        let xhr = new XMLHttpRequest();


        xhr.onerror = function () {
            alert("Error while calling Web API");
        }
        console.log("Opening channel to send diagram...")
        xhr.open("POST", url);
        xhr.setRequestHeader('Content-type','application/json')
    
        console.log("Sending diagram: " + serializedDiagram)
        xhr.send(serializedDiagram);
    }


//     <script>
//     $(function () {

//         var json = { "layers": [{ "lifelines": [{ "name": "ll1", "type": " ", "occurenceSpecifications": [{ "_message": { "layerIndex": 0, "messageIndex": 0 } }, { "_message": { "layerIndex": 0, "messageIndex": 3 } }] }, { "name": "ll2", "type": " ", "occurenceSpecifications": [{ "_message": { "layerIndex": 0, "messageIndex": 0 } }, { "_message": { "layerIndex": 0, "messageIndex": 1 } }, { "_message": { "layerIndex": 0, "messageIndex": 2 } }, { "_message": { "layerIndex": 0, "messageIndex": 3 } }] }, { "name": "ll3", "type": " ", "occurenceSpecifications": [{ "_message": { "layerIndex": 0, "messageIndex": 1 } }, { "_message": { "layerIndex": 0, "messageIndex": 2 } }] }], "combinedFragments": [], "messages": [{ "name": "test", "kind": 1, "sort": 1, "start": { "layerIndex": 0, "lifelineIndex": 0, "occurenceIndex": 0 }, "end": { "layerIndex": 0, "lifelineIndex": 1, "occurenceIndex": 0 } }, { "name": "test2", "kind": 1, "sort": 1, "start": { "layerIndex": 0, "lifelineIndex": 1, "occurenceIndex": 1 }, "end": { "layerIndex": 0, "lifelineIndex": 2, "occurenceIndex": 0 } }, { "name": "test3", "kind": 1, "sort": 1, "start": { "layerIndex": 0, "lifelineIndex": 2, "occurenceIndex": 1 }, "end": { "layerIndex": 0, "lifelineIndex": 1, "occurenceIndex": 2 } }, { "name": "test4", "kind": 1, "sort": 1, "start": { "layerIndex": 0, "lifelineIndex": 1, "occurenceIndex": 3 }, "end": { "layerIndex": 0, "lifelineIndex": 0, "occurenceIndex": 1 } }] }] };

//         $.ajax({
//             url: "/api/data/diagram",
//             type: "POST",
//             contentType: "application/json",
//             dataType: "json",
//             data: JSON.stringify(json),

//             success: function (result) {
//                 console.log(result);
//             },

//             error: function (xhr, resp, text) {
//                 console.log(xhr, resp, text);
//             }
//         });
//     });

// </script>

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