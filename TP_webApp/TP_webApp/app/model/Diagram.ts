

export class Diagram {

    private _layers: Layer[];

    public get layers(): Layer[] {
        return this._layers;
    }

    public set layers(layers: Layer[]): void {
        this._layers = layers;
    }

}