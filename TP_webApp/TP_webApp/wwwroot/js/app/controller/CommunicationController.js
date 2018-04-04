import * as Globals from '../globals';
export class CommunicationController {
    constructor() {
        this._sendMouseDown = true;
        this._sendMouseUp = true;
        this._sendMouseMovement = false;
        this._sendButtonPressed = true;
    }
    static get instance() {
        if (this._instance == undefined) {
            this._instance = new CommunicationController();
        }
        return this._instance;
    }
    getNewDiagramId() {
        //TODO get url from config
        let url = "/api/data/nextId";
        let xhr = new XMLHttpRequest();
        xhr.onerror = function () {
            alert("Error while calling Web API");
        };
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status === 200) {
            let newId = parseInt(xhr.response);
            return newId;
        }
        else {
            throw new Error("Couldn't get new GraphId");
        }
    }
    saveDiagram(serializedDiagram, callback) {
        let url = "/api/data/diagram";
        if (Globals.IS_DIAGRAM_SAVED) {
            url += `/${Globals.CURRENTLY_OPENED_DIAGRAM.id}`;
        }
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            callback();
        };
        xhr.onerror = function () {
            alert("Error while calling Web API");
        };
        xhr.open(Globals.IS_DIAGRAM_SAVED ? "PUT" : "POST", url);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(serializedDiagram);
    }
    getDiagram(diagramId, callback) {
        //TODO get url from config
        let url = "/api/data/diagram/" + diagramId;
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let data = xhr.responseText;
            callback(data);
        };
        xhr.onerror = function () {
            alert("Error while calling Web API");
        };
        xhr.open("GET", url);
        xhr.send();
    }
}
//# sourceMappingURL=CommunicationController.js.map