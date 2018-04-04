import { DiagramView } from "../view/DiagramView";
import { LayerView } from "../view/LayerView";
import { LifelineView } from "../view/LifelineView";
import { MessageView } from "../view/MessageView";
import { FragmentView } from '../view/FragmentView';
import * as Config from "../config";
import { MessageOccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
export class LayoutControl {
    static magic(diagram) {
        // console.log("magic")
        if (!diagram.graphicElement)
            diagram.graphicElement = new DiagramView(diagram);
        diagram.layers.forEach((layer, index) => {
            //console.log("Layer:"+index);
            //TODO maybe make last offset min config thingie
            var dynamicLayerWidth = Config.firstLifelineOffsetX +
                (layer.lifelines.length - 1) * Config.lifelineOffsetX +
                Config.firstLifelineOffsetX;
            if (dynamicLayerWidth < Config.layerWidth) {
                dynamicLayerWidth = Config.layerWidth;
            }
            var dynamicLayerHeight = Config.lifelineOffsetY +
                Config.firstMessageOffset +
                (layer.messages.length - 1) * Config.messageOffset
                + Config.firstMessageOffset;
            if (dynamicLayerHeight < Config.layerHeight) {
                dynamicLayerHeight = Config.layerHeight;
            }
            if (!layer.graphicElement) {
                diagram.graphicElement.add(new LayerView(layer));
                layer.graphicElement.updateLayout(dynamicLayerWidth, dynamicLayerHeight, index);
            }
            //console.log(diagram.diagramView.children[0]);
            layer.graphicElement.updateLayout(dynamicLayerWidth, dynamicLayerHeight, index);
            //console.log(diagram.diagramView.children[0]);
            layer.lifelines.forEach((lifeline, index) => {
                //console.log("Lifeline:"+index);
                if (!lifeline.graphicElement) {
                    layer.graphicElement.add(new LifelineView(lifeline));
                    lifeline.graphicElement.updateLayout(index);
                }
                else {
                    lifeline.graphicElement.updateLayout(index);
                }
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
            let index2 = 0;
            while (occurenceArrays.map(e => e.length > 0).reduce((a, v) => a || v)) {
                let occurences = occurenceArrays.map(e => e[0]);
                let occToDelete = [], flag = false;
                for (let occ1 of occurences) {
                    // Fragments
                    if (occ1 instanceof OperandOccurenceSpecification && occ1) {
                        index2++;
                        if (layer.fragments.length != 0) {
                            console.log("Frag not null");
                            // if(occ1.startsOperand.startingOccurences.length){
                            let f = layer.fragments[0];
                            layer.graphicElement.add(new FragmentView(f));
                            f.graphicElement.updateLayout(index2);
                            occToDelete.push(occ1);
                            flag = true;
                            // }
                        }
                        else {
                            console.log("ERROR: Frag is null, there shouldnt be OperandOccurences");
                        }
                    }
                    // Message
                    if (occ1 instanceof MessageOccurenceSpecification) {
                        for (let occ2 of occurences) {
                            if (occ1 != occ2 && occ1 && occ2) {
                                if (occ2 instanceof MessageOccurenceSpecification) {
                                    // Messages
                                    for (let m of layer.messages) {
                                        if (m.start == occ1 && m.end == occ2) {
                                            console.log(m);
                                            occToDelete.push(occ1);
                                            occToDelete.push(occ2);
                                            let mflag = false;
                                            if (!m.graphicElement) {
                                                flag = true;
                                                layer.graphicElement.add(new MessageView(m));
                                            }
                                            m.graphicElement.updateLayout(index2++);
                                            if (mflag) {
                                                m.graphicElement.animationProgress = 0.99999999;
                                            }
                                            flag = true;
                                            break;
                                        }
                                    }
                                }
                                // else {
                                //     // Fragments
                                //     if(layer.fragments.length != 0){
                                //         console.log("Frag not null");
                                //         for(let f of layer.fragments){
                                //             for(let fragChild of (f as CombinedFragment).children){
                                //                 fragChild.startingOccurences
                                //             }
                                //             console.log((f as CombinedFragment).children.startingOccurences);
                                //             console.log((f as CombinedFragment).parent.endingOccurences);
                                //         }   
                                //     } else {
                                //         console.log("Frag is null");
                                //     }
                                // }
                            }
                            if (flag) {
                                break;
                            }
                        }
                    }
                    if (flag) {
                        console.log(occToDelete);
                        break;
                    }
                }
                occurences.forEach((occ, index) => {
                    console.log(occurenceArrays[index].length);
                    for (let o of occToDelete)
                        if (occ == o) {
                            occurenceArrays[index] = occurenceArrays[index].filter(e => e != occ);
                        }
                    console.log(occurenceArrays[index].length);
                });
                // occurenceArrays.forEach((occ,index) => {
                //     console.log(index);
                // })
            }
            // layer.fragments.forEach((fragment,index) => {
            //     if(!fragment.graphicElement){
            //         layer.graphicElement.add(new FragmentView(fragment));
            //     }
            // });
        });
        //console.log("Layers done");
    }
}
//# sourceMappingURL=LayoutControl.js.map