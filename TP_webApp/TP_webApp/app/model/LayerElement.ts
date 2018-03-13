import { Layer } from "./Layer";
import { InteractionFragment } from "./InteractionFragment";
import { DiagramElement } from "./DiagramElement";

export abstract class LayerElement extends DiagramElement {

    protected __layer: Layer;

    public get layer(): Layer {
        return this.__layer;
    }

    public set layer(layer: Layer) {
        this.__layer = layer;
    }

}