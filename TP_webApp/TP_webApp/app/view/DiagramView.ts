import { PlaneGeometry, MeshLambertMaterial, Mesh, Scene, Vector3,Object3D } from 'three'
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import { Diagram } from "../model/Diagram"

export class DiagramView extends Object3D{

    private diagram:Diagram;

    public constructor(diagram:Diagram) {
        super();
        this.diagram=diagram;
        return this;
    }    

}

