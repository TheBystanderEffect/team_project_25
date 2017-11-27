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
import { OccurenceSpecification } from "../model/OccurenceSpecification";
import { RaycastControl } from "./RaycastControl"

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
    private _intersection:Array<CustomMesh> = null;
    private holdMyLifeline: any = null;


    public handleMouseDown(event: MouseEvent) {
        if(event.which==1){
            console.log('raycast debug')
            RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event)
            console.log('end raycast debug')
        }
        if (this.sendMouseDown) {

        }
        
        switch (event.which) {
            case 1:
                
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_lifeline" ){
                    console.log("fuck")
                    this._intersection = RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event);
                    
                    // let raycaster = new Raycaster();
                    // let vector2 = new Vector2(0,0)
                    // vector2.x =   ( event.offsetX / window.innerWidth ) * 2 - 1;
                    // vector2.y = - ( event.offsetY / window.innerHeight ) * 2 + 1;
                    // raycaster.setFromCamera(vector2,GLContext.instance.camera);
                    // let layersinDiagram = GLContext.instance.scene.children[0].children;
                    // this._intersection = raycaster.intersectObjects(layersinDiagram);
                    let lifelineNew = new Lifeline('Standard name','',[], (this._intersection[0]).metadata.parent.parent);
                    (this._intersection[0]).metadata.parent.parent.AddLifeline(lifelineNew);
                    LayoutControl.magic((window as any).diag);
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(((window as any).diag as Diagram).diagramView);
                    GLContext.instance.stateMachine.changeState = new State("NEUTRAL");
                    
                    
                    
                }
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" ){
                    this._intersection = RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event);
                    for(let element of this._intersection){
                        if(element.metadata.parent.parent instanceof Lifeline){
                            this.holdMyLifeline = element.metadata.parent.parent;
                            break;
                        }
                    }
                    
                    // let raycaster = new Raycaster();
                    // let vector2 = new Vector2(0,0)
                    // vector2.x =   ( event.offsetX / window.innerWidth ) * 2 - 1;
                    // vector2.y = - ( event.offsetY / window.innerHeight ) * 2 + 1;
                    // raycaster.setFromCamera(vector2,GLContext.instance.camera);
                    // let lifelinesinDiagram :any[]= [];
                    // GLContext.instance.scene.children[0].children.forEach(element => {
                    //     element.children.forEach(element2 => {
                    //         lifelinesinDiagram.push(element2);
                    //     });
                    // });
                  
                    // this._intersection = raycaster.intersectObjects(lifelinesinDiagram);
                    // console.log((this._intersection[0].object as CustomMesh).metadata.parent.parent);

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
        console.log("begin");
        if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_Message" && this.holdMyLifeline !== null){
            this._intersection = RaycastControl.instance.cast(GLContext.instance.camera,GLContext.instance.scene,event);
            for(let element of this._intersection){
                if(element.metadata.parent.parent instanceof Lifeline){
                    let newMessage = new Message("general Message",null,null,new OccurenceSpecification(this.holdMyLifeline,null),new OccurenceSpecification(element.metadata.parent.parent,null));
                    this.holdMyLifeline.layer.AddMessage(newMessage);
                    newMessage.start.message = newMessage;
                    newMessage.end.message = newMessage;
                    console.log("Message created");

                    LayoutControl.magic((window as any).diag);
                    console.log("after magic");
                    GLContext.instance.scene.children = [];
                    GLContext.instance.scene.add(((window as any).diag as Diagram).diagramView);
                    console.log("finish");
                    GLContext.instance.stateMachine.changeState = new State("NEUTRAL");
                    
                    break;
                }
            }
            this.holdMyLifeline = null;
            // let raycaster = new Raycaster();
            // let vector2 = new Vector2(0,0)
            // vector2.x =   ( event.offsetX / window.innerWidth ) * 2 - 1;
            // vector2.y = - ( event.offsetY / window.innerWidth ) * 2 + 1;
            // raycaster.setFromCamera(vector2,GLContext.instance.camera);
            // let lifelinesinDiagram :any[]= [];
            // GLContext.instance.scene.children[0].children.forEach(element => {
            //     element.children.forEach(element2 => {
            //         lifelinesinDiagram.push(element2);
            //     });
            // });
            // console.log("before raycast");
            // let endIntersection = raycaster.intersectObjects(lifelinesinDiagram);
            // console.log("after raycast");
            // console.log("begin Message creation");
            //let newMessage = new Message("general Message",null,null,new OccurenceSpecification((this._intersection[0].object as CustomMesh).metadata.parent.parent,null),new OccurenceSpecification((endIntersection[0].object as CustomMesh).metadata.parent.parent,null));
            
            // console.log('start intersection');
            // console.log(this._intersection);
            // console.log('end intersection');
            // console.log(endIntersection);
           
            // (this._intersection[0].object as CustomMesh).metadata.parent.parent.layer.AddMessage(newMessage);
            // newMessage.start.message = newMessage;
            // newMessage.end.message = newMessage;
            // console.log("end of Message creation");

            // LayoutControl.magic((window as any).diag);
            // console.log("after magic");
            // GLContext.instance.scene.children = [];
            // GLContext.instance.scene.add(((window as any).diag as Diagram).diagramView);
            // console.log("finish");
            // GLContext.instance.stateMachine.changeState = new State("NEUTRAL");
        }

    }

}