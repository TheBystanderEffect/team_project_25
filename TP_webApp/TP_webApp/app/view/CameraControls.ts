import { PerspectiveCamera, Object3D, Vector3, Euler, Scene } from 'three';
import {Serializer} from '../controller/Serializer';

export class CameraControls {

        camera: PerspectiveCamera;
        _pitchObject: Object3D = new Object3D();
        _yawObject: Object3D = new Object3D();
        _enabled: boolean = false;
        CAMERA_SPEED: number = 7.0;
        cameraSpeedVector: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorW: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorA: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorS: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorD: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorQ: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorE: Vector3 = new Vector3( 0, 0, 0 );
        animationLength = 0.5;
        animationProgress = 1;
        private animation = {
            sourcePosition: new Vector3(0,0,0),
            destinationPosition: new Vector3(0,0,0),
            sourceRotation: new Vector3(0,0,0), //PITCH YAW ROLL
            destinationRotation: new Vector3(0,0,0) //PITCH YAW ROLL
        }

        constructor(camera: PerspectiveCamera) {
            this.camera = camera;

            document.addEventListener('mousemove', this.onmousemove.bind(this), false );
            document.addEventListener('mousedown', this.onmousedown.bind(this), false );
            document.addEventListener('mouseup', this.onmouseup.bind(this), false );
            document.addEventListener('keydown', this.onkeydown.bind(this), false );
            document.addEventListener('keyup', this.onkeyup.bind(this), false );

            this.pitchObject.add(camera);
            this.yawObject.add(this.pitchObject);
        }
        
        public set enabled(enabled: boolean) {
            this._enabled = enabled;
        }

        public get enabled(): boolean {
            return this._enabled;
        }
        

        onmousemove(event: MouseEvent) {
              
            if ( !this.enabled ) {
                return;
            }
            let movementX = event.movementX || 0;
            let movementY = event.movementY || 0;
            this.rotateCamera(movementX  * 0.002, movementY * 0.002);
        }

        rotateCamera(movementX:number, movementY:number) {
            this.yawObject.rotation.y -= movementX;
            this.pitchObject.rotation.x -= movementY;
            this.pitchObject.rotation.x = Math.max(-(Math.PI / 2), Math.min(Math.PI, this.pitchObject.rotation.x));
        }

        onmousedown(event: MouseEvent) {
            
            if (event.which == 3) {
                this.enabled = true;
                event.preventDefault();
            }
        }

        onmouseup(event: MouseEvent) {
            if (event.which == 3) {
                this.enabled = false;
                event.preventDefault();
            }
        }
        
