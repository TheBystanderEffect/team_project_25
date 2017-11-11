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
    diagram: Diagram = new Diagram();
    interactionOperand: InteractionOperand = new InteractionOperand();
    lifeline: Lifeline = new Lifeline("TestLifeline", "TestType", null)
    layer: Layer = new Layer([this.lifeline], null, null);
    message: Message = new Message("testMessage", null, null, null, null);
    occurenceSpecification: OccurenceSpecification = new OccurenceSpecification();

    private constructor(){
    }

    deserialize(jSONString: string, objectType: string):Object{
        switch(objectType){
            case "CombinedFragment":
                let combinedFragment: CombinedFragment = JSON.parse(jSONString);
                return combinedFragment;
            case "Diagram":
                let diagram: Diagram = JSON.parse(jSONString);
                return diagram;
            case "":
                let interactionOperand: InteractionOperand = JSON.parse(jSONString);
                return interactionOperand;
            case "":
                let lifeline: Lifeline = JSON.parse(jSONString);
                return lifeline;
            case "":
                let layer: Layer = JSON.parse(jSONString);
                return layer;
            case "":
                let message: Message = JSON.parse(jSONString);
                return message;
            case "":
                let occurenceSpecification: OccurenceSpecification = JSON.parse(jSONString);
                return occurenceSpecification;
        }
    }

    serialize(diagramObject: Object): string{
        return JSON.stringify(diagramObject);
    }

    test(){
        //serializable: Object
        console.log("Started object serialization");
        this.serialized = JSON.stringify(this.combinedFragment);
        console.log(this.serialized);

        this.serialized = JSON.stringify(this.diagram);
        console.log("Serialized diagram");
        console.log(this.serialized);

        this.serialized = JSON.stringify(this.interactionOperand);
        console.log("Serialized interactionOperand");
        console.log(this.serialized);

        this.serialized = JSON.stringify(this.lifeline);
        console.log("Serialized lifeline");
        console.log(this.serialized);

        this.serialized = JSON.stringify(this.layer);
        console.log("Serialized layer");
        console.log(this.serialized);

        this.serialized = JSON.stringify(this.message);
        console.log("Serialized message");
        console.log(this.serialized);

        this.serialized = JSON.stringify(this.occurenceSpecification);
        console.log("Serialized occurenceSpecification");
        console.log(this.serialized);
    }

    public static get instance():Serializer{
        if (this._instance == undefined){
            this._instance = new Serializer();
        }
        return this._instance;
    }

}