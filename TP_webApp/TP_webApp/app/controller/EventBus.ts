export class EventBus {

    public constructor(
        private _canvas: HTMLCanvasElement
    ) {}

    public handleMouseMove(event: MouseEvent) {

    }

    public handleMouseDown(event: MouseEvent) {

    }

    public handleMouseUp(event: MouseEvent) {

    }

    public initializeEvents(){
        this._canvas.addEventListener('mousemove',this.handleMouseMove,false);
        this._canvas.addEventListener('mousedown',this.handleMouseDown,false);
        this._canvas.addEventListener('mouseup',this.handleMouseUp,false);
    }

}