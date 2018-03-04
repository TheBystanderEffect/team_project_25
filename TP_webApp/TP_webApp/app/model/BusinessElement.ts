import { GraphicElement } from "../view/GraphicElement";

export abstract class BusinessElement {

    protected __graphicElement: GraphicElement;

    public get graphicElement(): GraphicElement {
        return this.__graphicElement;
    }

    public set graphicElement(graphicElement: GraphicElement) {
        this.__graphicElement = graphicElement;
    }

}