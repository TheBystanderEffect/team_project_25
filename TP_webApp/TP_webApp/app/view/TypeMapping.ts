import { Diagram } from "../model/Diagram";
import { DiagramView } from "./DiagramView";
import { Layer } from "../model/Layer";
import { LayerView } from "./LayerView";
import { Message } from "../model/Message";
import { MessageView } from "./MessageView";
import { BusinessElement } from "../model/BusinessElement";

export const ViewMap: any[][] = [
    [ Diagram, (businessElement: BusinessElement) => { return new DiagramView(businessElement as Diagram); } ],
    [ Layer, (businessElement: BusinessElement) => { return new LayerView(businessElement as Layer); } ],
    [ Message, (businessElement: BusinessElement) => { return new MessageView(businessElement as Message); } ]
];