import { PerspectiveCamera, Object3D, Vector3, Euler, Scene } from 'three';

export class CameraControls {

        camera: PerspectiveCamera;
        _pitchObject: Object3D = new Object3D();
        _yawObject: Object3D = new Object3D();
        _enabled: boolean = false;
        CAMERA_SPEED: number = 3.5;
        cameraSpeedVector: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorW: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorA: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorS: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorD: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorQ: Vector3 = new Vector3( 0, 0, 0 );
        cameraSpeedVectorE: Vector3 = new Vector3( 0, 0, 0 );

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
            this.yawObject.rotation.y -= movementX * 0.002;
            this.pitchObject.rotation.x -= movementY * 0.002;
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
            this.cameraSpeedVector = new Vector3( 0, 0, 0 );
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorW);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorA);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorS);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorD);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorQ);
            this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorE);
            this.pitchObject.position.add(this.cameraSpeedVector);
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

        public updateCamera(): void {
            this.yawObject.updateMatrixWorld(false);
            this.camera.updateProjectionMatrix();
        }
        
}