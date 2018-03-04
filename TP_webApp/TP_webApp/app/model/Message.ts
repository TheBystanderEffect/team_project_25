import { LayerElement } from "./LayerElement";
import { MessageOccurenceSpecification } from "./OccurenceSpecification";

export enum MessageKind {
    SYNC_CALL = "SYNC_CALL",
    ASYNC_CALL = "ASYNC_CALL",
    RETURN = "RETURN"
}

export abstract class Message extends LayerElement {

    public abstract get name(): string;
    public abstract set name(name: string);

    public abstract get kind(): MessageKind;
    public abstract set kind(kind: MessageKind);

    public abstract get start(): MessageOccurenceSpecification;
    public abstract set start(start: MessageOccurenceSpecification);

    public abstract get end(): MessageOccurenceSpecification;
    public abstract set end(end: MessageOccurenceSpecification);

}

export class RefMessage extends Message {

    protected __message: StoredMessage;

    public get message(): StoredMessage {
        return this.__message;
    }

    public set message(message: StoredMessage) {
        this.__message = message;
    }

    public get name(): string {
        return this.message.name;
    }

    public set name(name: string) {
        this.message.name = name;
    }

    public get kind(): MessageKind {
        return this.message.kind;
    }

    public set kind(kind: MessageKind) {
        this.message.kind = kind;
    }

    public get start(): MessageOccurenceSpecification {
        return this.message.start;
    }

    public set start(start: MessageOccurenceSpecification) {
        this.message.start = start;
    }

    public get end(): MessageOccurenceSpecification {
        return this.message.end;
    }

    public set end(end: MessageOccurenceSpecification) {
        this.message.end = end;
    }

    public toJSON(): any {
        return {
            layer: this.message.diagram.layers.indexOf(this.message.layer),
            message: this.message.layer.messages.indexOf(this.message)
        };
    }
}

export class StoredMessage extends Message {

    protected _name: string;
    protected _kind: MessageKind;
    protected _start: MessageOccurenceSpecification;
    protected _end: MessageOccurenceSpecification;

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get kind(): MessageKind {
        return this._kind;
    }

    public set kind(kind: MessageKind) {
        this._kind = kind;
    }

    public get start(): MessageOccurenceSpecification {
        return this._start;
    }

    public set start(start: MessageOccurenceSpecification) {
        this._start = start;
    }

    public get end(): MessageOccurenceSpecification {
        return this._end;
    }

    public set end(end: MessageOccurenceSpecification) {
        this._end = end;
    }

}