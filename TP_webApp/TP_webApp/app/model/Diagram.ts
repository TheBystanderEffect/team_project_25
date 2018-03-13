import { Layer } from "./Layer";
import { BusinessElement } from "./BusinessElement";

export class Diagram extends BusinessElement {

    protected _id: number;
    protected _layers: Layer[] = [];

<<<<<<< HEAD
    constructor(_layers: Layer[], _diagramView: DiagramView, verId: number = 0){
        super();
        this._layers = _layers ? _layers : [];
        this._verId = verId;
    }

    public initdiagramId(){
        this._diagramId = CommunicationController.instance.getNewDiagramId();
=======
    public get id(): number {
        return this._id;
>>>>>>> dev
    }

    public set id(id: number) {
        this._id = id;
    }

    public get layers(): Layer[] {
        return this._layers;
    }

    public set layers(layers: Layer[]) {
        this._layers = layers;
    }

}