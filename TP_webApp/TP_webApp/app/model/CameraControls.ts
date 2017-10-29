import { Camera } from 'three';
import { Object3D } from "three";
import { Vector3 } from "three";
import { Euler } from "three";
export class CameraControls {

        camera:Camera;
        self:CameraControls;
        pitchObject: Object3D;
        yawObject:Object3D;
        

        constructor(camera:Camera){
            this.camera=camera;
            this.self = this;

            document.addEventListener('mousemove', this.onmousemove, false );
        }
        
        init(camera:Camera):void{
            this.pitchObject.add(camera);
            this.yawObject.position.y = 10;
            this.yawObject.add(this.pitchObject);

        }

        
        public set enabled(v : boolean) {
            this.enabled = v;
        }
        

        onmousemove(event:MouseEvent){
            if( !this.enabled ){
                return;
            }

            let movementX = event.movementX || 0;
            let movementY = event.movementY || 0;
            
            this.yawObject.rotation.y -= movementX * 0.002;
            this.pitchObject.rotation.x -= movementY * 0.002;

            this.pitchObject.rotation.x = Math.max(-(Math.PI / 2),Math.min((Math.PI,this.pitchObject.rotation.x)));
            this.camera.updateMatrix();
        }
        
        
        public get getObject() : Object3D {
            return  this.yawObject;
        }
        
        public get getPitchObject() : Object3D {
            return this.pitchObject;
        }

        getDirection(){
            let direction = new Vector3(0,0,-1);
            let rotation = new Euler(0,0,0,"YXZ");
        }
        
}