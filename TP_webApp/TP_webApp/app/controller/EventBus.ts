import { GLContext } from "../view/GLContext";
import { Lifeline } from "../model/Lifeline";
import { Raycaster, Vector2, Scene, Camera } from 'three';
import { DiagramView } from "../view/DiagramView";
import { Diagram } from "../model/Diagram";
import { Layer } from "../model/Layer";
import { LayoutControl } from "./LayoutControl";
import { CustomMesh } from "../view/CustomMesh";
import { State } from "./State";
import { Message } from "../model/Message";

export class EventBus {

    public constructor(
        private _canvas: HTMLCanvasElement
    ) {
        this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    private _sendMouseDown: boolean = false;
    private _sendMouseUp: boolean = false;
    private _sendMouseMovement: boolean = false;

    public get sendMouseDown() {
        return this._sendMouseDown;
    }

    public get sendMouseUp() {
        return this._sendMouseUp;
    }

    public get sendMouseMovement() {
        return this._sendMouseMovement;
    }

    public handleMouseMove(event: MouseEvent) {
        if (this.sendMouseMovement) {

        }
    }

    // To do refactor
    private _intersection:any = null;



    public handleMouseDown(event: MouseEvent) {
        if (this.sendMouseDown) {

        }
        
        switch (event.which) {
            case 1:
                
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_lifeline" ){
                    console.log("fuck")
                    let raycaster = new Raycaster();
                    let vector2 = new Vector2(0,0)
                    vector2.x =   ( event.clientX / window.innerWidth ) * 2 - 1;
                    vector2.y = - ( event.clientX / window.innerWidth ) * 2 + 1;
                    raycaster.setFromCamera(vector2,GLContext.instance.camera);
                    let layersinDiagram = GLContext.instance.scene.children[0].children;
                    this._intersection = raycaster.intersectObjects(layersinDiagram);
                    let lifelineNew = new Lifeline('Standard name','',[]);
                    (this._intersection[0].object as CustomMesh).metadata.parent.parent.AddLifeline(lifelineNew);
                    LayoutControl.magic((window as any).diag);
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(((window as any).diag as Diagram).diagramView);
                    GLContext.instance.stateMachine.changeState = new State("NEUTRAL");
                    
                    
                    
                }
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" ){
                    let raycaster = new Raycaster();
                    let vector2 = new Vector2(0,0)
                    vector2.x =   ( event.clientX / window.innerWidth ) * 2 - 1;
                    vector2.y = - ( event.clientX / window.innerWidth ) * 2 + 1;
                    raycaster.setFromCamera(vector2,GLContext.instance.camera);
                    let lifelinesinDiagram :any[]= [];
                    GLContext.instance.scene.children[0].children.forEach(element => {
                        element.children.forEach(element2 => {
                            lifelinesinDiagram.push(element2);
                        });
                    });
                  
                    this._intersection = raycaster.intersectObjects(lifelinesinDiagram);
                  

                }
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
        
    }

    
    public handleMouseUp(event: MouseEvent) {
        if (this.sendMouseUp) {

        }

        if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" && this._intersection !== null){
            let raycaster = new Raycaster();
            let vector2 = new Vector2(0,0)
            vector2.x =   ( event.clientX / window.innerWidth ) * 2 - 1;
            vector2.y = - ( event.clientX / window.innerWidth ) * 2 + 1;
            raycaster.setFromCamera(vector2,GLContext.instance.camera);
            let lifelinesinDiagram :any[]= [];
            GLContext.instance.scene.children[0].children.forEach(element => {
                element.children.forEach(element2 => {
                    lifelinesinDiagram.push(element2);
                });
            });
            let endIntersection = raycaster.intersectObjects(lifelinesinDiagram);
            let newMessage = new Message("general Message",null,null,null,null);

            console.log((this._intersection[0].object as CustomMesh).metadata.parent.parent)
            

        }

    }

}