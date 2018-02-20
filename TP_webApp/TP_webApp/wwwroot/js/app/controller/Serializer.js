import { CombinedFragment } from '../model/CombinedFragment';
import { Diagram } from '../model/Diagram';
import { InteractionOperand } from '../model/InteractionOperand';
import { Layer } from '../model/Layer';
import { Lifeline } from '../model/Lifeline';
import { Message } from '../model/Message';
import { OccurenceSpecification } from '../model/OccurenceSpecification';
import { CommunicationController } from '../controller/CommunicationController';
export class Serializer {
    constructor() {
        this.combinedFragment = new CombinedFragment("TestOperator", null);
        this.diagram = new Diagram(null, null);
        this.interactionOperand = new InteractionOperand(null, null, null);
        this.lifeline = new Lifeline("TestLifeline", "TestType", null, null);
        this.layer = new Layer([this.lifeline], null, null);
        this.occurenceSpecification = new OccurenceSpecification(null, null);
    }
    static get instance() {
        if (this._instance == undefined) {
            this._instance = new Serializer();
        }
        return this._instance;
    }
    deserialize(jSONString, objectType) {
        var randomObject = JSON.parse(jSONString);
        try {
            return this.deserializeObject(randomObject, objectType);
        }
        catch (error) {
            console.log("Unable to parse JSON");
            return null;
        }
    }
    serialize(diagramObject, isDiagram = false) {
        var derefferencedObject = null;
        try {
            if (isDiagram) {
                derefferencedObject = this.derefferenceDiagram(diagramObject, "Diagram");
            }
            return JSON.stringify(derefferencedObject);
        }
        catch (error) {
            console.log("Unable to generate JSON");
            return "";
        }
    }
    deserializeObject(rawObject, objectType, realOccurenceContext = new Map(), occurenceContext = new Map(), realMessageContext = new Map(), messageContext = new Map(), layerIndex = null, lifelineIndex = null, occurenceIndex = null, messageIndex = null, lifeline = null) {
        switch (objectType) {
            case "CombinedFragment":
                return new CombinedFragment("null", null);
            case "Diagram":
                layerIndex = 0;
                this.fillOccurenceContext("deserialize", rawObject, occurenceContext, realOccurenceContext); //Fill the occurenceContext with occurenceSpecifications for later derefference
                this.fillMessageContext("deserialize", rawObject, messageContext, realMessageContext); // Fill messageContext with the messages for later derefference
                var layers = rawObject.layers.map((e) => this.deserializeObject(e, "Layer", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex++));
                layers.forEach((la) => {
                    la.messages.forEach((li) => {
                        li.layer = la;
                    });
                });
                return new Diagram(layers, null);
            case "Lifeline":
                occurenceIndex = 0;
                return new Lifeline(rawObject.name, rawObject.type, rawObject.occurenceSpecifications.map((e) => this.deserializeObject(e, "OccurenceSpecification", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex, lifelineIndex, occurenceIndex++)), null);
            case "Layer":
                lifelineIndex = 0;
                messageIndex = 0;
                var lifelines = rawObject.lifelines.map((e) => this.deserializeObject(e, "Lifeline", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex, lifelineIndex++));
                lifelines.forEach((e) => {
                    e.occurenceSpecifications.forEach((a) => {
                        a.at = e;
                    });
                });
                var messages = rawObject.messages.map((e) => this.deserializeObject(e, "Message", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex, lifelineIndex, occurenceIndex, messageIndex++));
                return new Layer(lifelines, rawObject.combinedFragments.map((e) => this.deserializeObject(e, "CombinedFragment", realOccurenceContext, occurenceContext, null, null)), messages);
            case "Message":
                let message = realMessageContext.get("" + layerIndex + messageIndex);
                let messageRefference = messageContext.get("" + layerIndex + messageIndex);
                message.start = realOccurenceContext.get("" + messageRefference.start.layerIndex + messageRefference.start.lifelineIndex + messageRefference.start.occurenceIndex);
                message.end = realOccurenceContext.get("" + messageRefference.end.layerIndex + messageRefference.end.lifelineIndex + messageRefference.end.occurenceIndex);
                return message;
            case "OccurenceSpecification":
                var occurrence = realOccurenceContext.get("" + layerIndex + lifelineIndex + occurenceIndex);
                var occurrenceRefference = occurenceContext.get("" + layerIndex + lifelineIndex + occurenceIndex);
                occurrence.message = realMessageContext.get("" + occurrenceRefference._message.layerIndex + occurrenceRefference._message.messageIndex);
                occurrence.at = lifeline;
                return occurrence;
        }
    }
    derefferenceDiagram(diagramElement, elementType) {
        switch (elementType) {
            case "Diagram":
                this.fillMessageContext("serialize", diagramElement);
                this.fillOccurenceContext("serialize", diagramElement);
                var diagramCopy = this.copyDiagram(diagramElement);
                diagramCopy.layers = diagramCopy.layers.map((e) => this.derefferenceDiagram(e, "Layer"));
                delete diagramCopy._layers;
                this.cleanUpRefferences(diagramElement, diagramCopy);
                return diagramCopy;
            case "Layer":
                diagramElement.lifelines = diagramElement.lifelines.map((e) => this.derefferenceDiagram(e, "Lifeline"));
                diagramElement.messages = diagramElement.messages.map((e) => this.derefferenceDiagram(e, "Message"));
                return diagramElement;
            case "Lifeline":
                diagramElement.occurenceSpecifications = diagramElement.occurenceSpecifications.map((e) => this.derefferenceDiagram(e, "OccurenceSpecification"));
                delete diagramElement._layer;
                return diagramElement;
            case "Message":
                diagramElement.start = {
                    layerIndex: diagramElement.start.deserializerHelperObject.layerIndex,
                    lifelineIndex: diagramElement.start.deserializerHelperObject.lifelineIndex,
                    occurenceIndex: diagramElement.start.deserializerHelperObject.occurenceIndex
                };
                diagramElement.end = {
                    layerIndex: diagramElement.end.deserializerHelperObject.layerIndex,
                    lifelineIndex: diagramElement.end.deserializerHelperObject.lifelineIndex,
                    occurenceIndex: diagramElement.end.deserializerHelperObject.occurenceIndex
                };
                return diagramElement;
            case "OccurenceSpecification":
                delete diagramElement._at;
                diagramElement._message = {
                    layerIndex: diagramElement._message.deserializerHelperObject.layerIndex,
                    messageIndex: diagramElement._message.deserializerHelperObject.messageIndex
                };
                return diagramElement;
        }
        var placeholderObject = {};
    }
    fillOccurenceContext(type, diagramObject, occurenceContext = null, realOccurenceContext = null) {
        var layerIndex = 0;
        var lifelineIndex = 0;
        var occurenceIndex = 0;
        diagramObject.layers.forEach((layer) => {
            layer.lifelines.forEach((lifeline) => {
                lifeline.occurenceSpecifications.forEach((occurenceSpecification) => {
                    switch (type) {
                        case "deserialize":
                            occurenceContext.set("" + layerIndex + lifelineIndex + occurenceIndex, occurenceSpecification);
                            realOccurenceContext.set("" + layerIndex + lifelineIndex + occurenceIndex, new OccurenceSpecification(null, null));
                            break;
                        case "serialize":
                            occurenceSpecification.deserializerHelperObject = {
                                layerIndex: layerIndex,
                                lifelineIndex: lifelineIndex,
                                occurenceIndex: occurenceIndex
                            };
                            break;
                    }
                    occurenceIndex++;
                });
                occurenceIndex = 0;
                lifelineIndex++;
            });
            lifelineIndex = 0;
            layerIndex++;
        });
    }
    fillMessageContext(type, diagramObject, messageContext = null, realMessageContext = null) {
        var layerIndex = 0;
        var messageIndex = 0;
        diagramObject.layers.forEach((layer) => {
            layer.messages.forEach((message) => {
                switch (type) {
                    case "deserialize":
                        messageContext.set("" + layerIndex + messageIndex, message);
                        realMessageContext.set("" + layerIndex + messageIndex, new Message(message.name, message.sort, message.kind, null, null));
                        break;
                    case "serialize":
                        message.deserializerHelperObject = {
                            layerIndex: layerIndex,
                            messageIndex: messageIndex
                        };
                        break;
                }
                messageIndex++;
            });
            messageIndex = 0;
            layerIndex++;
        });
    }
    cleanUpRefferences(diagramObject, diagramCopy) {
        diagramObject.layers.forEach((layer) => {
            layer.messages.forEach((message) => {
                delete message.deserializerHelperObject;
            });
            layer.lifelines.forEach((lifeline) => {
                lifeline.occurenceSpecifications.forEach((occurenceSpecification) => {
                    delete occurenceSpecification.deserializerHelperObject;
                });
            });
        });
        diagramCopy.layers.forEach((layer) => {
            layer.messages.forEach((message) => {
                delete message.deserializerHelperObject;
            });
            layer.lifelines.forEach((lifeline) => {
                lifeline.occurenceSpecifications.forEach((occurenceSpecification) => {
                    delete occurenceSpecification.deserializerHelperObject;
                });
            });
        });
    }
    copyDiagram(diagramElement) {
        var diagramCopy = Object.assign({}, diagramElement);
        diagramCopy.layers = diagramCopy._layers.map((layer) => Object.assign({}, layer));
        diagramCopy.layers.forEach((layer) => {
            layer.lifelines = layer.lifelines.map((lifeline) => Object.assign({}, lifeline));
            layer.lifelines.forEach((lifeline) => {
                lifeline.occurenceSpecifications = lifeline.occurenceSpecifications.map((occurenceSpecification) => Object.assign({}, occurenceSpecification));
            });
            layer.messages = layer.messages.map((message) => Object.assign({}, message));
        });
        return diagramCopy;
    }
    createTestDiagram() {
        var diag = new Diagram(null, null);
        var ll1 = new Lifeline("ll1", " ", [], l1);
        var ll2 = new Lifeline("ll2", " ", [], l1);
        var ll3 = new Lifeline("ll3", " ", [], l1);
        var l1 = new Layer([ll1, ll2, ll3], [], []);
        diag.addLayer(l1);
        ll1.layer = l1;
        ll2.layer = l1;
        ll3.layer = l1;
        //var l2 = new Layer([ll3],[],[]);
        let oc1_1 = new OccurenceSpecification(ll1, null);
        ll1.AddOccurenceSpecification(oc1_1);
        let oc2_1 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_1);
        var m1 = new Message("test", 1, 1, oc1_1, oc2_1);
        l1.AddMessage(m1);
        m1.start.message = m1;
        m1.end.message = m1;
        let oc2_2 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_2);
        let oc3_1 = new OccurenceSpecification(ll3, null);
        ll3.AddOccurenceSpecification(oc3_1);
        var m2 = new Message("test2", 1, 1, oc2_2, oc3_1);
        l1.AddMessage(m2);
        m2.start.message = m2;
        m2.end.message = m2;
        let oc3_2 = new OccurenceSpecification(ll3, null);
        ll3.AddOccurenceSpecification(oc3_2);
        let oc2_3 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_3);
        var m3 = new Message("test3", 1, 1, oc3_2, oc2_3);
        l1.AddMessage(m3);
        m3.start.message = m3;
        m3.end.message = m3;
        let oc2_4 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_4);
        let oc1_2 = new OccurenceSpecification(ll1, null);
        ll1.AddOccurenceSpecification(oc1_2);
        var m4 = new Message("test4", 1, 1, oc2_4, oc1_2);
        l1.AddMessage(m4);
        m4.start.message = m4;
        m4.end.message = m4;
        return diag;
    }
    test() {
        var diag = this.createTestDiagram();
        console.log('Initialized diagram for serialization');
        console.log(diag);
        var serialized = this.serialize(diag, true);
        console.log('SERIALIZED!');
        console.log(serialized);
        var deserialized = this.deserialize(serialized, "Diagram");
        console.log('DESERIALIZED!');
        console.log(deserialized);
    }
    serverTest() {
        var diag = this.createTestDiagram();
        console.log('Initialized diagram for serialization');
        console.log(diag);
        var serialized = this.serialize(diag, true);
        console.log('SERIALIZED!');
        console.log(serialized);
        CommunicationController.instance.saveDiagram(serialized);
        console.log('Sent diagram in JSON to save on server. Diagram ID: ' + diag.diagramId);
        let callback = function (data) {
            serialized = data;
            var deserialized = this.deserialize(serialized, "Diagram");
            console.log('DESERIALIZED!');
            console.log(deserialized);
        };
        CommunicationController.instance.getDiagram(diag.diagramId, callback);
    }
}
//# sourceMappingURL=Serializer.js.map