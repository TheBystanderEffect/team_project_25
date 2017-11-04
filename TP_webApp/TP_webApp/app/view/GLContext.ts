import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import * as Config from "../config";



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
    private _renderPaused: boolean = false;

    public get renderPaused(): boolean {
        return this._renderPaused;
    }

    public set renderPaused(renderPaused: boolean) {
        this._renderPaused = renderPaused;
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

    public initializeScene(): void {

        // initialize renderer
        this._renderer = new WebGLRenderer({
            canvas: document.getElementById(Config.canvasId) as HTMLCanvasElement,
            antialias: true
        });

        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // initialize camera
        this._camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);

        // initialize scene
        this._scene = new Scene();

        // start rendering
        requestAnimationFrame(this.renderLoop.bind(this));

    }

    private renderLoop(): void {

        // execute rendering and scene interaction
        if (!this.renderPaused) {

            this.renderer.render(this.scene, this.camera);
        }

        // queue next frame
        requestAnimationFrame(this.renderLoop.bind(this));
    }
}