import { Message, sorts, kinds } from "./Message";
import { OccurenceSpecification } from "./OccurenceSpecification";
import { Layer } from "./Layer";
import { GraphicElement } from "../view/GraphicElement";

export class RefMessage extends Message {

    private message: Message;

    private layerIndex: number;
    private messageIndex: number;

    public get name(): string {
        return this.message._name;
    }

    public set name(name: string) {
        this.message._name = name;
    }

    public get sort(): sorts {
        return this.message._sort;
    }

    public set sort(sort: sorts) {
        this.message._sort = sort;
    }

    public get kind(): kinds {
        return this.message._kind;
    }

    public set kind(kind: kinds) {
        this.message._kind = kind;
    }

    public get start(): OccurenceSpecification {
        return this.message._start;
    }

    public set start(start: OccurenceSpecification) {
        this.message._start = start;
    }

    public get end(): OccurenceSpecification {
        return this.message._end;
    }

    public set end(end: OccurenceSpecification) {
        this.message._end = end;
    }

    public get parentLayer(): Layer {
        return this.start.at.layer;
    }

    public get graphicElement(): GraphicElement {
        return this.message.graphicElement;
    }

    public set graphicElement(graphicElement: GraphicElement) {
        this.message.graphicElement = graphicElement;
    }

    constructor(message: Message) {
        super(null, null, null, null, null);
        this.message = message;
    }

}
