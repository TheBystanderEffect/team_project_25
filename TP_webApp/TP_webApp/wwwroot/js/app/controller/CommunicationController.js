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
            console.log(xhr.responseText);
            let newId = xhr.response;
            return newId;
        }
        else {
            throw new Error("Couldn't get new GraphId");
        }
    }
    //proste zavolam    /savediagram/{IDdiagram}
    saveDiagram(serializedDiagram) {
        //TODO get url from config
        let url = "/api/data/diagram";
        let xhr = new XMLHttpRequest();
        xhr.onerror = function () {
            alert("Error while calling Web API");
        };
        console.log("Opening channel to send diagram...");
        xhr.open("POST", url);
        xhr.setRequestHeader('Content-type', 'application/json');
        console.log("Sending diagram: " + serializedDiagram);
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