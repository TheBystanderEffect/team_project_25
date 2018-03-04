import { Diagram } from "./Diagram";

export abstract class DiagramElement {

    protected __diagram: Diagram;
    
    public get diagram(): Diagram {
        return this.__diagram;
    }

    public set diagram(diagram: Diagram) {
        this.__diagram = this.diagram;
    }

}