import { GraphicElement } from "../view/GraphicElement";

export abstract class ModelElement {

    protected __graphicElement: GraphicElement;

    public get graphicElement(): GraphicElement {
        return this.__graphicElement;
    }

    public set graphicElement(graphicElement: GraphicElement) {
        this.__graphicElement = graphicElement;
    }

}