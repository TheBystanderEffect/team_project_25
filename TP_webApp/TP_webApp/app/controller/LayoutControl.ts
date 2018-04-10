import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {MessageView} from "../view/MessageView"
import {Geometry, Vector3} from "three"
import * as Config from "../config"

export class LayoutControl{
 
    public static layout(diagram:Diagram){

        if(!diagram.graphicElement) diagram.graphicElement=new DiagramView(diagram);

        diagram.layers.forEach((layer, index) => {
            if(!layer.graphicElement){
                diagram.graphicElement.add(new LayerView(layer));
            }
            layer.graphicElement.updateLayout(index);
            
            layer.lifelines.forEach((lifeline, index) => {
                if(!lifeline.graphicElement) {
                    layer.graphicElement.add(new LifelineView(lifeline));
                }
                lifeline.graphicElement.updateLayout(index);
            });
            
            layer.messages.forEach((message,index) => {
                if(!message.graphicElement){
                    layer.graphicElement.add(new MessageView(message));
                }
                message.graphicElement.updateLayout(index);
            });
        });
    }
}