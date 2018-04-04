import { LayerElement } from "./LayerElement";
export var MessageKind;
(function (MessageKind) {
    MessageKind["SYNC_CALL"] = "SYNC_CALL";
    MessageKind["ASYNC_CALL"] = "ASYNC_CALL";
    MessageKind["RETURN"] = "RETURN";
})(MessageKind || (MessageKind = {}));
export class Message extends LayerElement {
}
export class RefMessage extends Message {
    get message() {
        return this.__message;
    }
    set message(message) {
        this.__message = message;
    }
    get name() {
        return this.message.name;
    }
    set name(name) {
        this.message.name = name;
    }
    get kind() {
        return this.message.kind;
    }
    set kind(kind) {
        this.message.kind = kind;
    }
    get start() {
        return this.message.start;
    }
    set start(start) {
        this.message.start = start;
    }
    get end() {
        return this.message.end;
    }
    set end(end) {
        this.message.end = end;
    }
    toJSON() {
        return {
            layer: this.message.diagram.layers.indexOf(this.message.layer),
            message: this.message.layer.messages.indexOf(this.message)
        };
    }
}
export class StoredMessage extends Message {
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get kind() {
        return this._kind;
    }
    set kind(kind) {
        this._kind = kind;
    }
    get start() {
        return this._start;
    }
    set start(start) {
        this._start = start;
    }
    get end() {
        return this._end;
    }
    set end(end) {
        this._end = end;
    }
}
//# sourceMappingURL=Message.js.map