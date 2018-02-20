import { GraphicElement } from "../view/GraphicElement";

export class BusinessElement{

    private _graphicElement:GraphicElement;

    public get graphicElement():GraphicElement{
        return this._graphicElement;
    }

    public set graphicElement(graphicElement:GraphicElement){
        this._graphicElement=graphicElement;
    }

    public toJSON(): string {
        let obj: any = {};

        for (let key in Object.keys(this)) {
            if (key != '_diagramView' && key != '_graphicElement') {
                obj[key] = (this as any)[key];
            }
        }

        (obj as BusinessElement)._graphicElement = undefined;

        return JSON.stringify(obj);
    }

}