import { Mesh } from 'three'
import { GraphicElement } from './GraphicElement';

export class CustomMesh extends Mesh {

    //public metadata: any;
    //^NO, just, NO

    public get viewObject():GraphicElement{
        return (this.parent as any).viewObject;
    }

    //you animals, have this if you must
    public get metadata():any{
        return {parent: this.viewObject};
    }
}