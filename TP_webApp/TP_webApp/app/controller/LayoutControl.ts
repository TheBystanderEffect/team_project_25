import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {MessageView} from "../view/MessageView"
import {FragmentView} from '../view/FragmentView'
import {Geometry, Vector3} from "three"
import * as Config from "../config"
import { MessageOccurenceSpecification, OccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
import { Message, StoredMessage } from "../model/Message";
import { CombinedFragment } from "../model/CombinedFragment";
import { InteractionOperand } from "../model/InteractionOperand";

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
            

            // console.log("Lifelines done")

            // layer.messages.forEach((message,index) => {
            //     // console.log("message:"+index);
            //     let flag = false;
            //     if(!message.graphicElement){
            //         flag = true;
            //         layer.graphicElement.add(new MessageView(message));
            //     }
            //     (message.graphicElement as MessageView).updateLayout(index);
            //     if (flag) {
            //         (message.graphicElement as MessageView).animationProgress = 0.99999999;
            //     }
            // });
            //console.log("Messages done");

            let occurenceArrays = layer.lifelines.map(e => [].concat(e.occurenceSpecifications));
            let offsetY = 0;
            let offsetX = 0;
            let minOffsetX = 0;
            let stack: { fragment: InteractionOperand, offsetY: number, offsetX: number }[] = [];

            // stack.push({
            //     fragment: null,
            //     offsetY: 0,
            //     offsetX: 0,
            // });

            while(occurenceArrays.map(e => e.length > 0).reduce((a,v) => a || v, false)){
                let inlineOccurences = occurenceArrays.map(e => e[0]);
                // console.log(inlineOccurences);
                
                let occurencesToDelete:OccurenceSpecification [] = [];
                
                for(let occ of inlineOccurences){
                    if (occ instanceof MessageOccurenceSpecification){
                        
                        if(inlineOccurences.find(e => e == occ.message.start) != null){
                            if(inlineOccurences.find(e => e == occ.message.end) != null){
                                //found message to draw
                                let flag = false;
                                if(!occ.message.graphicElement){
                                    layer.graphicElement.add(new MessageView(occ.message));
                                }
                                occ.message.graphicElement.updateLayout(offsetY);
                                offsetY++;

                                occurencesToDelete.push(occ.message.start);
                                occurencesToDelete.push(occ.message.end);
                                // console.log("Found message ", occ.message.name);
                                break;
                            }
                        }
                        
                    } else {
                        if (occ instanceof OperandOccurenceSpecification){

                            let flag = false;
                            let fragToDraw;

                            if(occ.endsOperand){
                                occurencesToDelete = occurencesToDelete.concat(inlineOccurences.filter(e => e.endsOperand == occ.endsOperand));
                                
                                if(occurencesToDelete.length == occ.endsOperand.endingOccurences.length){
                                    // console.log("Found interaction operand ending"); 
                                    
                                    offsetX++;
                                    // offsetY++;
                                                                        
                                    fragToDraw = stack.pop();
                                    // console.log(fragToDraw);

                                    if(!fragToDraw.fragment.graphicElement){
                                        flag = true;
                                        layer.graphicElement.add(new FragmentView(fragToDraw.fragment));
                                    }
                                    (fragToDraw.fragment.graphicElement as FragmentView).updateLayout(fragToDraw.offsetY, offsetY, fragToDraw.offsetX-minOffsetX);
                                    if(flag){
                                        (fragToDraw.fragment.graphicElement as FragmentView).animationProgress = 0.99999999;
                                    }
                                    
                                    flag = true;
                                } else {
                                    occurencesToDelete = [];
                                }
                            }

                            if(occ.startsOperand){

                                let addedOccurences = 0;
                                if(flag){
                                    addedOccurences = occurencesToDelete.length;
                                }
                                occurencesToDelete = occurencesToDelete.concat(inlineOccurences.filter(e => e.startsOperand == occ.startsOperand));

                                if(occurencesToDelete.length == occ.startsOperand.startingOccurences.length + addedOccurences){
                                    // console.log("Found interaction operand starting");
                                    
                                    stack.push({
                                        fragment: occ.startsOperand,
                                        offsetY: offsetY,
                                        offsetX: offsetX,
                                    });
                                    
                                    offsetX--;
                                    // offsetY++;

                                    flag = true;
                                } else {
                                    occurencesToDelete = [];
                                }
                            }

                            if(fragToDraw){
                                if(minOffsetX > fragToDraw.offsetX){
                                    minOffsetX = fragToDraw.offsetX;
                                }
                            }
                            
                            if(flag){
                                if(fragToDraw){
                                    if (stack.length == 0){
                                        if(fragToDraw.offsetX == 0){
                                            minOffsetX = 0;
                                        }
                                        // debugger;
                                    }
                                    // console.log("FRAG OFFSET >>>", fragToDraw.offsetX);
                                    // console.log("MINI OFFSET >>>", minOffsetX);
                                }
                                offsetY++;
                                break;
                            }
                        }
                    }
                }

                for(let toDelete of occurencesToDelete){
                    for(let lifelineOcc of occurenceArrays) {
                        if (toDelete == lifelineOcc[0]){
                            lifelineOcc.shift();
                            break;
                        }
                    }
                }

                occurenceArrays = occurenceArrays.filter(e => e.length != 0);

            }

        });
    }
}