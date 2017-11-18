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
    lifeline: Lifeline = new Lifeline("TestLifeline", "TestType", null)
    layer: Layer = new Layer([this.lifeline], null, null);
    occurenceSpecification: OccurenceSpecification = new OccurenceSpecification(null, null);

    private constructor(){
    }

    deserialize(jSONString: string, objectType: string):any{
        let randomObject = JSON.parse(jSONString);
        return this.deserializeObject(randomObject, objectType);
    }

    deserializeObject(rawObject: any, objectType: string, context: any = null, layerIndex:any = null, lifelineIndex:any = null, occurenceIndex:any = null):any{
        switch(objectType){
            case "CombinedFragment":
                return new CombinedFragment(rawObject.interactionOperator, rawObject.interactionOperands.map((e: any) => this.deserializeObject(e, "InteractionOperand", context)));
            case "Diagram":
                context = [[[]]];
                let layerIndex = 0
                return new Diagram(rawObject.layers.map((e: any) => this.deserializeObject(e, "Layer", context, layerIndex++)), null);
            case "InteractionOperand":
                return new InteractionOperand(rawObject.interactionConstraint, rawObject.combinedFragment.map((e: any) => this.deserializeObject(e, "CombinedFragment", context)), rawObject.messages.map((e: any) => this.deserializeObject(e, "Message", context)));
            case "Lifeline":
                occurenceIndex = 0;
                let lifeline = new Lifeline(rawObject.name, rawObject.type, rawObject.occurenceSpecifications.map((e: any) => this.deserializeObject(e, "OccurenceSpecification", context, layerIndex, lifelineIndex, occurenceIndex++)));
                return lifeline;
            case "Layer":
                lifelineIndex = 0;
                return new Layer(rawObject.lifelines.map((e: any) => this.deserializeObject(e, "Lifeline", context, layerIndex, lifelineIndex++)), rawObject.combinedFragments.map((e: any) => this.deserializeObject(e, "CombinedFragment", context)), rawObject.messages.map((e: any) => this.deserializeObject(e, "Message", context)));
            case "Message":
                return new Message(rawObject.name, rawObject.sort, rawObject.kind, context[rawObject.start.layerIndex][rawObject.start.lifelineIndex][rawObject.start.occurenceIndex], context[rawObject.end.layerIndex][rawObject.end.lifelineIndex][rawObject.end.occurenceIndex]);
            case "OccurenceSpecification":
                let specification = new OccurenceSpecification(this.deserializeObject(rawObject.at, "Lifeline", context));
                context[layerIndex][lifelineIndex][occurenceIndex] = specification;
                return specification;
        }
    }

    serialize(diagramObject: any, isDiagram: boolean = false): string{
        let derefferencedObject = null;
        if(isDiagram){
            derefferencedObject = this.derefferenceDiagram(diagramObject, "Diagram");
        }
        return JSON.stringify(isDiagram? diagramObject: derefferencedObject);
    }

    derefferenceDiagram(diagramElement: any, elementType: string, layerIndex: any = null, lifelineIndex: any = null, occurenceIndex:any= null):any{
        switch(elementType){
            case "Diagram":
                let layerIndex = 0;
                diagramElement.layers = diagramElement.layers.map((e: any) => this.derefferenceDiagram(e, "Layer", layerIndex++));
                return diagramElement;
            case "Layer":
                let lifelineIndex = 0;
                diagramElement.lifelines = diagramElement.lifelines.map((e: any) => this.derefferenceDiagram(e, "Lifeline", layerIndex, lifelineIndex++));
                diagramElement.messages = diagramElement.messages.map((e: any) => this.derefferenceDiagram(e, "Message"));
                return diagramElement;
            case "Lifeline":
                let occurenceIndex = 0;
                diagramElement.occurenceSpecifications = diagramElement.occurenceSpecifications.map((e: any) => this.derefferenceDiagram(e, "OccurenceSpecification", layerIndex, lifelineIndex++, occurenceIndex++));
                return diagramElement;
            case "Message":
                diagramElement.start = {layerIndex: diagramElement.start.layerIndex, lifelineIndex: diagramElement.start.lifelineIndex, occurenceIndex: diagramElement.start.occurenceIndex}; 
                diagramElement.end = {layerIndex: diagramElement.end.layerIndex, lifelineIndex: diagramElement.end.lifelineIndex, occurenceIndex: diagramElement.end.occurenceIndex};
                return diagramElement;
            case "OccurenceSpecification":
                return {layerIndex: layerIndex, lifelineIndex: lifelineIndex, occurenceIndex:occurenceIndex};
        }
        let placeholderObject = {}
    }

    test(){
        //serializable: Object
        // console.log("Started object serialization");
        // this.serialized = JSON.stringify(this.combinedFragment);
        // console.log(this.serialized);

        // this.serialized = JSON.stringify(this.diagram);
        // console.log("Serialized diagram");
        // console.log(this.serialized);

        // this.serialized = JSON.stringify(this.interactionOperand);
        // console.log("Serialized interactionOperand");
        // console.log(this.serialized);

        // this.serialized = JSON.stringify(this.lifeline);
        // console.log("Serialized lifeline");
        // console.log(this.serialized);

        // this.serialized = JSON.stringify(this.layer);
        // console.log("Serialized layer");
        // console.log(this.serialized);

        // this.serialized = JSON.stringify(this.message);
        // console.log("Serialized message");
        // console.log(this.serialized);

        // this.serialized = JSON.stringify(this.occurenceSpecification);
        // console.log("Serialized occurenceSpecification");
        // console.log(this.serialized);

        // console.log("Serializing layer");
        // this.testString = this.serialize(this.layer);
        // console.log("Serialization result:");
        // console.log(this.testString);
        // this.testLayer = this.deserialize(this.testString, "Layer");
        // console.log("Deserialization result");
        // console.log(this.testLayer);
        // console.log("Lopata?");
        // this.testLayer.lopata();

    }

    public static get instance():Serializer{
        if (this._instance == undefined){
            this._instance = new Serializer();
        }
        return this._instance;
    }

}