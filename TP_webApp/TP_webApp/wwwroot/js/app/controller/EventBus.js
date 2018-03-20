export var EventType;
(function (EventType) {
    EventType["BUTTON"] = "BUTTON";
    EventType["MOUSE_DOWN"] = "MOUSE_DOWN";
    EventType["MOUSE_UP"] = "MOUSE_UP";
    EventType["MOUSE_MOVE"] = "MOUSE_MOVE";
    EventType["SCENE_UPDATE"] = "SCENE_UPDATE";
})(EventType || (EventType = {}));
export class EventBus {
    constructor(_canvas, _callback) {
        this._canvas = _canvas;
        this._callback = _callback;
        this._sendMouseDown = true;
        this._sendMouseUp = true;
        this._sendMouseMovement = true;
        this._sendButtonPressed = true;
        this._sendSceneUpdate = true;
        this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('click', this.handleButtonPressed.bind(this));
    }
    get sendMouseDown() {
        return this._sendMouseDown;
    }
    get sendMouseUp() {
        return this._sendMouseUp;
    }
    get sendMouseMovement() {
        return this._sendMouseMovement;
    }
    get sendButtonPressed() {
        return this._sendButtonPressed;
    }
    handleMouseMove(event) {
        if (this.sendMouseMovement) {
            this._callback(event, EventType.MOUSE_MOVE);
        }
    }
    handleMouseDown(event) {
        if (this.sendMouseDown) {
            this._callback(event, EventType.MOUSE_DOWN);
        }
    }
    handleMouseUp(event) {
        if (this.sendMouseUp) {
            this._callback(event, EventType.MOUSE_UP);
        }
    }
    handleButtonPressed(event) {
        if (this.handleButtonPressed) {
            this._callback(event, EventType.BUTTON);
        }
    }
    handleSceneUpdate(event) {
        if (this.handleSceneUpdate) {
            this._callback(event, EventType.SCENE_UPDATE);
        }
    }
}
//# sourceMappingURL=EventBus.js.map