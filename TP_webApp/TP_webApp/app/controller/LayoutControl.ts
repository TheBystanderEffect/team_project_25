import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {MessageView} from "../view/MessageView"
import {Geometry, Vector3} from "three"
import * as Config from "../config"

export class LayoutControl{
 
    public static magic(diagram:Diagram){
        // console.log("magic")
        if(!diagram.graphicElement) diagram.graphicElement=new DiagramView(diagram);

        diagram.layers.forEach((layer, index) => {
            //console.log("Layer:"+index);
            //TODO maybe make last offset min config thingie
            var dynamicLayerWidth = Config.firstLifelineOffsetX +
                (layer.lifelines.length - 1) * Config.lifelineOffsetX +
                Config.firstLifelineOffsetX;
            if(dynamicLayerWidth < Config.layerWidth){
                dynamicLayerWidth = Config.layerWidth;
            }

            var dynamicLayerHeight = Config.lifelineOffsetY + 
                Config.firstMessageOffset + 
                (layer.messages.length - 1) * Config.messageOffset
                +Config.firstMessageOffset;
            if(dynamicLayerHeight < Config.layerHeight){
                dynamicLayerHeight = Config.layerHeight;
            }

            if(!layer.graphicElement){
                diagram.graphicElement.add(new LayerView(layer)); 
                (layer.graphicElement as LayerView).updateLayout(dynamicLayerWidth,dynamicLayerHeight,index);
            }
            //console.log(diagram.diagramView.children[0]);
            (layer.graphicElement as LayerView).updateLayout(dynamicLayerWidth,dynamicLayerHeight,index);
            //console.log(diagram.diagramView.children[0]);
            
            layer.lifelines.forEach((lifeline, index) => {
                //console.log("Lifeline:"+index);
                if(!lifeline.graphicElement) {
                    layer.graphicElement.add(new LifelineView(lifeline));
                    (lifeline.graphicElement as LifelineView).updateLayout(index);
                }else{
                    (lifeline.graphicElement as LifelineView).updateLayout(index);
                }
                
            });
            //console.log("Lifelines done");
            layer.messages.forEach((message,index) => {
                //console.log("message:"+index);
                if(!message.graphicElement){
                    layer.graphicElement.add(new MessageView(message));
                }
                (message.graphicElement as MessageView).updateLayout(index);
            });
            //console.log("Messages done");
          
        });
        //console.log("Layers done");

    }


}