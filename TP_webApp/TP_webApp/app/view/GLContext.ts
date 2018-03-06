import {  CameraControls } from "./CameraControls";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import * as Config from "../config";
//import { RaycastControl } from "../controller/RaycastControl";
import { StateMachine } from "../controller/StateMachine";
import { State } from "../controller/State";
import { stateNeutral } from "../controller/StateMachineBuilder";
import { initializeStateTransitions } from "../controller/StateMachineInitializer";
import { EventType } from "../controller/EventBus";

export class GLContext {

    // singleton impl
    private static _instance: GLContext = new GLContext();

    public static get instance(): GLContext {
        return this._instance;
    }

    private constructor() {}

    // class impl
    private _scene: Scene = null;
    private _camera: PerspectiveCamera = null;
    private _renderer: WebGLRenderer = null;
    private _cameraControls: CameraControls = null;
    private _canvas: HTMLCanvasElement = null;
    private _stateMachine : StateMachine = null;


    private _renderPaused: boolean = false;

    public get cameraControls(): CameraControls {
        return  this._cameraControls;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get camera(): PerspectiveCamera {
        return this._camera;
    }

    public get renderer(): WebGLRenderer {
        return this._renderer;
    }
 
    public get renderPaused(): boolean {
        return this._renderPaused;
    }

    
    public get stateMachine() : StateMachine {
        return this._stateMachine;
    }

    
    public get canvas() : HTMLCanvasElement {
        return this._canvas;
    }
    
    

    public set renderPaused(renderPaused: boolean) {
        this._renderPaused = renderPaused;
    }

    public initializeScene(): void {

        this._canvas = document.getElementById(Config.canvasId) as HTMLCanvasElement

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
        this._stateMachine = new StateMachine(this._canvas,stateNeutral);
        initializeStateTransitions();
        
        // start rendering
        this.lastLoopStart = Date.now();
        requestAnimationFrame(this.renderLoop.bind(this));

    }

    private lastLoopStart: number;

    private renderLoop(): void {

        let loopStart = Date.now();
        let frameDelay = 16;
        let delta = (loopStart - this.lastLoopStart) / 1000;

        // execute rendering and scene interaction
        if (!this.renderPaused) {

            //RaycastControl.instance.cast(this.camera,this.scene);
            this.cameraControls.updateCamera();
            this.stateMachine.acceptEvent(null, EventType.SCENE_UPDATE);
            this.renderer.render(this.scene, this.camera);
        }

        let loopTime = Date.now() - loopStart;

        if ((frameDelay - loopTime) > 0) {
            setTimeout(frameDelay - loopTime, requestAnimationFrame(this.renderLoop.bind(this)));
        } else {
            requestAnimationFrame(this.renderLoop.bind(this));
        }
    }
}