        onkeydown(event: KeyboardEvent) {
            switch(event.keyCode) {
                case 87:
                    this.cameraSpeedVectorW.x = -this.CAMERA_SPEED * Math.sin(this.yawObject.rotation.y);
                    this.cameraSpeedVectorW.y = this.CAMERA_SPEED * Math.sin(this.pitchObject.rotation.x);
                    this.cameraSpeedVectorW.z = -this.CAMERA_SPEED * Math.cos(this.yawObject.rotation.y);
                    break;
                case 83:
                    this.cameraSpeedVectorS.x = this.CAMERA_SPEED * Math.sin(this.yawObject.rotation.y);
                    this.cameraSpeedVectorW.y = -this.CAMERA_SPEED * Math.sin(this.pitchObject.rotation.x);
                    this.cameraSpeedVectorS.z = this.CAMERA_SPEED * Math.cos(this.yawObject.rotation.y);
                    break;
                case 65:
                    this.cameraSpeedVectorA.x = -this.CAMERA_SPEED * Math.cos(this.yawObject.rotation.y);
                    this.cameraSpeedVectorA.z = this.CAMERA_SPEED * Math.sin(this.yawObject.rotation.y);
                    break;
                case 68:
                    this.cameraSpeedVectorD.x = this.CAMERA_SPEED * Math.cos(this.yawObject.rotation.y);
                    this.cameraSpeedVectorD.z = -this.CAMERA_SPEED * Math.sin(this.yawObject.rotation.y);
                    break;
                case 81:
                    this.cameraSpeedVectorQ.y = this.CAMERA_SPEED;
                    break;
                case 69:
                    this.cameraSpeedVectorE.y = -this.CAMERA_SPEED;
                    break;
            }
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorW);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorA);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorS);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorD);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorQ);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorE);
            this.yawObject.position.add(this.cameraSpeedVector);
            this.cameraSpeedVector = new Vector3( 0, 0, 0 );
        }
        
        onkeyup(event: KeyboardEvent) {
        //87 - W, 65 - A, 83 - S, 68 -D, 81 - Q, 69 - E
            switch(event.keyCode) {
                case 87:
                    this.cameraSpeedVectorW = new Vector3( 0, 0, 0 );
                    break;
                case 83:
                    this.cameraSpeedVectorS = new Vector3( 0, 0, 0 );
                    break;
                case 65:
                    this.cameraSpeedVectorA = new Vector3( 0, 0, 0 );
                    break;
                case 68:
                    this.cameraSpeedVectorD = new Vector3( 0, 0, 0 );
                    break;
                case 81:
                    this.cameraSpeedVectorQ = new Vector3( 0, 0, 0 );
                    break;
                case 69:
                    this.cameraSpeedVectorE = new Vector3( 0, 0, 0 );
                    break;
            }
        }
        
        public get yawObject(): Object3D {
            return  this._yawObject;
        }
        
        public get pitchObject(): Object3D {
            return this._pitchObject;
        }

        getDirection() {
            let direction = new Vector3(0, 0, -1);
            let rotation = new Euler(0, 0, 0, "YXZ");
        }

        public updateCamera(delta:number): void {
            if (this.animationProgress < 1) {



                this.animationProgress = Math.min(1, this.animationProgress + delta / this.animationLength);

                this.animate(delta);
            }
            this.pitchObject.updateMatrixWorld(false)
            this.yawObject.updateMatrixWorld(false);
            this.camera.updateMatrixWorld(false)
            this.camera.updateProjectionMatrix();
        }
        
        public loadViewpoint(x: number, y: number, z: number, yaw: number, pitch: number): void{
            this.animation.destinationPosition.set(x, y, z);
            this.animation.destinationRotation = new Vector3(pitch, yaw, 0);
            this.animation.sourcePosition = this.yawObject.position.clone();
            this.animation.sourceRotation = new Vector3(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);
            this.animationProgress = 0;
            // updates the view without animation, add an option for that
                // this.yawObject.position.set(x, y, z);
                // this.yawObject.rotation.y = yaw;
                // this.pitchObject.rotation.x = pitch;
                // this.updateCamera(0);
        }

        public animate(delta: number): void {
            let cameraSpeedVectorAnimation = this.animatorPosition(
                this.animation.sourcePosition, 
                this.animation.destinationPosition, 
                this.animationProgress,
                delta/this.animationLength
            );
            this.cameraSpeedVector = this.cameraSpeedVector.add(cameraSpeedVectorAnimation);
            this.yawObject.position.add(this.cameraSpeedVector);
            this.cameraSpeedVector.sub(cameraSpeedVectorAnimation);
            let rotationVector = this.animatorRotation(
                this.animation.sourceRotation, 
                this.animation.destinationRotation, 
                this.animationProgress,
                delta/this.animationLength
            )
            this.rotateCamera(-rotationVector.y, -rotationVector.x)
        }

        public animatorPosition: (start: Vector3, end: Vector3, progress: number, delta: number) => Vector3 = (start, end, progress, delta) => {
            let finalVector = start.clone().multiplyScalar(1 - progress).add(end.clone().multiplyScalar(progress));
            let startingVector = start.clone().multiplyScalar(1 - (progress - delta)).add(end.clone().multiplyScalar(progress - delta));
            let newSpeedVector = finalVector.sub(startingVector);
            return newSpeedVector;
        }; 
        
        public animatorRotation: (start: Vector3, end: Vector3, progress: number, delta: number) => Vector3 = (start, end, progress, delta) => {
            let finalVector = start.clone().multiplyScalar(1 - progress).add(end.clone().multiplyScalar(progress));
            let startingVector = start.clone().multiplyScalar(1 - (progress - delta)).add(end.clone().multiplyScalar(progress - delta));
            let newRotationVector = finalVector.sub(startingVector);
            return newRotationVector;
            //HAS TO RETURN VECTOR THAT IS ACTUALLY THE CHANGE FROM THE PREVIOUS VECTOR
        };
}
