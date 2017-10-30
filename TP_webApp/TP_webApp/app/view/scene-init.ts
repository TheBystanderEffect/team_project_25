import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import { CameraControls } from '../model/CameraControls';
import { RaycasterControl } from '../controler/RaycastControl'

export function initializeScene(): Scene {

    let renderer: WebGLRenderer = new WebGLRenderer({
        canvas: document.getElementById("webglCanvas") as HTMLCanvasElement,
        antialias: true
    });

    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    let camera: PerspectiveCamera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
    let scene: Scene = new Scene();
    let cameraControls: CameraControls = new CameraControls(camera);
    scene.add(cameraControls.yawObject);
    console.log("test camera")
    console.log(camera);
    console.log("cameracontrols")
    console.log(cameraControls.camera);

    renderer.render(scene,camera);
    requestAnimationFrame(render);

    function render(): void {
        RaycasterControl.instance.cast(camera,scene);
        camera.updateProjectionMatrix();
        renderer.render(scene,camera);
        requestAnimationFrame(render);
    }

    return scene;
}