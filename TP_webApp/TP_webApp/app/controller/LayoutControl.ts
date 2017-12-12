import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {MessageView} from "../view/MessageView"
import {TextView} from "../view/TextView"
import {Geometry, Vector3} from "three"
import * as Config from "../config"

export class LayoutControl{
 
    public static magic(diagram:Diagram){
        // console.log("magic")
        if(!diagram.diagramView) diagram.diagramView=new DiagramView(diagram);

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
            if(!layer.graphicElement){
                var templayerptr = new LayerView(
                        layer,
                        0,
                        0,
                        -Config.firstLayerOffset - Config.layerOffset*index,
                        dynamicLayerWidth, //Config.layerWidth,
                        dynamicLayerHeight //Config.layerHeight
                    );
                diagram.diagramView.add(templayerptr);
                // console.log(layer);
            }else{templayerptr=layer.graphicElement as any 
                //to be moved to method of object, something like update
                templayerptr.mesh.scale.set(dynamicLayerWidth,dynamicLayerHeight,1);
                // console.log(templayerptr.mesh.scale)
                // console.log(templayerptr.mesh.children)
                // console.log(templayerptr.scale)
                templayerptr.width=dynamicLayerWidth;
                templayerptr.height=dynamicLayerHeight;
            }
            templayerptr.mesh.position.set(dynamicLayerWidth/2-Config.layerWidth/2,-dynamicLayerHeight/2+Config.layerHeight/2,0);

            layer.lifelines.forEach((lifeline, index) => {
                if(!lifeline.graphicElement) {
                    var tempTextPtr = new TextView( //TODO add offsets
                        lifeline,
                        -10,//templifelineptr.source.x-10,
                        5,//templifelineptr.source.y+5,
                        0,//templifelineptr.source.z,
                        lifeline.name,
                        Config.lifelineTextSize
                    );

                    var templifelineptr = new LifelineView(
                            lifeline,
                            templayerptr.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
                            templayerptr.source.y - Config.lifelineOffsetY,
                            0,
                            templayerptr.height-Config.lifelineOffsetY
                        );
                    templayerptr.add(templifelineptr);
                    templifelineptr.add(tempTextPtr);
                    // console.log(tempTextPtr);
                    //templayerptr.add(tempTextPtr.mesh);//TODO possibly tie to lifeline and not to layer
                } else {
                    // console.log("UPDATE");
                    templifelineptr = lifeline.graphicElement as any
                    templifelineptr.position.set(templayerptr.source.x + Config.firstLifelineOffsetX + Config.lifelineOffsetX*index,
                        templayerptr.source.y - Config.lifelineOffsetY,
                        0);
                //     templifelineptr.length = templayerptr.height-Config.lifelineOffsetY;
                //    // console.log(templifelineptr.scale)
                //     templifelineptr.mesh.scale.set(1,templifelineptr.length,1);
                //     //templifelineptr.center.set(templifelineptr.source.x,templifelineptr.source.y-templifelineptr.length/2,templifelineptr.source.z);// = templifelineptr.source;
                    templifelineptr.mesh.position.set(0, -templifelineptr.length/2, 0);
                //   //  console.log(templifelineptr.scale)
                    
                }  
                //console.log(templifelineptr.mesh.children)
            });

            layer.messages.forEach((message,index) => {
                if(!message.graphicElement){
                    var start = (message.start.at.graphicElement as LifelineView).source;
                    var end = (message.end.at.graphicElement as LifelineView).source;

                    var tempTextPtr = new TextView( //TODO add offsets and make it not retarded and dependant on mesh
                        message,
                        -10,
                        5,
                        0,
                        message.name,
                        Config.messageTextSize
                    );

                    var tempMessagePtr = new MessageView(
                            message,
                            start.x,
                            start.y - Config.firstMessageOffset - Config.messageOffset * index,
                            0,
                            end.x,
                            end.y - Config.firstMessageOffset - Config.messageOffset * index,
                            0
                        );
                    templayerptr.add(tempMessagePtr);
                    
                    //TODO lifeline lable creation
                    tempMessagePtr.add(tempTextPtr.mesh);//TODO resolve rotation inteligentlier
                }else{
                    tempMessagePtr = message.graphicElement as any;
                    var start = (message.start.at.graphicElement as LifelineView).source;
                    var end = (message.end.at.graphicElement as LifelineView).source;

                    console.log(start);
                    console.log(end);

                    tempMessagePtr.length = Math.sqrt(Math.pow(start.x-end.x,2)+Math.pow(start.y-end.y,2)+Math.pow(start.z-end.z,2));
                    tempMessagePtr.center = new Vector3(
                        (start.x + end.x)/2, 
                        start.y-Config.firstMessageOffset-Config.messageOffset*index,
                        (start.z + end.z)/2
                    );

                    tempMessagePtr.position.copy(tempMessagePtr.center);
                    tempMessagePtr.mesh.scale.setY(tempMessagePtr.length);

                }  
            });
          
        });

    }


}