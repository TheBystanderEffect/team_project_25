import { Diagram } from "./Diagram";
import { ModelElement } from "./ModelElement";

export abstract class DiagramElement extends ModelElement {

    protected __diagram: Diagram;
    
    public get diagram(): Diagram {
        return this.__diagram;
    }

    public set diagram(diagram: Diagram) {
        this.__diagram = this.diagram;
    }

}