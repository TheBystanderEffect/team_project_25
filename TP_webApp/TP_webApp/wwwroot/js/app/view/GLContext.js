import { CameraControls } from "./CameraControls";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import * as Config from "../config";
import { StateMachine } from "../controller/StateMachine";
import { stateNeutral } from "../controller/StateMachineBuilder";
import { initializeStateTransitions } from "../controller/StateMachineInitializer";
import { EventType } from "../controller/EventBus";
import * as Globals from "../globals";
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
        this.lastLoopStart = Date.now();
        requestAnimationFrame(this.renderLoop.bind(this));
    }
    renderLoop() {
        let loopStart = Date.now();
        let frameDelay = 16;
        let delta = (loopStart - this.lastLoopStart) / 1000;
        // execute rendering and scene interaction
        if (!this.renderPaused) {
            this.cameraControls.updateCamera();
            this.stateMachine.acceptEvent(null, EventType.SCENE_UPDATE);
            this.renderer.render(this.scene, this.camera);
            Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement.update(delta);
        }
        let loopTime = Date.now() - loopStart;
        this.lastLoopStart = loopStart;
        if ((frameDelay - loopTime) > 0) {
            setTimeout(frameDelay - loopTime, requestAnimationFrame(this.renderLoop.bind(this)));
        }
        else {
            requestAnimationFrame(this.renderLoop.bind(this));
        }
    }
}
// singleton impl
GLContext._instance = new GLContext();
//# sourceMappingURL=GLContext.js.map