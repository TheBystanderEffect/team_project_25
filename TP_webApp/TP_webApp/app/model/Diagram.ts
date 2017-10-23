import {Lifeline} from "../Lifeline";
import {CombinedFragment} from "../CombinedFragment";
import {Message} from "../Message";
import {Layer} from "../Layer";

export class Diagram {

    private _layers: Layer[];

    public get layers(): Layer[] {
        return this._layers;
    }

    public set layers(layers: Layer[]) {
        this._layers = layers;
    }

}