import { OccurenceSpecification } from "./OccurenceSpecification";
import { LayerElement } from "./LayerElement";

export class Lifeline extends LayerElement {

    protected _name: string;
    protected __occurenceSpecifications: OccurenceSpecification[] = [];
    
    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get occurenceSpecifications(): OccurenceSpecification[] {
        return this.__occurenceSpecifications;
    }

    public set occurenceSpecifications(occurenceSpecifications: OccurenceSpecification[]) {
        this.__occurenceSpecifications = occurenceSpecifications;
    }
}