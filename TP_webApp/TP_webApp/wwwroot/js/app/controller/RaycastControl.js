import { Raycaster, Vector2 } from 'three';
export class RaycastControl {
    constructor() {
        this.raycaster = new Raycaster();
    }
    static get instance() {
        if (this._instance == undefined) {
            this._instance = new RaycastControl();
        }
        return this._instance;
    }
    cast(camera, scene, event) {
        var mouse = new Vector2(((event.offsetX / window.innerWidth) * 2 - 1), (-(event.offsetY / window.innerHeight) * 2 + 1));
        this.raycaster.setFromCamera(mouse, camera);
        var intersects = this.raycaster.intersectObjects(scene.children, true);
        return intersects.map(e => e.object);
        // if(this.hasClicked ){
        //     this.raycaster.setFromCamera( this.mouse, camera );
        //     var intersects = this.raycaster.intersectObjects( scene.children );
        //     this.hasClicked=false;
        //     return intersects;
        // this.toDo = 0;
        //do stuff with intersects
        // for ( var i = 0; i < intersects.length; i++ ) {
        //     if(intersects[i].object instanceof CustomMesh) {
        //         let cmesh: CustomMesh = intersects[i].object as CustomMesh;
        //         if(cmesh.metadata.parent instanceof LayerView){
        //             // To do fix
        //             let lifeline = new LifelineView(null,intersects[i].point.x,intersects[i].point.y,intersects[i].point.z,300);
        //             let lifeline_persist = {
        //                 type: 'LIFELINE',
        //                 source_x: intersects[i].point.x,
        //                 source_y: intersects[i].point.y,
        //                 source_z: intersects[i].point.z,
        //                 length: 300
        //             };
        //             Globals.CURRENTLY_OPENED_DIAGRAM.elements.push(lifeline_persist);
        //             delete Globals.CURRENTLY_OPENED_DIAGRAM._id;
        //             let xhr = new XMLHttpRequest();
        //             xhr.open('PUT',`/api/data/diagram/${Globals.CURRENTLY_OPENED_DIAGRAM.id}`);
        //             xhr.setRequestHeader("Content-type","application/json");
        //             xhr.send('"'+ JSON.stringify(Globals.CURRENTLY_OPENED_DIAGRAM).replace(/"/g,'\\"') + '"');
        //             lifeline.draw(scene);
        //             break;
        //         }
        //     }
        // }
        //}
    }
}
//# sourceMappingURL=RaycastControl.js.map