import { CombinedFragment } from '../model/CombinedFragment';
import { Diagram } from '../model/Diagram';
import { InteractionOperand } from '../model/InteractionOperand';
import { Layer } from '../model/Layer';
import { Lifeline } from '../model/Lifeline';
import { Message } from '../model/Message';
import { OccurenceSpecification } from '../model/OccurenceSpecification';
import * as Globals from '../globals';

export class Serializer{

    private static _instance: Serializer;
    private serialized: string;

    combinedFragment: CombinedFragment = new CombinedFragment("TestOperator", null);
    diagram: Diagram = new Diagram(null,null);
    interactionOperand: InteractionOperand = new InteractionOperand(null, null, null);
    lifeline: Lifeline = new Lifeline("TestLifeline", "TestType", null, null);
    layer: Layer = new Layer([this.lifeline], null, null);
    occurenceSpecification: OccurenceSpecification = new OccurenceSpecification(null, null);

    private constructor(){
    }

    public static get instance():Serializer{
        if (this._instance == undefined){
            this._instance = new Serializer();
        }
        return this._instance;
    }

    deserialize(jSONString: string, objectType: string):any{
        var randomObject = JSON.parse(jSONString);
        // console.log("JSON parsed:");
        // console.log(randomObject);
        try {
            return this.deserializeObject(randomObject, objectType);    
        } catch (error) {
            console.log("Unable to parse JSON");
            return null   
        }
    }

    serialize(diagramObject: any, isDiagram: boolean = false): string{
        var derefferencedObject = null;
        try {
            if(isDiagram){
                derefferencedObject = this.derefferenceDiagram(diagramObject, "Diagram");
            }
            return JSON.stringify(derefferencedObject);
        } catch (error) {
            console.log("Unable to generate JSON")
            return "";
        }
    }

