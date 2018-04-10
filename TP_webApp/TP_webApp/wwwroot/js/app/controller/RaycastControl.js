import { Raycaster, Vector2 } from 'three';
import { GLContext } from "../view/GLContext"; //debuging
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
    }
    static simpleDefaultIntersect(event) {
        var mouse = new Vector2(((event.offsetX / window.innerWidth) * 2 - 1), (-(event.offsetY / window.innerHeight) * 2 + 1));
        RaycastControl.instance.getRaycaster().setFromCamera(mouse, GLContext.instance.camera);
        let castResult = RaycastControl.instance.getRaycaster().intersectObjects(GLContext.instance.scene.children, true);
        return castResult;
    }
    getRaycaster() {
        return this.raycaster;
    }
}
//# sourceMappingURL=RaycastControl.js.map