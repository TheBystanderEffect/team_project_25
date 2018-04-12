import { Layer } from "./Layer";
import { Diagram } from "./Diagram";
import { StoredMessage, MessageKind } from "./Message";
import { Lifeline } from "./Lifeline";
import { MessageOccurenceSpecification } from "./OccurenceSpecification";


export class ElementUtil {

    private static _instance: ElementUtil = new ElementUtil();
    private constructor(){}
    public static get instance(): ElementUtil {
        return ElementUtil._instance;
    }

    public createLayer(diagram: Diagram, index: number): Layer {
        let layer = new Layer();

        layer.diagram = diagram;
        diagram.layers.splice(index, 0, layer);

        return layer;
    }

    public createLifeline(name: string, layer: Layer, index: number): Lifeline {
        let lifeline = new Lifeline();
        lifeline.name = name;
        lifeline.diagram = layer.diagram;
        lifeline.layer = layer;
        layer.lifelines.splice(index, 0, lifeline);

        return lifeline;
    }

    public createMessage(name: string, kind: MessageKind, start: Lifeline, end: Lifeline, startIndex: number, endIndex: number): StoredMessage {
        let msg = new StoredMessage();

        msg.diagram = start.diagram;
        msg.name = name;
        msg.kind = kind;
        msg.start = new MessageOccurenceSpecification();
        msg.end = new MessageOccurenceSpecification();

        msg.start.message = msg;
        msg.start.diagram = start.diagram;
        msg.start.layer = start.layer;
        msg.start.lifeline = start;

        msg.end.message = msg;
        msg.end.diagram = end.diagram;
        msg.end.layer = end.layer;
        msg.end.lifeline = end;

        start.occurenceSpecifications.splice(startIndex, 0, msg.start);
        end.occurenceSpecifications.splice(endIndex, 0, msg.end);

        if (start.layer == end.layer) {
            // 2D
            msg.layer = start.layer;
            msg.layer.messages.push(msg);
            console.warn("Until occurence based message rendering is used, the message array needs to be sorted after adding a message");
        } else {
            // 3D
            // TODO
        }

        return msg;
    }

    public deleteLifeline(lifeline: Lifeline) {

    }

}