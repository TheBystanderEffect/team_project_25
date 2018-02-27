import { Mesh } from 'three'
import { GraphicElement } from './GraphicElement';

export class CustomMesh extends Mesh {

    //public metadata: any;
    //^NO, just, NO

    //thease MAY be the solution, dont use them yet
    // public get graphicElement():GraphicElement{
    //     return (this.parent as any).graphicElement;
    // }
    // public get graphicElementDirect():GraphicElement{
    //     return this.parent as GraphicElement;
    // }

    //you animals, have this if you must
    public get metadata():any{
        return this;
    }
}