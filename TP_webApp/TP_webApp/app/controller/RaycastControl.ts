import { Raycaster, Vector2, Scene, Camera } from 'three';
import { CustomMesh } from '../view/CustomMesh';
import { LayerView } from '../view/LayerView';
import { LifelineView } from '../view/LifelineView';
import * as Globals from '../globals';

export class RaycasterControl{

    private static _instance: RaycasterControl;
    private raycaster :Raycaster;
    private mouse: Vector2;
    private hasClicked: Boolean;

    public toDo:number;

    private onMouseDown( event:any ):any{
        console.log("mouse down"+event.which);
        if(event.which==1){
            console.log(this);
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            this.hasClicked=true;
        }
    }

    private constructor(){
        console.log('started constructor');
        this.raycaster = new Raycaster();
        this.hasClicked = false;
        this.mouse = new Vector2(0,0);
        console.log('mouse is'+this.mouse);
        window.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
        
    }

    public static get instance():RaycasterControl{
        if (this._instance == undefined){
            this._instance = new RaycasterControl();
        }
        return this._instance;
    }

    
    public cast(camera:Camera,scene:Scene){
        
        if(this.hasClicked && this.toDo > 0){
            this.raycaster.setFromCamera( this.mouse, camera );
            var intersects = this.raycaster.intersectObjects( scene.children );
            this.hasClicked=false
            // this.toDo = 0;
            //do stuff with intersects
            for ( var i = 0; i < intersects.length; i++ ) {
                //console.log(intersects[i]);
                if(intersects[i].object instanceof CustomMesh) {
                    let cmesh: CustomMesh = intersects[i].object as CustomMesh;
                    if(cmesh.metadata.parent instanceof LayerView){console.log('yey!');this.toDo = 0;
                        let lifeline = new LifelineView(intersects[i].point.x,intersects[i].point.y,intersects[i].point.z,300);
                        let lifeline_persist = {
                            type: 'LIFELINE',
                            source_x: intersects[i].point.x,
                            source_y: intersects[i].point.y,
                            source_z: intersects[i].point.z,
                            length: 300
                        };
                        Globals.CURRENTLY_OPENED_DIAGRAM.elements.push(lifeline_persist);
                        delete Globals.CURRENTLY_OPENED_DIAGRAM._id;
                        let xhr = new XMLHttpRequest();
                        xhr.open('PUT',`/api/data/diagram/${Globals.CURRENTLY_OPENED_DIAGRAM.id}`);
                        xhr.setRequestHeader("Content-type","application/json");
                        xhr.send('"'+ JSON.stringify(Globals.CURRENTLY_OPENED_DIAGRAM).replace(/"/g,'\\"') + '"');
                        lifeline.draw(scene);
                        break;
                    }
                }
            }
        }
    }

}