    deserializeObject(rawObject: any, objectType: string, realOccurenceContext: Map<string, any> = new Map<string, any>(), occurenceContext: Map<string, any>  = new Map<string, any>(), realMessageContext: Map<string, any>  = new Map<string, any>(), messageContext: Map<string, any>  = new Map<string, any>(), layerIndex:number = null, lifelineIndex:number = null, occurenceIndex:number = null, messageIndex:number = null, lifeline:any = null):any{
        switch(objectType){
            case "CombinedFragment":
                return new CombinedFragment("null", null);
            case "Diagram":
                layerIndex = 0;
                this.fillOccurenceContext("deserialize", rawObject, occurenceContext, realOccurenceContext); //Fill the occurenceContext with occurenceSpecifications for later derefference
                this.fillMessageContext("deserialize", rawObject, messageContext, realMessageContext); // Fill messageContext with the messages for later derefference
                var layers = rawObject.layers.map((e: any) => this.deserializeObject(e, "Layer", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex++));
                layers.forEach((la: Layer) => {
                    la.messages.forEach((li: any) => {
                        li.layer = la;
                    });
                });
                return new Diagram(layers, null);
            case "Lifeline":
                occurenceIndex = 0;
                return new Lifeline(rawObject.name, rawObject.type, rawObject.occurenceSpecifications.map((e: any) => this.deserializeObject(e, "OccurenceSpecification", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex, lifelineIndex, occurenceIndex++)), null);
            case "Layer": 
                lifelineIndex = 0;
                messageIndex = 0;
                var lifelines = rawObject.lifelines.map((e: any) => this.deserializeObject(e, "Lifeline", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex, lifelineIndex++)); 
                lifelines.forEach((e: any) => {
                    e.occurenceSpecifications.forEach((a:any) => {
                        a.at = e;
                    });
                });
                var messages = rawObject.messages.map((e: any) => this.deserializeObject(e, "Message", realOccurenceContext, occurenceContext, realMessageContext, messageContext, layerIndex, lifelineIndex, occurenceIndex, messageIndex++))
                return new Layer(lifelines, rawObject.combinedFragments.map((e: any) => this.deserializeObject(e, "CombinedFragment", realOccurenceContext, occurenceContext, null,null)), messages);               
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

    derefferenceDiagram(diagramElement: any, elementType: string):any{
        switch(elementType){
            case "Diagram":
                this.fillMessageContext("serialize", diagramElement);
                this.fillOccurenceContext("serialize", diagramElement);
                var diagramCopy = this.copyDiagram(diagramElement);
                diagramCopy.layers = diagramCopy.layers.map((e: any) => this.derefferenceDiagram(e, "Layer"));
                delete diagramCopy._layers;
                this.cleanUpRefferences(diagramElement, diagramCopy);
                return diagramCopy;
            case "Layer":
                diagramElement.lifelines = diagramElement.lifelines.map((e: any) => this.derefferenceDiagram(e, "Lifeline"));
                diagramElement.messages = diagramElement.messages.map((e: any) => this.derefferenceDiagram(e, "Message"));
                return diagramElement;
            case "Lifeline":
                diagramElement.occurenceSpecifications = diagramElement.occurenceSpecifications.map((e: any) => this.derefferenceDiagram(e, "OccurenceSpecification"));
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
                    occurenceIndex:diagramElement.end.deserializerHelperObject.occurenceIndex 
                };
                return diagramElement;
            case "OccurenceSpecification":
                delete diagramElement._at;
                diagramElement._message = {
                    layerIndex: diagramElement._message.deserializerHelperObject.layerIndex,
                    messageIndex: diagramElement._message.deserializerHelperObject.messageIndex
                }
                return diagramElement;
        }
        var placeholderObject = {}
    }

    fillOccurenceContext(type: string, diagramObject: any, occurenceContext: Map<string, any> = null, realOccurenceContext: Map<string, any> = null) {
        var layerIndex = 0;
        var lifelineIndex = 0;
        var occurenceIndex = 0;

        diagramObject.layers.forEach((layer:any) => {
            layer.lifelines.forEach((lifeline: any) => {
                lifeline.occurenceSpecifications.forEach((occurenceSpecification: any) => {
                    switch(type){
                        case "deserialize":
                            occurenceContext.set("" + layerIndex + lifelineIndex + occurenceIndex, occurenceSpecification);
                            realOccurenceContext.set("" + layerIndex + lifelineIndex + occurenceIndex, new OccurenceSpecification(null, null));
                        break;
                        case "serialize":
                            (occurenceSpecification as any).deserializerHelperObject = {
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

    fillMessageContext( type: string, diagramObject: any, messageContext: Map<string, any> = null, realMessageContext: Map<string, any> = null,) {
        var layerIndex = 0;
        var messageIndex = 0;
        diagramObject.layers.forEach((layer:any) => {
            layer.messages.forEach((message: any) => {
                switch(type){
                    case "deserialize":
                        messageContext.set("" + layerIndex + messageIndex, message);
                        realMessageContext.set("" + layerIndex + messageIndex, new Message(message.name, message.sort, message.kind, null, null)); 
                    break;
                    case "serialize":
                        (message as any).deserializerHelperObject = {
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

    cleanUpRefferences(diagramObject: any,diagramCopy: any){
        diagramObject.layers.forEach((layer:any) => {
            layer.messages.forEach((message: any) => {
                delete message.deserializerHelperObject;
            });
            layer.lifelines.forEach((lifeline: any) => {
                lifeline.occurenceSpecifications.forEach((occurenceSpecification: any) => {
                    delete occurenceSpecification.deserializerHelperObject;
                });
            });
        });
        diagramCopy.layers.forEach((layer:any) => {
            layer.messages.forEach((message: any) => {
                delete message.deserializerHelperObject;
            });
            layer.lifelines.forEach((lifeline: any) => {
                lifeline.occurenceSpecifications.forEach((occurenceSpecification: any) => {
                    delete occurenceSpecification.deserializerHelperObject;
                });
            });
        }); 
    }

    copyDiagram(diagramElement: any):any{
        var diagramCopy = Object.assign({}, diagramElement);
        diagramCopy.layers = diagramCopy._layers.map((layer:any) =>  Object.assign({}, layer));
        diagramCopy.layers.forEach((layer: any) => {
            layer.lifelines = layer.lifelines.map((lifeline:any) =>  Object.assign({}, lifeline));
                layer.lifelines.forEach((lifeline: any) => {
                    lifeline.occurenceSpecifications = lifeline.occurenceSpecifications.map((occurenceSpecification:any) =>  Object.assign({}, occurenceSpecification));
                });
            layer.messages = layer.messages.map((message:any) =>  Object.assign({}, message));
        });
        return diagramCopy;
    }

    createTestDiagram():Diagram{
        var diag = new Diagram(null,null);
        var ll1 = new Lifeline("ll1"," ",[],l1);
        var ll2 = new Lifeline("ll2"," ",[],l1);
        var ll3 = new Lifeline("ll3"," ",[],l1);
        var l1: Layer = new Layer([ll1,ll2,ll3],[],[]);
        diag.addLayer(l1);
        ll1.layer=l1;
        ll2.layer=l1;
        ll3.layer=l1;
        //var l2 = new Layer([ll3],[],[]);
        let oc1_1 = new OccurenceSpecification(ll1, null);
        ll1.AddOccurenceSpecification(oc1_1);
        let oc2_1 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_1);
        var m1 = new Message("test",1,1,oc1_1, oc2_1);
        l1.AddMessage(m1);
        m1.start.message = m1;
        m1.end.message = m1;
        let oc2_2 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_2);
        let oc3_1 = new OccurenceSpecification(ll3, null);
        ll3.AddOccurenceSpecification(oc3_1);
        var m2 = new Message("test2",1,1,oc2_2, oc3_1);
        l1.AddMessage(m2);
        m2.start.message = m2;
        m2.end.message = m2;
        let oc3_2 = new OccurenceSpecification(ll3, null);
        ll3.AddOccurenceSpecification(oc3_2);
        let oc2_3 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_3);
        var m3 = new Message("test3",1,1,oc3_2, oc2_3);
        l1.AddMessage(m3);
        m3.start.message = m3;
        m3.end.message = m3;
        let oc2_4 = new OccurenceSpecification(ll2, null);
        ll2.AddOccurenceSpecification(oc2_4);
        let oc1_2 = new OccurenceSpecification(ll1, null);
        ll1.AddOccurenceSpecification(oc1_2);
        var m4 = new Message("test4",1,1, oc2_4, oc1_2);
        l1.AddMessage(m4);
        m4.start.message = m4;
        m4.end.message = m4;
        return diag;
    }

    test(){
        var diag = this.createTestDiagram();
        console.log('Initialized diagram for serialization');
        console.log(diag);
        var serialized = this.serialize(diag, true);
        console.log('SERIALIZED!');
        console.log(serialized);
        var deserialized = this.deserialize(serialized,"Diagram");
        console.log('DESERIALIZED!');
        console.log(deserialized);
    }

}