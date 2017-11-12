import { GLContext } from "../view/GLContext";

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

    
    public handleMouseDown(event: MouseEvent) {
        if (this.sendMouseDown) {

        }
        
        switch (event.which) {
            case 1:
                
                if ( GLContext.instance.stateMachine.currentState.code == "MODIFYING_lifeline" ){
                    
                }
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
        
        console.log(event);
    }

    
    public handleMouseUp(event: MouseEvent) {
        if (this.sendMouseUp) {

        }
    }

}