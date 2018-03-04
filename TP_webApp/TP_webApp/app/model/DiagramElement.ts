import { Diagram } from "./Diagram";
import { BusinessElement } from "./BusinessElement";

export abstract class DiagramElement extends BusinessElement {

    protected __diagram: Diagram;
    
    public get diagram(): Diagram {
        return this.__diagram;
    }

    public set diagram(diagram: Diagram) {
        this.__diagram = diagram;
    }

}