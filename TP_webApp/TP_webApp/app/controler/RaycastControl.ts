import { Raycaster, Vector2, Scene, Camera } from 'three';
import { CustomMesh } from '../view/CustomMesh';
import { LayerView } from '../view/LayerView';
import { LifelineView } from '../view/LifelineView'

export class RaycasterControl{

    private static _instance: RaycasterControl;
    private raycaster :Raycaster;
    private mouse: Vector2;
    private hasClicked: Boolean;

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
        if(this.hasClicked){
            this.raycaster.setFromCamera( this.mouse, camera );
            var intersects = this.raycaster.intersectObjects( scene.children );
            this.hasClicked=false

            //do stuff with intersects
            for ( var i = 0; i < intersects.length; i++ ) {
                //console.log(intersects[i]);
                if(intersects[i].object instanceof CustomMesh) {
                    let cmesh: CustomMesh = intersects[i].object as CustomMesh;
                    if(cmesh.metadata.parent instanceof LayerView){console.log('yey!');
                        //cmesh.metadata.parent.parent.
                        new LifelineView(intersects[i].point.x,intersects[i].point.y,intersects[i].point.z,300).draw(scene);
                        break;
                    }
                }
            }
        }
    }

}


