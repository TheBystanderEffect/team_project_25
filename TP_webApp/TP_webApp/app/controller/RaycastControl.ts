import { Raycaster, Vector2, Scene, Camera, Intersection } from 'three';
import { CustomMesh } from '../view/CustomMesh';
import { LayerView } from '../view/LayerView';
import { LifelineView } from '../view/LifelineView';
import * as Globals from '../globals';

import { GLContext } from "../view/GLContext"; //debuging

export class RaycastControl{

    public static cast(camera:Camera,scene:Scene,event:MouseEvent): CustomMesh[] {
        var mouse = new Vector2((( event.offsetX / window.innerWidth ) * 2 - 1),(-(event.offsetY / window.innerHeight ) * 2 + 1));
        let raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects( scene.children , true );
        return intersects.map(e=>e.object) as any as CustomMesh[];
    }

    public static simpleDefaultIntersect(event: MouseEvent): Intersection[]{
        var mouse = new Vector2((( event.offsetX / window.innerWidth ) * 2 - 1),(-(event.offsetY / window.innerHeight ) * 2 + 1));
        let raycaster = new Raycaster();
        raycaster.setFromCamera(mouse,GLContext.instance.camera);
        let intersects = raycaster.intersectObjects( GLContext.instance.scene.children , true );
        return intersects;
    }
}



