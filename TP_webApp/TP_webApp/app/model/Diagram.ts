import {Lifeline} from "./Lifeline";
import {CombinedFragment} from "./CombinedFragment";
import {Message} from "./Message";
import {Layer} from "./Layer";
import {DiagramView} from "../view/DiagramView";
import { DiagramMetadata } from "./DiagramMetadata";

export class Diagram {

    private _layers: Layer[];
    private _diagramView: DiagramView;
    private _metadata: DiagramMetadata;

    constructor(_layers: Layer[], _diagramView: DiagramView){
        this._layers = _layers ? _layers : [];
    }

    public get layers(): Layer[] {
        return this._layers;
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