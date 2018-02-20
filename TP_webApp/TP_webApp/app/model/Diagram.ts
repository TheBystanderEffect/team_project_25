import {Lifeline} from "./Lifeline";
import {CombinedFragment} from "./CombinedFragment";
import {Message} from "./Message";
import {Layer} from "./Layer";
import {DiagramView} from "../view/DiagramView";
import { DiagramMetadata } from "./DiagramMetadata";
import { BusinessElement } from "./BusinessElement";
import { CommunicationController } from '../controller/CommunicationController';

export class Diagram extends BusinessElement{

    private _layers: Layer[];
    private _diagramView: DiagramView;
    private _metadata: DiagramMetadata;
    private _diagramId: number;
    private _verId: number;

    constructor(_layers: Layer[], _diagramView: DiagramView, verId: number = 0){
        super();
        this._layers = _layers ? _layers : [];
        this._verId = verId;
        console.log("Getting ID from server....")
        this._diagramId = CommunicationController.instance.getNewDiagramId();
        // this._diagramId = 42;
    }

    public get layers(): Layer[] {
        return this._layers;
    }

    public get diagramId(): number {
        return this._diagramId;
    }

    public set layers(layers: Layer[]) {
        this._layers = layers;
    }

    public addLayer(layer:Layer){
        this._layers.push(layer);
    }

    public get diagramView(): DiagramView {
        return this._diagramView;
    }

    public set diagramView(diagramView: DiagramView) {
        this._diagramView = diagramView;
    }

}