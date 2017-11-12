import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {MessageView} from "../view/MessageView"
import {TextView} from "../view/TextView"
import {Geometry} from "three"
import {firstLayerOffset,layerOffset,layerWidth,layerHeight,firstLifelineOffsetX,
        lifelineOffsetX,lifelineOffsetY,lifelineTextSize,firstMessageOffset,
        messageOffset,messageTextSize} from "../config"

export class LayoutControl{
 
    public static magic(diagram:Diagram){
        diagram.diagramView=new DiagramView(diagram);

        diagram.layers.forEach((layer, index) => {
            var templayerptr = new LayerView(
                    0,
                    0,
                    -firstLayerOffset - layerOffset*index,
                    layerWidth,
                    layerHeight
                );
            diagram.diagramView.add(templayerptr.mesh);

            layer.lifelines.forEach((lifeline, index) =>{
                var templifelineptr = new LifelineView(
                        templayerptr.source.x + firstLifelineOffsetX + lifelineOffsetX*index,
                        templayerptr.source.y - lifelineOffsetY,
                        0,
                        templayerptr.height-lifelineOffsetY
                    );
                lifeline.lifelineView=templifelineptr;
                templayerptr.mesh.add(templifelineptr.mesh);

                var tempTextPtr = new TextView( //TODO add offsets
                    templifelineptr.source.x-10,
                    templifelineptr.source.y+5,
                    templifelineptr.source.z,
                    lifeline.name,
                    lifelineTextSize
                );
                templayerptr.mesh.add(tempTextPtr.mesh);//TODO possibly tie to lifeline and not to layer

            });

            layer.messages.forEach((message,index)=>{
                var start = message.start.at.lifelineView.source;
                var end = message.end.at.lifelineView.source;
                var tempMessagePtr = new MessageView(
                        start.x,
                        start.y-firstMessageOffset-messageOffset*index,
                        0,
                        end.x,
                        end.y-firstMessageOffset-messageOffset*index,
                        0
                    );
                templayerptr.mesh.add(tempMessagePtr.mesh);
                
                //TODO lifeline lable creation
                var tempTextPtr = new TextView( //TODO add offsets and make it not retarded and dependant on mesh
                    tempMessagePtr.mesh.position.x-10,
                    tempMessagePtr.mesh.position.y+5,
                    tempMessagePtr.mesh.position.z,
                    message.name,
                    messageTextSize
                );
                templayerptr.mesh.add(tempTextPtr.mesh);//TODO resolve rotation inteligentlier

            });

        });

    }


}