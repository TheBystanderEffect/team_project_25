import { CameraControls } from "./CameraControls";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import * as Config from "../config";
//import { RaycastControl } from "../controller/RaycastControl";
import { StateMachine } from "../controller/StateMachine";
import { stateNeutral } from "../controller/StateMachineBuilder";
import { initializeStateTransitions } from "../controller/StateMachineInitializer";
export class GLContext {
    constructor() {
        // class impl
        this._scene = null;
        this._camera = null;
        this._renderer = null;
        this._cameraControls = null;
        this._canvas = null;
        this._stateMachine = null;
        this._renderPaused = false;
    }
    static get instance() {
        return this._instance;
    }
    get cameraControls() {
        return this._cameraControls;
    }
    get scene() {
        return this._scene;
    }
    get camera() {
        return this._camera;
    }
    get renderer() {
        return this._renderer;
    }
    get renderPaused() {
        return this._renderPaused;
    }
    get stateMachine() {
        return this._stateMachine;
    }
    get canvas() {
        return this._canvas;
    }
    set renderPaused(renderPaused) {
        this._renderPaused = renderPaused;
    }
    initializeScene() {
        this._canvas = document.getElementById(Config.canvasId);
        // initialize renderer
        this._renderer = new WebGLRenderer({
            canvas: this._canvas,
            antialias: true
        });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // initialize camera
        this._camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
        // initialize scene
        this._scene = new Scene();
        // initialize camera controls
        this._cameraControls = new CameraControls(this.camera);
        // initialize state machine
        this._stateMachine = new StateMachine(this._canvas, stateNeutral);
        initializeStateTransitions();
        // start rendering
        requestAnimationFrame(this.renderLoop.bind(this));
    }
    renderLoop() {
        // execute rendering and scene interaction
        if (!this.renderPaused) {
            //RaycastControl.instance.cast(this.camera,this.scene);
            this.cameraControls.updateCamera();
            this.renderer.render(this.scene, this.camera);
        }
        // queue next frame
        requestAnimationFrame(this.renderLoop.bind(this));
    }
}
// singleton impl
GLContext._instance = new GLContext();
//# sourceMappingURL=GLContext.js.map