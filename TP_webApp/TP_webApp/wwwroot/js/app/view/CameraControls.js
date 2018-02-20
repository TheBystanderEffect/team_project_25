import { Object3D, Vector3, Euler } from 'three';
import { Serializer } from '../controller/Serializer';
export class CameraControls {
    constructor(camera) {
        this._pitchObject = new Object3D();
        this._yawObject = new Object3D();
        this._enabled = false;
        this.CAMERA_SPEED = 3.5;
        this.cameraSpeedVector = new Vector3(0, 0, 0);
        this.cameraSpeedVectorW = new Vector3(0, 0, 0);
        this.cameraSpeedVectorA = new Vector3(0, 0, 0);
        this.cameraSpeedVectorS = new Vector3(0, 0, 0);
        this.cameraSpeedVectorD = new Vector3(0, 0, 0);
        this.cameraSpeedVectorQ = new Vector3(0, 0, 0);
        this.cameraSpeedVectorE = new Vector3(0, 0, 0);
        this.camera = camera;
        document.addEventListener('mousemove', this.onmousemove.bind(this), false);
        document.addEventListener('mousedown', this.onmousedown.bind(this), false);
        document.addEventListener('mouseup', this.onmouseup.bind(this), false);
        document.addEventListener('keydown', this.onkeydown.bind(this), false);
        document.addEventListener('keyup', this.onkeyup.bind(this), false);
        this.pitchObject.add(camera);
        this.yawObject.add(this.pitchObject);
        Serializer.instance.serverTest();
    }
    set enabled(enabled) {
        this._enabled = enabled;
    }
    get enabled() {
        return this._enabled;
    }
    onmousemove(event) {
        if (!this.enabled) {
            return;
        }
        let movementX = event.movementX || 0;
        let movementY = event.movementY || 0;
        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;
        this.pitchObject.rotation.x = Math.max(-(Math.PI / 2), Math.min(Math.PI, this.pitchObject.rotation.x));
    }
    onmousedown(event) {
        if (event.which == 3) {
            this.enabled = true;
            event.preventDefault();
        }
    }
    onmouseup(event) {
        if (event.which == 3) {
            this.enabled = false;
            event.preventDefault();
        }
    }
    onkeydown(event) {
        switch (event.keyCode) {
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
        this.cameraSpeedVector = new Vector3(0, 0, 0);
        this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorW);
        this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorA);
        this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorS);
        this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorD);
        this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorQ);
        this.cameraSpeedVector = this.cameraSpeedVector.add(this.cameraSpeedVectorE);
        this.yawObject.position.add(this.cameraSpeedVector);
    }
    onkeyup(event) {
        //87 - W, 65 - A, 83 - S, 68 -D, 81 - Q, 69 - E
        switch (event.keyCode) {
            case 87:
                this.cameraSpeedVectorW = new Vector3(0, 0, 0);
                break;
            case 83:
                this.cameraSpeedVectorS = new Vector3(0, 0, 0);
                break;
            case 65:
                this.cameraSpeedVectorA = new Vector3(0, 0, 0);
                break;
            case 68:
                this.cameraSpeedVectorD = new Vector3(0, 0, 0);
                break;
            case 81:
                this.cameraSpeedVectorQ = new Vector3(0, 0, 0);
                break;
            case 69:
                this.cameraSpeedVectorE = new Vector3(0, 0, 0);
                break;
        }
    }
    get yawObject() {
        return this._yawObject;
    }
    get pitchObject() {
        return this._pitchObject;
    }
    getDirection() {
        let direction = new Vector3(0, 0, -1);
        let rotation = new Euler(0, 0, 0, "YXZ");
    }
    updateCamera() {
        this.pitchObject.updateMatrixWorld(false);
        this.yawObject.updateMatrixWorld(false);
        this.camera.updateMatrixWorld(false);
        this.camera.updateProjectionMatrix();
    }
    loadViewpoint(x, y, z, yaw, pitch) {
        console.log("X:" + x + " Y:" + y + " Z:" + z + " Yaw:" + yaw + " Pitch:" + pitch + " YawObject:" + this.yawObject + " PitchObject:" + this.pitchObject);
        this.yawObject.position.set(x, y, z);
        this.yawObject.rotation.y = yaw;
        this.pitchObject.rotation.x = pitch;
        this.updateCamera();
    }
}
//# sourceMappingURL=CameraControls.js.map