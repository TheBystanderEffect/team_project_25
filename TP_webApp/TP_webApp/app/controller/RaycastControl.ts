import { Raycaster, Vector2, Scene, Camera, Intersection } from 'three';
import { CustomMesh } from '../view/CustomMesh';
import { LayerView } from '../view/LayerView';
import { LifelineView } from '../view/LifelineView';
import * as Globals from '../globals';

import { GLContext } from "../view/GLContext"; //debuging



export class RaycastControl{

    private static _instance: RaycastControl;
    private raycaster :Raycaster;

    private constructor(){
        this.raycaster = new Raycaster();        
    }

    public static get instance():RaycastControl{
        if (this._instance == undefined){
            this._instance = new RaycastControl();
        }
        return this._instance;
    }

  
    
    public cast(camera:Camera,scene:Scene,event:MouseEvent): CustomMesh[] {
        var mouse = new Vector2((( event.offsetX / window.innerWidth ) * 2 - 1),(-(event.offsetY / window.innerHeight ) * 2 + 1));
        this.raycaster.setFromCamera(mouse, camera);
        
        var intersects = this.raycaster.intersectObjects( scene.children , true );
        
        return intersects.map(e=>e.object) as any as CustomMesh[];
    }

    public static simpleDefaultIntersect(event: MouseEvent): Intersection[]{
        var mouse = new Vector2((( event.offsetX / window.innerWidth ) * 2 - 1),(-(event.offsetY / window.innerHeight ) * 2 + 1));
        RaycastControl.instance.getRaycaster().setFromCamera(mouse,GLContext.instance.camera);
        let castResult = RaycastControl.instance.getRaycaster().intersectObjects( GLContext.instance.scene.children , true );
        return castResult;
    }

    private getRaycaster():Raycaster{
        return this.raycaster;
    }


}


