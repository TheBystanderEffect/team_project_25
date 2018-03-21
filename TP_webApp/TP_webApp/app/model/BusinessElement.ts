import { GraphicElement } from "../view/GraphicElement";
import { ViewMap } from "../view/TypeMapping";

export abstract class BusinessElement {

    protected __graphicElement: GraphicElement;

    public get graphicElement(): GraphicElement {
        if (!this.__graphicElement) {
            for (let [ modelType, constructorFunction ] of ViewMap) {
                if (this instanceof modelType) {
                    this.__graphicElement = constructorFunction(this);
                    break;
                }
            }
        }
        return this.__graphicElement;
    }

    public set graphicElement(graphicElement: GraphicElement) {
        this.__graphicElement = graphicElement;
    }

}