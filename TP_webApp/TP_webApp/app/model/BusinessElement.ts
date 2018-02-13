import { GraphicElement } from "../view/GraphicElement";

export class BusinessElement{

    private _graphicElement:GraphicElement;

    public get graphicElement():GraphicElement{
        return this._graphicElement;
    }

    public set graphicElement(graphicElement:GraphicElement){
        this._graphicElement = graphicElement;
    }

}