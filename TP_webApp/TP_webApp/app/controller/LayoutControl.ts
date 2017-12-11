import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {MessageView} from "../view/MessageView"
import {TextView} from "../view/TextView"
import {Geometry} from "three"
import * as Config from "../config"

export class LayoutControl{
 
    public static magic(diagram:Diagram){
       
        diagram.diagramView=new DiagramView(diagram);

        diagram.layers.forEach((layer, index) => {

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

            var templayerptr = new LayerView(
                    layer,
                    0,
                    0,
                    -Config.firstLayerOffset - Config.layerOffset*index,
                    dynamicLayerWidth, //Config.layerWidth,
                    dynamicLayerHeight //Config.layerHeight
                );
            diagram.diagramView.add(templayerptr.mesh);
         
            layer.lifelines.forEach((lifeline, index) =>{
                var templifelineptr = new LifelineView(
                        lifeline,
                        templayerptr.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
                        templayerptr.source.y - Config.lifelineOffsetY,
                        0,
                        templayerptr.height-Config.lifelineOffsetY
                    );
                lifeline.lifelineView=templifelineptr;
                templayerptr.mesh.add(templifelineptr.mesh);

                var tempTextPtr = new TextView( //TODO add offsets
                    lifeline,
                    templifelineptr.source.x-10,
                    templifelineptr.source.y+5,
                    templifelineptr.source.z,
                    lifeline.name,
                    Config.lifelineTextSize
                );
                templayerptr.mesh.add(tempTextPtr.mesh);//TODO possibly tie to lifeline and not to layer

            });

            layer.messages.forEach((message,index)=>{
                var start = message.start.at.lifelineView.source;
                var end = message.end.at.lifelineView.source;
                var tempMessagePtr = new MessageView(
                        message,
                        start.x,
                        start.y-Config.firstMessageOffset-Config.messageOffset*index,
                        0,
                        end.x,
                        end.y-Config.firstMessageOffset-Config.messageOffset*index,
                        0
                    );
                
                message.messageView = tempMessagePtr;
                templayerptr.mesh.add(tempMessagePtr.mesh);
                
                //TODO lifeline lable creation
                var tempTextPtr = new TextView( //TODO add offsets and make it not retarded and dependant on mesh
                    message,
                    tempMessagePtr.mesh.position.x-10,
                    tempMessagePtr.mesh.position.y+5,
                    tempMessagePtr.mesh.position.z,
                    message.name,
                    Config.messageTextSize
                );
                templayerptr.mesh.add(tempTextPtr.mesh);//TODO resolve rotation inteligentlier

            });

        });

    }


}