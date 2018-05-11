import { StateSequence, stateNeutral } from "./StateMachineBuilder";
import { RaycastControl } from "./RaycastControl";
import { GLContext } from "../view/GLContext";
import { CustomMesh } from "../view/CustomMesh";
import { LayerView } from "../view/LayerView";
import { Lifeline } from "../model/Lifeline";
import { LayoutControl } from "./LayoutControl";
import { Diagram } from "../model/Diagram";
import * as Globals from '../globals';
import { LifelineView } from "../view/LifelineView";
import { MessageView } from "../view/MessageView";
import { Message, StoredMessage, MessageKind, RefMessage } from "../model/Message";
import { OccurenceSpecification, MessageOccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
import { CommunicationController } from "./CommunicationController";
import { Serializer } from "./Serializer";
import { Layer } from "../model/Layer";
import { BusinessElement } from "../model/BusinessElement";
import { GraphicElement } from "../view/GraphicElement";
import { Vector3, Vector2, Combine } from "three";
import { FragmentView } from "../view/FragmentView";
import { InteractionOperand } from "../model/InteractionOperand";
import { InteractionOperator, CombinedFragment } from "../model/CombinedFragment";
import { Lens } from "ramda/index";
import { CameraControls } from "../view/CameraControls";
import * as Config from "../config";
import { createPopup } from "../view/Popup";
import { State } from "./State";
import * as $ from 'jquery';
import { Text3D } from "../view/Text3D";


export function initializeStateTransitions() {
    
    StateSequence
    .start('CREATE_LIFELINE')
    .button('sideLife',()=>{
        $('#sideLife').addClass('actv');
    })
    .click((e: Event, h: CustomMesh[]) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    },(e: Event, hits: CustomMesh[]) => {

        // TODO refactor this

        for (let obj of hits) {
            if (obj.metadata.parent instanceof LayerView) {

                let left = 0;

                let castResult = RaycastControl.simpleDefaultIntersect(e as MouseEvent);
                for (let h of castResult){
                    if(h.object.parent instanceof LayerView) {
                        left = (obj.metadata.parent.businessElement as Layer).lifelines.filter(e => e.graphicElement.position.x < h.point.x).length;
                        break;
                    }
                }
                createPopup({ 
                    Name: null
                }).then(({ Name }: { Name: string }) => {
                    let lifelineNew = new Lifeline();
                    lifelineNew.name = Name;
                    lifelineNew.diagram = Globals.CURRENTLY_OPENED_DIAGRAM;
                    lifelineNew.layer = obj.metadata.parent.businessElement;

                    lifelineNew.layer.lifelines.splice(left, 0, lifelineNew);

                    if((left != 0) && (lifelineNew.layer.lifelines.length-1 != left)){
                        let leftOperands = lifelineNew.layer.lifelines[left-1].occurenceSpecifications
                        .filter(e => e instanceof OperandOccurenceSpecification)
                        .map(e => e as OperandOccurenceSpecification)
                        .map(e => [ e.startsOperand, e.endsOperand ])
                        .reduce((a,v) => a.concat(v), [])
                        .filter(e => e)
                        .filter((e, i, a) => a.indexOf(e) == i);

                        lifelineNew.occurenceSpecifications = lifelineNew.layer.lifelines[left+1].occurenceSpecifications
                        .filter(e => {
                            if (e instanceof OperandOccurenceSpecification) {
                                if (e.startsOperand) {
                                    return leftOperands.indexOf(e.startsOperand) != -1;
                                } else {
                                    return leftOperands.indexOf(e.endsOperand) != -1;
                                }
                            } else return false;
                        }).map((e: OperandOccurenceSpecification) => {
                            let newOcc = new OperandOccurenceSpecification();
                            newOcc.diagram = e.diagram;
                            newOcc.layer = e.layer;
                            newOcc.lifeline = lifelineNew;
                            newOcc.startsOperand = e.startsOperand;
                            newOcc.endsOperand = e.endsOperand;
                            if (newOcc.startsOperand) {
                                newOcc.startsOperand.startingOccurences.splice(newOcc.startsOperand.startingOccurences.indexOf(e)-1,0,newOcc);
                            }
                            if (newOcc.endsOperand) {
                                newOcc.endsOperand.endingOccurences.splice(newOcc.endsOperand.endingOccurences.indexOf(e)-1,0,newOcc);
                            }
                            return newOcc;
                        })
                        
                    }

                    LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
                });
                break;
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    StateSequence
    .start('DELETE_LIFELINE')
    .button('sideDeleteLife',()=>{
        $('#sideDeleteLife').addClass('actv');
    })
    .click((e: Event, h: CustomMesh[]) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                return true;
            }
        }
        return false;
    },(e: Event, h: CustomMesh[]) => {

        // TODO refactor this
          
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                let lifeline: Lifeline = obj.metadata.parent.businessElement;    
                
                lifeline.layer.lifelines.splice(lifeline.layer.lifelines.indexOf(lifeline), 1);
                lifeline.graphicElement.parent.remove(lifeline.graphicElement);

                let toRemove: OccurenceSpecification[] = [];
                let toRemoveMessages: StoredMessage[] = [];
                let toRemoveFragments: CombinedFragment[] = [];

                for (let occurence of lifeline.occurenceSpecifications) {

                    if (occurence instanceof MessageOccurenceSpecification) {
                        toRemove.push(occurence.message.start, occurence.message.end);
                        toRemoveMessages.push(occurence.message);

                    } else if (occurence instanceof OperandOccurenceSpecification) {
                        toRemove.push(occurence);
                        if(occurence.endsOperand){
                            toRemoveFragments.push(occurence.endsOperand.parent);
                        } else {
                            toRemoveFragments.push(occurence.startsOperand.parent);
                        }
                    }
                }

                let operandsToRemove: InteractionOperand[] = []
                for (let frag of toRemoveFragments){
                    for (let operand of frag.children){
                        for (let occ of toRemove){
                            if (occ instanceof OperandOccurenceSpecification){
                                if (occ.endsOperand){
                                    operand.endingOccurences = operand.endingOccurences.filter(e => e!= occ); 
                                } 
                                if (occ.startsOperand){
                                    operand.startingOccurences = operand.startingOccurences.filter(e => e!= occ); 
                                }                             
                            }
                        }
                        if(operand.startingOccurences.length == 0 && operand.endingOccurences.length == 0){
                            operandsToRemove = operandsToRemove.filter(e => e!=operand);
                            operandsToRemove.push(operand);
                        }
                    }
                }

                if(operandsToRemove.length > 0){
                    for(let operand of operandsToRemove){
                        operand.layer.fragments = operand.layer.fragments.filter(e => e!=operand.parent)
                        operand.graphicElement.parent.remove(operand.graphicElement);      
                    }
                }

                for (let occ of toRemove) {
                    occ.lifeline.occurenceSpecifications = occ.lifeline.occurenceSpecifications.filter(e => e!=occ);
                }

                for (let msg of toRemoveMessages) {
                    msg.layer.messages = msg.layer.messages.filter(e => e!=msg);
                    msg.graphicElement.parent.remove(msg.graphicElement);
                }

                // let occurences: OperandOccurenceSpecification[] = [];
                // for (let frag of toRemoveFragments) {
                   
                //     if (frag.children.length > 0) {
                //         for(let operand of frag.children){
                //             for (let comb_child of operand.children) {
                //                 comb_child.parent = frag.parent;
                //             }
                //         }
                //     }

                //     frag.layer.fragments = frag.layer.fragments.filter(e => e!=frag);
                //     for (let op of frag.children){
                //         occurences = (op as InteractionOperand).startingOccurences.concat();
                //         occurences.concat((op as InteractionOperand).endingOccurences.map(a => a));

                //         if(op.graphicElement.parent != null){
                //             op.graphicElement.parent.remove(op.graphicElement);      
                //         }
                //     }
                // }
                
                console.log(lifeline.diagram);
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
                break;
            }
        }
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    let startLifeline: Lifeline = null;
    let endLifeline: Lifeline = null;
    let newMsg = new StoredMessage();
    newMsg.name = '[Animation]';
    let newMessageView: MessageView = new MessageView(newMsg);
    newMessageView.shouldAnimate = false;

    let createMessagePreDrag = StateSequence
    .start('CREATE_MESSAGE')
    .button('sideMessage',()=>{
        $('#sideMessage').addClass('actv');
    });
    
    let holdLifelineView:LifelineView = null;
    createMessagePreDrag
    .click((e: Event, h: CustomMesh[]) => {
        for (let obj of h) {
            if (obj.viewObject instanceof LifelineView) {
                holdLifelineView = obj.viewObject;
                return true;
            }
        }
        return false;
    },(e: Event, h: CustomMesh[]) => {
        startLifeline = holdLifelineView.businessElement;
        holdLifelineView.parent.add(newMessageView);
        newMessageView.source.copy(holdLifelineView.position)
    })
    .drag((ev, hits) => {
        for (let obj of hits) {
            if (obj.viewObject instanceof LifelineView) {
                endLifeline = obj.viewObject.businessElement;
                return startLifeline != endLifeline;
            }
        }
        return false;
    },
    (ev, hits) => {

        let startLife = startLifeline;
        let endLife = endLifeline;
        //onsuccess                
        createPopup({ Name: null, Type: [
            MessageKind.SYNC_CALL,
            MessageKind.ASYNC_CALL,
            MessageKind.RETURN
        ]}).then(({ Name, Type }: { Name: string, Type: MessageKind }) => {

            let startOcc = new MessageOccurenceSpecification();
            let endOcc = new MessageOccurenceSpecification();

            startOcc.diagram = startLife.diagram;
            endOcc.diagram = endLife.diagram;

            startOcc.layer = startLife.layer;
            endOcc.layer = endLife.layer;

            let msg = new StoredMessage();

            msg.diagram = startLife.diagram;
            msg.layer = startLife.layer;
            msg.name = 'new msg';
            msg.kind = MessageKind.SYNC_CALL;
            
            msg.start = startOcc;
            msg.end = endOcc;

            startOcc.message = msg;
            endOcc.message = msg;

            startOcc.lifeline = startLife;
            endOcc.lifeline = endLife;

            startLife.occurenceSpecifications.push(startOcc);
            endLife .occurenceSpecifications.push(endOcc);

            startLife.layer.messages.push(msg);

            // hold my beer
            msg.graphicElement = newMessageView;
            msg.graphicElement.shouldAnimate = true;

            sortOccurences([msg.start, msg.end]);

            newMessageView = new MessageView(newMsg);
            newMessageView.shouldAnimate = false;
            msg.graphicElement.businessElement=msg;

            newMessageView.position.setY(10000); //advanced programing technique

            msg.name = Name;
            msg.kind = Type;
            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
        }).catch(() => {
            newMessageView.position.setY(10000); //advanced programing technique  
            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
        });
                
    },
    (ev, hits) => {
        //onfail
        newMessageView.position.setY(10000); //advanced programing technique
    },
    (ev, hits) => {
        //cleanup
        startLifeline = null;
        endLifeline = null;
        holdLifelineView =null;

        // newMessageView.position.setY(10000); //advanced programing technique
        // advanced programming technique moved to after asynchronous handler finishes
        //newMessageView.parent.remove(newMessageView);
    },
    (ev, hits) => {
        //onmouseevent
        let castResult = RaycastControl.simpleDefaultIntersect(ev as MouseEvent);
        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                newMessageView.redrawByDestination(new Vector3(
                    h.point.x -newMessageView.parent.position.x,
                    h.point.y -newMessageView.parent.position.y,
                    0
                ));
                break;
            }
        }
    },
    createMessagePreDrag)
.finish(() => {
    $('.actv').removeClass('actv');
});

    StateSequence
    .start('DELETE_MESSAGE')
    .button('sideDeleteMessage',()=>{
        $('#sideDeleteMessage').addClass('actv');
    })
    .click((e: Event, h: CustomMesh[]) =>{
        for (let obj of h) {
            if (obj.metadata.parent instanceof MessageView) {
                return true;
            }
        }
        return false;

    },(e: Event, h: CustomMesh[]) =>{

        //console.log(h)
        for (let obj of h ) {
            if (obj.metadata.parent instanceof MessageView) {
                
                let msg: StoredMessage = obj.metadata.parent.businessElement;

                for (let occ of [ msg.start, msg.end ]) {
                    occ.lifeline.occurenceSpecifications.splice(occ.lifeline.occurenceSpecifications.indexOf(occ), 1);
                }

                msg.layer.messages.splice(msg.layer.messages.indexOf(msg), 1);
                msg.graphicElement.parent.remove(msg.graphicElement);

                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);

                break;
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }

    })
    .finish(() =>{
        $('.actv').removeClass('actv');
    })

    StateSequence
        .start("SAVE_DIAGRAM")
        .button('saveDiagram',()=>{
            $('#saveDiagram').addClass('actv');
        })
        .finish(() => {
            CommunicationController.instance.saveDiagram(Globals.CURRENTLY_OPENED_DIAGRAM);
            Globals.setDiagramSaved(true);
            $('.actv').removeClass('actv');
        });
  
    StateSequence
    .start('CREATE_LAYER')
    .button('sideLayer',()=>{
        $('#sideLayer').addClass('actv');
    })
    .finish(() => {
        let layer = new Layer();

        layer.diagram = Globals.CURRENTLY_OPENED_DIAGRAM;

        Globals.CURRENTLY_OPENED_DIAGRAM.layers.push(layer);
        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
        $('.actv').removeClass('actv');
    });

    StateSequence
    .start('DELETE_LAYER')
    .button('sideDeleteLayer',()=>{
        $('#sideDeleteLayer').addClass('actv');
    })
    .click((event: Event, hits: CustomMesh[]) => {
        for (let hit of hits) {
            if (hit.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    },
     (event: Event, hits: CustomMesh[]) => {
        console.log(hits);
        for (let hit of hits) {
            console.log(hit.metadata.parent);
            if (hit.metadata.parent instanceof LayerView) {
                let lay: Layer = ((hit.metadata.parent as LayerView).businessElement as Layer);
                Globals.CURRENTLY_OPENED_DIAGRAM.layers.splice(Globals.CURRENTLY_OPENED_DIAGRAM.layers.indexOf(lay), 1);
                Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement.remove(lay.graphicElement);
                console.log(Globals.CURRENTLY_OPENED_DIAGRAM);

                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);

                break;
            }
    }})
    .finish(()=>{
        $('.actv').removeClass('actv');
    });


    let movedLifeline: Lifeline = null;

    let moveLifelineStart = StateSequence
    .start('MOVE_LIFELINE');

    let lastOffsetX: number = 0;

    moveLifelineStart
    .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof LifelineView;
    }, (event, hits) => {
        movedLifeline = (hits[0].metadata.parent as GraphicElement).businessElement as Lifeline;
        lastOffsetX = (event as MouseEvent).offsetX;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {
        movedLifeline.layer.lifelines.sort((a,b) => {
            return a.graphicElement.position.x - b.graphicElement.position.x;
        });
        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedLifeline = null;
        lastOffsetX = 0;
    },
    (ev, hits) => {
        movedLifeline.graphicElement.position.x = movedLifeline.graphicElement.position.x + ((ev as MouseEvent).offsetX - lastOffsetX);
        (movedLifeline.graphicElement as LifelineView).updateMessages();
        (movedLifeline.graphicElement as LifelineView).updateFragments();
        lastOffsetX = (ev as MouseEvent).offsetX;
    },
    moveLifelineStart)
    .finish(() => {});



    let MessageDragByDestination = StateSequence
    .start('MESSAGE_DRAG_DEST')
    
    MessageDragByDestination
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let m = null;
        if(h[0] && h[0].object instanceof CustomMesh){
            let m = (h[0].object as CustomMesh).viewObject
            if (m instanceof MessageView){
                let p:Vector3 = h[0].point;
                if(p.distanceTo(m.layerView.getWorldPosition().add(m.destination)) < Config.maxMessageEndInteractionDistance){
                    return true;
                }
            }
        }
        return false;
    }, (event, hits) => {
        movedMessage = (hits[0].metadata.parent as GraphicElement).businessElement as Message;   
        startLifeline = movedMessage.start.lifeline;
    })
    .drag((ev, hits) => {
        for (let obj of hits) {
            if (obj.viewObject instanceof LifelineView) {
                endLifeline = obj.viewObject.businessElement;
                return true;
            }
        }
        return false;
    },
    (ev, hits) => {
        //onsuccess

        movedMessage.end.lifeline.occurenceSpecifications = 
        movedMessage.end.lifeline.occurenceSpecifications.filter(e => e != movedMessage.end);

        movedMessage.end.lifeline = endLifeline;

        movedMessage.end.lifeline.occurenceSpecifications.push(movedMessage.end);

        sortOccurences([movedMessage.start, movedMessage.end]);

        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
                
    },
    (ev, hits) => {
        //onfail
        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        //cleanup
        startLifeline = null;
        endLifeline = null;
        movedMessage = null;
    },
    (ev, hits) => {
        //onmouseevent
        let castResult = RaycastControl.simpleDefaultIntersect(ev as MouseEvent);
        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                (movedMessage.graphicElement as MessageView).redrawByDestination(new Vector3(
                    h.point.x -movedMessage.graphicElement.parent.position.x,
                    h.point.y -movedMessage.graphicElement.parent.position.y,
                    0
                ));
                break;
            }
        }
    },
    MessageDragByDestination)
    .finish(() => {});

    let MessageDragBySource = StateSequence
    .start('MESSAGE_DRAG_DEST')
    
    MessageDragBySource
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let m = null;
        if(h[0] && h[0].object instanceof CustomMesh){
            let m = (h[0].object as CustomMesh).viewObject
            if (m instanceof MessageView){
                let p:Vector3 = h[0].point;
                if(p.distanceTo(m.layerView.getWorldPosition().add(m.source)) < Config.maxMessageEndInteractionDistance){
                    return true;
                }
            }
        }
        return false;
    }, (event, hits) => {
        movedMessage = (hits[0].metadata.parent as GraphicElement).businessElement as Message;   
        endLifeline = movedMessage.start.lifeline;
    })
    .drag((ev, hits) => {
        for (let obj of hits) {
            if (obj.viewObject instanceof LifelineView) {
                startLifeline = obj.viewObject.businessElement;
                return true;
            }
        }
        return false;
    },
    (ev, hits) => {
        //onsuccess
        movedMessage.start.lifeline.occurenceSpecifications = 
        movedMessage.start.lifeline.occurenceSpecifications.filter(e => e != movedMessage.start);

        movedMessage.start.lifeline = startLifeline;

        movedMessage.start.lifeline.occurenceSpecifications.push(movedMessage.start);

        sortOccurences([movedMessage.start, movedMessage.end]);

        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
                
    },
    (ev, hits) => {
        //onfail
        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        //cleanup
        startLifeline = null;
        endLifeline = null;
        movedMessage = null;

    },
    (ev, hits) => {
        //onmouseevent
        let castResult = RaycastControl.simpleDefaultIntersect(ev as MouseEvent);
        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                (movedMessage.graphicElement as MessageView).redrawBySource(new Vector3(
                    h.point.x -movedMessage.graphicElement.parent.position.x,
                    h.point.y -movedMessage.graphicElement.parent.position.y,
                    0
                ));
                break;
            }
        }
    },
    MessageDragBySource)
    .finish(() => {});


    let movedMessage: Message = null;

    let moveMessageStart = StateSequence
    .start('MOVE_MESSAGE');

    let lastOffsetY: number = 0;

    moveMessageStart
    .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof MessageView;
    }, (event, hits) => {
        movedMessage = (hits[0].metadata.parent as GraphicElement).businessElement as Message;
        lastOffsetY = (event as MouseEvent).offsetY;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {

            sortOccurences([movedMessage.start, movedMessage.end]);

            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },

    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedMessage = null;
        lastOffsetY = 0;
    },
    (ev, hits) => {

        movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        (movedMessage.graphicElement as MessageView).source.y = (movedMessage.graphicElement as MessageView).source.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        (movedMessage.graphicElement as MessageView).destination.y = (movedMessage.graphicElement as MessageView).destination.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        
        lastOffsetY = (ev as MouseEvent).offsetY;
    },
    moveMessageStart)
    .finish(() => { });

    let movedFrag1: InteractionOperand = null;
    let movedFrag2: InteractionOperand = null;

    let moveFragmentStart = StateSequence
    .start('DRAG_FRAGMENT_INSIDE');

    moveFragmentStart
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let f = null;
        if(h[0] && h[0].object instanceof CustomMesh && h[1] && h[1].object instanceof CustomMesh){
            let f0 = (h[0].object as CustomMesh).viewObject;
            let f1 = (h[1].object as CustomMesh).viewObject;  
            if(f0 == f1){
                return false;
            }          
            if (f0 instanceof FragmentView && f1 instanceof FragmentView){
                let p:Vector3 = h[0].point;
                let between = [];
                between.push(f0.layerView.getWorldPosition().add(f0.source).x, f1.layerView.getWorldPosition().add(f1.destination).x)
                if(between[0] < p.x && p.x < between[1]){
                    if(p.y > f0.destination.y || p.y < f1.source.y ){
                        return true;
                    }
                }
            }
        }
        return false;

    }, (event, hits) => {
        movedFrag1 = (hits[0].metadata.parent as GraphicElement).businessElement as InteractionOperand;
        movedFrag2 = (hits[1].metadata.parent as GraphicElement).businessElement as InteractionOperand;

        lastOffsetY = (event as MouseEvent).offsetY;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {
            
            let occs: OperandOccurenceSpecification[] = movedFrag1.startingOccurences.concat(movedFrag1.endingOccurences);

            sortOccurences(occs as OccurenceSpecification[])

            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedFrag1 = null;
        lastOffsetY = 0;
    },
    (ev, hits) => {
        
        let frag1 = (movedFrag1.graphicElement as FragmentView);
        let frag2 = (movedFrag2.graphicElement as FragmentView);
        
        if(frag1.position.y > frag2.position.y){
            let tmp;
            tmp = frag1;
            frag1 = frag2;
            frag2 = tmp;
            tmp = movedFrag1;
            movedFrag1 = movedFrag2;
            movedFrag2 = tmp;
        }
                
        let fragPosition1 = (movedFrag1.graphicElement as FragmentView).source;
        let fragPosition2 = (movedFrag2.graphicElement as FragmentView).destination;
        fragPosition1.y = (movedFrag1.graphicElement as FragmentView).source.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        
        if((frag1.layerView.getWorldPosition().add(frag1.destination).y + Config.lifelineRadius) > fragPosition1.y){
            fragPosition1.y = frag1.layerView.getWorldPosition().add(frag1.destination).y + Config.lifelineRadius;
        }
        if((frag2.layerView.getWorldPosition().add(frag2.source).y - Config.lifelineRadius) < fragPosition1.y){
            fragPosition1.y = frag2.layerView.getWorldPosition().add(frag2.source).y - Config.lifelineRadius;
        }

        (movedFrag1.graphicElement as FragmentView).redrawBySource(fragPosition1);
        


        fragPosition2.y = (movedFrag2.graphicElement as FragmentView).destination.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        
        if((frag2.layerView.getWorldPosition().add(frag2.source).y - Config.lifelineRadius) < fragPosition2.y){
            fragPosition2.y = frag2.layerView.getWorldPosition().add(frag2.source).y - Config.lifelineRadius;
        }
        if((frag1.layerView.getWorldPosition().add(frag1.destination).y + Config.lifelineRadius) > fragPosition2.y){
            fragPosition2.y = frag1.layerView.getWorldPosition().add(frag1.destination).y + Config.lifelineRadius;
        }

        (movedFrag2.graphicElement as FragmentView).redrawByDestination(fragPosition2);
        
        lastOffsetY = (ev as MouseEvent).offsetY;
    },
    moveFragmentStart)
    .finish(() => { });

    moveFragmentStart = StateSequence
    .start('DRAG_FRAGMENT_DEST');

    moveFragmentStart
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let f = null;
        if(h[0] && h[0].object instanceof CustomMesh){
            let f = (h[0].object as CustomMesh).viewObject
            if (f instanceof FragmentView){
                let p:Vector3 = h[0].point;
                let between = [];
                between.push(f.layerView.getWorldPosition().add(f.source).x, f.layerView.getWorldPosition().add(f.destination).x)
                if(between[0] < p.x && p.x < between[1]){
                    if((p.y > f.destination.y - Config.lifelineRadius) && (p.y < f.destination.y + Config.lifelineRadius)){
                        return true;
                    }
                }
            }
        }
        return false;
    }, (event, hits) => {
        movedFrag1 = (hits[0].metadata.parent as GraphicElement).businessElement as InteractionOperand;        
        lastOffsetY = (event as MouseEvent).offsetY;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {
            
            let occs: OperandOccurenceSpecification[] = movedFrag1.startingOccurences.concat(movedFrag1.endingOccurences);

            sortOccurences(occs as OccurenceSpecification[])

            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedFrag1 = null;
        lastOffsetY = 0;
    },
    (ev, hits) => {

        let frag = (movedFrag1.graphicElement as FragmentView);
        let fragPosition = (movedFrag1.graphicElement as FragmentView).destination;

        fragPosition.y = (movedFrag1.graphicElement as FragmentView).destination.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        
        if((frag.layerView.getWorldPosition().add(frag.source).y - Config.lifelineRadius) < fragPosition.y){
            fragPosition.y = frag.layerView.getWorldPosition().add(frag.source).y - Config.lifelineRadius;
        }

        let fragParent = movedFrag1.parent.parent;

        if(fragParent){
            if((fragParent.graphicElement as FragmentView).getBottom() + Config.lifelineRadius > fragPosition.y){
                fragPosition.y = (fragParent.graphicElement as FragmentView).getBottom() + Config.lifelineRadius;
            }
        }

        (movedFrag1.graphicElement as FragmentView).redrawByDestination(fragPosition);

        lastOffsetY = (ev as MouseEvent).offsetY;
                
    },
    moveFragmentStart)
    .finish(() => { });

    moveFragmentStart = StateSequence
    .start('DRAG_FRAGMENT_SOURCE');
    
    moveFragmentStart
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let f = null;
        if(h[0] && h[0].object instanceof CustomMesh){
            let f = (h[0].object as CustomMesh).viewObject
            if (f instanceof FragmentView){
                let p:Vector3 = h[0].point;
                let between = [];
                between.push(f.layerView.getWorldPosition().add(f.source).x, f.layerView.getWorldPosition().add(f.destination).x)
                if(between[0] < p.x && p.x < between[1]){
                    if((p.y > f.source.y - Config.lifelineRadius) && (p.y < f.source.y + Config.lifelineRadius)){
                        return true;
                    }
                }
            }
        }
        return false;
    }, (event, hits) => {
        movedFrag1 = (hits[0].metadata.parent as GraphicElement).businessElement as InteractionOperand;        
        lastOffsetY = (event as MouseEvent).offsetY;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {
            
            let occs: OperandOccurenceSpecification[] = movedFrag1.startingOccurences.concat(movedFrag1.endingOccurences);

            sortOccurences(occs as OccurenceSpecification[])

            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedFrag1 = null;
        lastOffsetY = 0;
    },
    (ev, hits) => {
        
        let frag = (movedFrag1.graphicElement as FragmentView);
        let fragPosition = (movedFrag1.graphicElement as FragmentView).source;

        fragPosition.y = (movedFrag1.graphicElement as FragmentView).source.y - ((ev as MouseEvent).offsetY - lastOffsetY);

        if((frag.layerView.getWorldPosition().add(frag.destination).y + Config.lifelineRadius) > fragPosition.y){
            fragPosition.y = frag.layerView.getWorldPosition().add(frag.destination).y + Config.lifelineRadius;
        }

        let fragParent = movedFrag1.parent.parent;
        if(fragParent){
            if((fragParent.graphicElement as FragmentView).getTop() - Config.lifelineRadius < fragPosition.y){
                fragPosition.y = (fragParent.graphicElement as FragmentView).getTop() - Config.lifelineRadius;
            }
        }

        (movedFrag1.graphicElement as FragmentView).redrawBySource(fragPosition);

        lastOffsetY = (ev as MouseEvent).offsetY;
        
    },
    moveFragmentStart)
    .finish(() => { });

    lastOffsetX = 0;
    moveFragmentStart = StateSequence
    .start('DRAG_FRAGMENT_RIGHT');

    moveFragmentStart
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let f = null;
        if(h[0] && h[0].object instanceof CustomMesh){
            let f = (h[0].object as CustomMesh).viewObject
            if (f instanceof FragmentView){
                let p:Vector3 = h[0].point;
                let between = [];
                between.push(f.layerView.getWorldPosition().add(f.source).y, f.layerView.getWorldPosition().add(f.destination).y)
                if(between[0] > p.y && p.y > between[1]){
                    if((p.x > f.destination.x - Config.lifelineRadius) && (p.x < f.destination.x + Config.lifelineRadius)){
                        return true;
                    }
                }
            }
        }
        return false;
    }, (event, hits) => {
        movedFrag1 = (hits[0].metadata.parent as GraphicElement).businessElement as InteractionOperand;        
        lastOffsetX = (event as MouseEvent).offsetX;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {
        
            let frag = (movedFrag1.graphicElement as FragmentView);
            let lifeX = frag.layerView.getWorldPosition().add((frag.findEndingLifeline().graphicElement as LifelineView).position).x;
            
            while(frag.getRight() < lifeX){
                let rightLife = (movedFrag1.graphicElement as FragmentView).findEndingLifeline();

                let fragOccs: OperandOccurenceSpecification[] = [];

                for(let child of movedFrag1.parent.children){
                    fragOccs = fragOccs.concat(child.startingOccurences.concat(child.endingOccurences));
                }

                let occsToDelete = rightLife.occurenceSpecifications
                .filter(e => e instanceof OperandOccurenceSpecification)
                .filter((e: OperandOccurenceSpecification) => fragOccs.indexOf(e) != -1);
                
                rightLife.occurenceSpecifications = rightLife.occurenceSpecifications
                .filter(e => occsToDelete.indexOf(e) == -1);
                
                for(let child of movedFrag1.parent.children){
                    child.startingOccurences = child.startingOccurences
                    .filter(e => occsToDelete.indexOf(e) == -1);
                }
                
                for(let child of movedFrag1.parent.children){
                    child.endingOccurences = child.endingOccurences
                    .filter(e => occsToDelete.indexOf(e) == -1);
                }

                lifeX = frag.layerView.getWorldPosition().add((frag.findEndingLifeline().graphicElement as LifelineView).position).x;                
            }

            let allLifelines = movedFrag1.layer.lifelines.concat();
            let selectedLifelines: Lifeline[] = [];
            let fragmentLifelines: Lifeline[] = [];
            
            for(let ll of allLifelines){
                if(ll.graphicElement.position.x < frag.getRight() && ll.graphicElement.position.x > frag.getLeft()){
                    selectedLifelines.push(ll);
                }
            }

            for(let occ of movedFrag1.startingOccurences){
                fragmentLifelines.push(occ.lifeline);
            }

            selectedLifelines = selectedLifelines
            .filter(e => fragmentLifelines.indexOf(e) == -1);

            for(let ll of selectedLifelines){

                let leftOperands = movedFrag1.parent.children;

                let newSpecifications = (movedFrag1.graphicElement as FragmentView).findEndingLifeline().occurenceSpecifications
                .filter(e => {
                    if (e instanceof OperandOccurenceSpecification) {
                        if (e.startsOperand) {
                            return leftOperands.indexOf(e.startsOperand) != -1;
                        } else {
                            return leftOperands.indexOf(e.endsOperand) != -1;
                        }
                    } else return false;
                }).map((e: OperandOccurenceSpecification) => {
                    let newOcc = new OperandOccurenceSpecification();
                    newOcc.diagram = e.diagram;
                    newOcc.layer = e.layer;
                    newOcc.lifeline = ll;
                    newOcc.startsOperand = e.startsOperand;
                    newOcc.endsOperand = e.endsOperand;
                    if (newOcc.startsOperand) {
                        newOcc.startsOperand.startingOccurences.splice(newOcc.startsOperand.startingOccurences.indexOf(e)-1,0,newOcc);
                    }
                    if (newOcc.endsOperand) {
                        newOcc.endsOperand.endingOccurences.splice(newOcc.endsOperand.endingOccurences.indexOf(e)-1,0,newOcc);
                    }
                    return newOcc;
                })

                for(let occ of newSpecifications){
                    ll.occurenceSpecifications.push(occ);
                }
            }

            let occs: OperandOccurenceSpecification[] = movedFrag1.startingOccurences.concat(movedFrag1.endingOccurences);

            sortOccurences(occs as OccurenceSpecification[])

            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedFrag1 = null;
        lastOffsetX = 0;
    },
    (ev, hits) => {

        let insideFragments: InteractionOperand[] = [];
        let children = movedFrag1.parent.children.concat();

        for(let child of children){
            if(child.children.length > 0){
                if(child.children[0].children.length > 0){
                    insideFragments = child.children[0].children.concat();
                }
            }
        }

        let lastX = Number.MIN_SAFE_INTEGER;
        for(let frag of insideFragments){
            let X = (frag.graphicElement as FragmentView).getRight();
            if(X > lastX){
                lastX = X;
            }
        }

        for(let movedFrag of children){
            let frag = (movedFrag.graphicElement as FragmentView);
            let fragPosition = (movedFrag.graphicElement as FragmentView).destination;
   
            fragPosition.x = (movedFrag.graphicElement as FragmentView).destination.x + ((ev as MouseEvent).offsetX - lastOffsetX);
            
            if((frag.layerView.getWorldPosition().add((frag.findStartingLifeline().graphicElement as LifelineView).position).x + 2*Config.lifelineRadius) > fragPosition.x){
                fragPosition.x = frag.layerView.getWorldPosition().add((frag.findStartingLifeline().graphicElement as LifelineView).position).x + 2*Config.lifelineRadius;
            }
    
            let fragParent = movedFrag.parent.parent;
            if(fragParent){
                if((fragParent.graphicElement as FragmentView).getRight() - Config.lifelineRadius < fragPosition.x){
                    fragPosition.x = (fragParent.graphicElement as FragmentView).getRight() - Config.lifelineRadius;
                    break;
                }
            }
            if(lastX + Config.lifelineRadius > fragPosition.x){
                fragPosition.x = lastX + Config.lifelineRadius;
                break;
            }
            (movedFrag.graphicElement as FragmentView).redrawByDestination(fragPosition);
        }
        
        lastOffsetX = (ev as MouseEvent).offsetX;             
    },
    moveFragmentStart)
    .finish(() => { });

    lastOffsetX = 0;
    moveFragmentStart = StateSequence
    .start('DRAG_FRAGMENT_LEFT');

    moveFragmentStart
    .click((event, hits) => {
        let h = null;
        h = RaycastControl.simpleDefaultIntersect(event as MouseEvent)
        let f = null;
        if(h[0] && h[0].object instanceof CustomMesh){
            let f = (h[0].object as CustomMesh).viewObject
            if (f instanceof FragmentView){
                let p:Vector3 = h[0].point;
                let between = [];
                between.push(f.layerView.getWorldPosition().add(f.source).y, f.layerView.getWorldPosition().add(f.destination).y)
                if(between[0] > p.y && p.y > between[1]){
                    if((p.x > f.source.x - Config.lifelineRadius) && (p.x < f.source.x + Config.lifelineRadius)){
                        return true;
                    }
                }
            }
        }
        return false;
    }, (event, hits) => {
        movedFrag1 = (hits[0].metadata.parent as GraphicElement).businessElement as InteractionOperand;        
        lastOffsetX = (event as MouseEvent).offsetX;
    })
    .drag((ev, hits) => true,
    (ev, hits) => {
            let frag = (movedFrag1.graphicElement as FragmentView);
            let lifeX = frag.layerView.getWorldPosition().add((frag.findStartingLifeline().graphicElement as LifelineView).position).x;
            
            while(frag.getLeft() > lifeX){
                let rightLife = (movedFrag1.graphicElement as FragmentView).findStartingLifeline();

                let fragOccs: OperandOccurenceSpecification[] = [];

                for(let child of movedFrag1.parent.children){
                    fragOccs = fragOccs.concat(child.startingOccurences.concat(child.endingOccurences));
                }

                let occsToDelete = rightLife.occurenceSpecifications
                .filter(e => e instanceof OperandOccurenceSpecification)
                .filter((e: OperandOccurenceSpecification) => fragOccs.indexOf(e) != -1);
                
                rightLife.occurenceSpecifications = rightLife.occurenceSpecifications
                .filter(e => occsToDelete.indexOf(e) == -1);
                
                for(let child of movedFrag1.parent.children){
                    child.startingOccurences = child.startingOccurences
                    .filter(e => occsToDelete.indexOf(e) == -1);
                }
                
                for(let child of movedFrag1.parent.children){
                    child.endingOccurences = child.endingOccurences
                    .filter(e => occsToDelete.indexOf(e) == -1);
                }

                lifeX = frag.layerView.getWorldPosition().add((frag.findStartingLifeline().graphicElement as LifelineView).position).x;
                
            }

            let allLifelines = movedFrag1.layer.lifelines.concat();
            let selectedLifelines: Lifeline[] = [];
            let fragmentLifelines: Lifeline[] = [];
            
            for(let ll of allLifelines){
                if(ll.graphicElement.position.x > frag.getLeft() && ll.graphicElement.position.x < frag.getRight()){
                    selectedLifelines.push(ll);
                }
            }

            for(let occ of movedFrag1.startingOccurences){
                fragmentLifelines.push(occ.lifeline);
            }

            selectedLifelines = selectedLifelines
            .filter(e => fragmentLifelines.indexOf(e) == -1);

            for(let ll of selectedLifelines){

                let leftOperands = movedFrag1.parent.children;

                let newSpecifications = (movedFrag1.graphicElement as FragmentView).findStartingLifeline().occurenceSpecifications
                .filter(e => {
                    if (e instanceof OperandOccurenceSpecification) {
                        if (e.startsOperand) {
                            return leftOperands.indexOf(e.startsOperand) != -1;
                        } else {
                            return leftOperands.indexOf(e.endsOperand) != -1;
                        }
                    } else return false;
                }).map((e: OperandOccurenceSpecification) => {
                    let newOcc = new OperandOccurenceSpecification();
                    newOcc.diagram = e.diagram;
                    newOcc.layer = e.layer;
                    newOcc.lifeline = ll;
                    newOcc.startsOperand = e.startsOperand;
                    newOcc.endsOperand = e.endsOperand;
                    if (newOcc.startsOperand) {
                        newOcc.startsOperand.startingOccurences.splice(newOcc.startsOperand.startingOccurences.indexOf(e)-1,0,newOcc);
                    }
                    if (newOcc.endsOperand) {
                        newOcc.endsOperand.endingOccurences.splice(newOcc.endsOperand.endingOccurences.indexOf(e)-1,0,newOcc);
                    }
                    return newOcc;
                })

                for(let occ of newSpecifications){
                    ll.occurenceSpecifications.push(occ);
                }
            }
 
            let occs: OperandOccurenceSpecification[] = movedFrag1.startingOccurences.concat(movedFrag1.endingOccurences);

            sortOccurences(occs as OccurenceSpecification[])

            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    },
    (ev, hits) => {
        // empty
    },
    (ev, hits) => {
        movedFrag1 = null;
        lastOffsetX = 0;
    },
    (ev, hits) => {

        let children = movedFrag1.parent.children.concat();
        let insideFragments: InteractionOperand[] = [];

        for(let child of children){
            if(child.children.length > 0){
                if(child.children[0].children.length > 0){
                    insideFragments = child.children[0].children.concat();
                }
            }
        }

        let lastX = Number.MAX_SAFE_INTEGER;
        for(let frag of insideFragments){
            let X = (frag.graphicElement as FragmentView).getLeft();
            if(X < lastX){
                lastX = X;
            }
        }

        for(let movedFrag of children){
            let frag = (movedFrag.graphicElement as FragmentView);
            let fragPosition = (movedFrag.graphicElement as FragmentView).source;
    
            fragPosition.x = (movedFrag.graphicElement as FragmentView).source.x + ((ev as MouseEvent).offsetX - lastOffsetX);
            
            if((frag.layerView.getWorldPosition().add((frag.findEndingLifeline().graphicElement as LifelineView).position).x - 2*Config.lifelineRadius) < fragPosition.x){
                fragPosition.x = frag.layerView.getWorldPosition().add((frag.findEndingLifeline().graphicElement as LifelineView).position).x - 2*Config.lifelineRadius;
            }
    
            let fragParent = movedFrag.parent.parent;

            if(fragParent){
                if((fragParent.graphicElement as FragmentView).getLeft() + Config.lifelineRadius > fragPosition.x){
                    fragPosition.x = (fragParent.graphicElement as FragmentView).getLeft() + Config.lifelineRadius;
                    break;
                }
            }
            if(lastX - Config.lifelineRadius < fragPosition.x){
                fragPosition.x = lastX - Config.lifelineRadius;
                break;
            }
            (movedFrag.graphicElement as FragmentView).redrawBySource(fragPosition);
        }


        lastOffsetX = (ev as MouseEvent).offsetX;             
    },
    moveFragmentStart)
    .finish(() => { });

    function sortOccurences(occs: OccurenceSpecification[]){
        let execAfterChecking: (() => void)[] = [];
        let broken = false;

        for(let occ of occs){
            let aclone = ([].concat(occ.lifeline.occurenceSpecifications) as OccurenceSpecification[]).sort((a,b) => {
                if((a instanceof MessageOccurenceSpecification) && (b instanceof MessageOccurenceSpecification)){
                    return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
                }
                else if((a instanceof MessageOccurenceSpecification) && (b instanceof OperandOccurenceSpecification)){
                    if(b.startsOperand){
                        return -(a.message.graphicElement.position.y - (b.startsOperand.graphicElement as FragmentView).getTop());
                    } else if(b.endsOperand){
                        return -(a.message.graphicElement.position.y - (b.endsOperand.graphicElement as FragmentView).getBottom());
                    }
                }
                else if((b instanceof MessageOccurenceSpecification) && (a instanceof OperandOccurenceSpecification)){
                    if(a.startsOperand){
                        return (b.message.graphicElement.position.y - (a.startsOperand.graphicElement as FragmentView).getTop());
                    } else if(a.endsOperand){
                        return (b.message.graphicElement.position.y - (a.endsOperand.graphicElement as FragmentView).getBottom());
                    }
                }
                else if((a instanceof OperandOccurenceSpecification) && (b instanceof OperandOccurenceSpecification)){
                    if(a.endsOperand && b.endsOperand){
                        return -((a.endsOperand.graphicElement as FragmentView).getBottom() - (b.endsOperand.graphicElement as FragmentView).getBottom());
                    } else if(a.endsOperand && b.startsOperand){
                        return -((a.endsOperand.graphicElement as FragmentView).getBottom() - (b.startsOperand.graphicElement as FragmentView).getTop());
                    } else if(a.startsOperand && b.endsOperand){
                        return -((a.startsOperand.graphicElement as FragmentView).getTop() - (b.endsOperand.graphicElement as FragmentView).getBottom());
                    } else if(a.startsOperand && b.startsOperand){
                        return -((a.startsOperand.graphicElement as FragmentView).getTop() - (b.startsOperand.graphicElement as FragmentView).getTop());
                    }
                }
            });
            let stack: InteractionOperand[] = [];
            for (let occurence of aclone) {
                if (occurence instanceof OperandOccurenceSpecification) {
                    if (occurence.endsOperand && stack[stack.length - 1] != occurence.endsOperand) {
                        //throw new Error("Operand collision detected");
                        broken = true;
                        break;
                    }
                    if (occurence.endsOperand) {
                        stack.pop();
                    }
                    if (occurence.startsOperand) {
                        if (stack.length == 0){
                            execAfterChecking.push(() => {
                                if (occurence instanceof OperandOccurenceSpecification) {
                                    occurence.startsOperand.parent.parent = null;
                                }
                            });
                        } else {
                            let assignee = stack[stack.length - 1];
                            execAfterChecking.push(() => {
                                if (occurence instanceof OperandOccurenceSpecification) {
                                    occurence.startsOperand.parent.parent = assignee;
                                }
                            });
                        }
                        stack.push(occurence.startsOperand);
                    }
                }
            }
            if (broken) {
                break;
            } else {
                execAfterChecking.push(() => {
                    occ.lifeline.occurenceSpecifications = aclone;
                });
            }
        }
        if (!broken) {
            for (let callback of execAfterChecking) {
                callback();
            }
        }
    }

    let rename = StateSequence.start('RENAME')
    .button('rename',()=>{
        $('#rename').addClass('actv');
    });

    let lifelineRenamed: Lifeline = null;
    rename
    .click((event, hits) => {
        lifelineRenamed = hits[0].metadata.parent.businessElement;
        return hits.length != 0 && hits[0].metadata.parent instanceof LifelineView;        
    }, () => {
        let rename = lifelineRenamed;
        createPopup({ Name: rename.name }).then(({ Name }: { Name: string }) => {
            rename.name = Name;
            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
        });
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    let messageRenamed: Message = null;
    rename
    .click((event, hits) => {
        messageRenamed = hits[0].metadata.parent.businessElement;
        return hits.length != 0 && hits[0].metadata.parent instanceof MessageView;
    }, () => {
        let rename = messageRenamed;
        createPopup({ Name: rename.name, Type: [
            MessageKind.SYNC_CALL,
            MessageKind.ASYNC_CALL,
            MessageKind.RETURN
        ] }).then(({ Name, Type }: { Name: string, Type: MessageKind }) => {
            rename.name = Name;
            rename.kind = Type;
            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
        });
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    let operandRenamed: InteractionOperand = null;
    rename
    .click((event, hits) => {
        operandRenamed = hits[0].metadata.parent.businessElement;
        return hits.length != 0 && hits[0].metadata.parent instanceof FragmentView;
    }, () => {
        let rename = operandRenamed;
        
        let operators =[
            InteractionOperator.ALT,
            InteractionOperator.LOOP,
            InteractionOperator.OPT,
            InteractionOperator.PAR
        ];
        let removed : InteractionOperator[];
        for(let i = operators.length - 1; i >= 0 ; i--){
            if(operators[i] == rename.parent.interactionOperator){
                 removed = operators.splice(i,1);
                break;
            }
        }
        operators.splice(0,0,removed[0]);
        if(rename.parent.children[0] == rename){
            createPopup({
                Operator: operators,
                Constraint: rename.interactionConstraint
            })
            .then(({ Operator, Constraint }: { Operator: InteractionOperator, Constraint: string }) => {
                rename.parent.interactionOperator = Operator;
                rename.interactionConstraint = Constraint;
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
            }); 
        } else {
            createPopup({
                Operator: [
                    rename.parent.interactionOperator
                ],
                Constraint: rename.interactionConstraint
            })
            .then(({ Operator, Constraint }: { Operator: InteractionOperator, Constraint: string }) => {
                rename.parent.interactionOperator = Operator;
                rename.interactionConstraint = Constraint;
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
            }); 
        }
        
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    let firstHit: Vector3;
    let newFragView: FragmentView = null;

    let createCombFrag = StateSequence
    .start('CREATE_COMBINED_FRAGMENT')
    .button('sideFragment', ()=>{
        $('#sideFragment').addClass('actv');
    });

    createCombFrag
    .click((event, hits) => {
        return hits[0] && hits[0].metadata.parent instanceof LayerView;
    }, (event, hits) => {

        let castResult = RaycastControl.simpleDefaultIntersect(event as MouseEvent);
        newFragView = new FragmentView(new InteractionOperand());

        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                firstHit = h.point;
                h.object.parent.add(newFragView);
                newFragView.source = new Vector3(
                    h.point.x,
                    h.point.y,
                    0
                );
                break;
            }
        }
        // create combined fragment view
        
    })
    .drag((event, hits) => {
        for (let obj of hits) {
            if (obj.viewObject instanceof LayerView) {
                return true;
            }
        }
        return false;
    }, (event, hits) => {
        let castResult = RaycastControl.simpleDefaultIntersect(event as MouseEvent);
        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                let layer: Layer = h.object.parent.businessElement as Layer;
                let secondHit = h.point;

                // console.log(firstHit);
                // console.log(secondHit);

                function within(x: number, a: number, b: number) {
                    let min = Math.min(a,b);
                    let max = Math.max(a,b);
                    return x > min && x < max;
                }

                function isAroundMessage(clickA: Vector3, clickB: Vector3, message: Message):boolean{
                    return within(message.graphicElement.position.x, clickA.x, clickB.x) 
                        && within(message.graphicElement.position.y, clickA.y, clickB.y);
                }
                
                function isOutsideCombinedFragment(clickA:Vector3, clickB:Vector3, fragment: CombinedFragment):boolean{
                    
                    let T,R,L,B;
                    let gElement = fragment.children[0].graphicElement as FragmentView;
                    let gElementBottom = fragment.children[fragment.children.length-1].graphicElement as FragmentView;

                    T = gElement.position.clone().add(new Vector3(0,gElement.height/2,0));
                    R = gElement.position.clone().add(new Vector3(gElement.width/2,0,0));
                    L = gElement.position.clone().add(new Vector3(-gElement.width/2,0,0));
                    B = gElementBottom.position.clone().add(new Vector3(0,-gElementBottom.height/2,0));
                    
                    return within(R.x, clickA.x, clickB.x) 
                        && within(L.x, clickA.x, clickB.x) 
                        && within(T.y, clickA.y, clickB.y)
                        && within(B.y, clickA.y, clickB.y);
                }

                function isInsideInteractionOperand(clickA: Vector3, clickB: Vector3, operand: InteractionOperand):boolean{
                    let T,R,L,B;
                    let gElement = operand.graphicElement as FragmentView;

                    T = gElement.position.clone().add(new Vector3(0,gElement.height/2,0));
                    R = gElement.position.clone().add(new Vector3(gElement.width/2,0,0));
                    L = gElement.position.clone().add(new Vector3(-gElement.width/2,0,0));
                    B = gElement.position.clone().add(new Vector3(0,-gElement.height/2,0));

                    return within(clickA.x, L.x, R.x) 
                        && within(clickB.x, L.x, R.x) 
                        && within(clickA.y, T.y, B.y)
                        && within(clickB.y, T.y, B.y);
                }

                function recursive(parent: InteractionOperand|Layer): InteractionOperand|Layer{
                        let fragments: CombinedFragment[];
                        if (parent instanceof Layer) {
                            fragments = parent.fragments;
                        } else {
                            fragments = parent.children;
                        }

                        for (let fragment of fragments) {
                            for (let operand of fragment.children) {
                                // console.log(operand);
                                
                                if (isInsideInteractionOperand(firstHit, secondHit, operand)) {
                                    return recursive(operand);
                                }
                            }
                            
                        }
                        return parent;
                }

                let result = recursive(layer);  
                let resultChildren = (result instanceof Layer ? result.fragments : result.children)
                .filter(e => isOutsideCombinedFragment(firstHit, secondHit, e));

                let childMessages = layer.messages.filter(e => isAroundMessage(firstHit, secondHit, e));

                let cutLifelines = layer.lifelines.filter(e => within(e.graphicElement.position.x, firstHit.x, secondHit.x));

                // console.log(result);            ///Parrent
                // console.log(resultChildren);    ///Children
                // console.log(childMessages);     ///Messages
                // console.log(cutLifelines);      ///Lifelines
                
                if(cutLifelines.length == 0){
                    return;
                }

                let firstMessageOffset = -1;
                
                // let clickOff1 = -(firstHit.y - 
                // ((layer.graphicElement as LayerView).source.y - Config.lifelineOffsetY - Config.firstMessageOffset)) / Config.messageOffset;

                // let clickOff2 = -(secondHit.y - 
                //     ((layer.graphicElement as LayerView).source.y - Config.lifelineOffsetY - Config.firstMessageOffset)) / Config.messageOffset;
    

                let fragmentOccurences = 
                resultChildren
                .map(e => e.children.map(f => f.startingOccurences.concat(f.endingOccurences)))
                .reduce((a,v) => a.concat(v), [])
                .reduce((a,v) => a.concat(v), []);

                let limits = fragmentOccurences
                .map(e => { 
                    if (e.startsOperand) {
                        return (e.startsOperand.graphicElement as FragmentView).getIndexStart();
                    }
                    return (e.endsOperand.graphicElement as FragmentView).getIndexEnd();
                })
                .reduce((a,v) => {
                    if (v < a[0])
                        a[0] = v;
                    if (v > a[1])
                        a[1] = v;
                    return a;
                }, [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]);

                let messageOccurences = childMessages
                .map(e => [ e.start, e.end ])
                .reduce((a,v) => a.concat(v), []);

                limits = messageOccurences
                .map(e => (e.message.graphicElement as MessageView).getIndex())
                .reduce((a,v) => {
                    if (v < a[0])
                        a[0] = v;
                    if (v > a[1])
                        a[1] = v;
                    return a;
                }, limits);

                let comb = new CombinedFragment();
                let inter = new InteractionOperand();
                
                comb.interactionOperator = InteractionOperator.ALT;
                comb.diagram = layer.diagram;
                comb.layer = layer;
                comb.parent = result instanceof InteractionOperand ? result : null;

                for(let child of resultChildren){
                    child.parent = inter;
                }

                if (comb.parent == null) {
                    comb.layer.fragments.push(comb);
                } else {
                    comb.parent.children.push(comb);
                }

                inter.interactionConstraint = 'newConstraint';

                inter.diagram = comb.diagram;
                inter.layer = comb.layer;
                inter.parent = comb;
                inter.children = resultChildren;
                
                inter.startingOccurences = [];
                inter.endingOccurences = [];
                
                comb.children = [ inter ];

                if(resultChildren.length + childMessages.length > 0){
                    for (let lifeline of cutLifelines) {
                        let startIndex = lifeline.occurenceSpecifications
                        .map(e => {
                            if (e instanceof MessageOccurenceSpecification) {
                                return (e.message.graphicElement as MessageView).getIndex();
                            } else {
                                if (e instanceof OperandOccurenceSpecification) {
                                    if (e.startsOperand) {
                                        return (e.startsOperand.graphicElement as FragmentView).getIndexStart();
                                    }
                                    return (e.endsOperand.graphicElement as FragmentView).getIndexEnd();
                                }
                            }
                        })
                        .filter(e => e < limits[0])
                        .length;

                        let endIndex = lifeline.occurenceSpecifications
                        .map(e => {
                            if (e instanceof MessageOccurenceSpecification) {
                                return (e.message.graphicElement as MessageView).getIndex();
                            } else {
                                if (e instanceof OperandOccurenceSpecification) {
                                    if (e.startsOperand) {
                                        return (e.startsOperand.graphicElement as FragmentView).getIndexStart();
                                    }
                                    return (e.endsOperand.graphicElement as FragmentView).getIndexEnd();
                                }
                            }
                        })
                        .filter(e => e <= limits[1])
                        .length;

                        let occStart = new OperandOccurenceSpecification();
                        occStart.diagram = inter.diagram;
                        occStart.layer = inter.layer;
                        occStart.lifeline = lifeline;
                        occStart.startsOperand = inter;
                        occStart.lifeline.occurenceSpecifications.splice(startIndex, 0, occStart);
                        
                        let occEnd = new OperandOccurenceSpecification();
                        occEnd.diagram = inter.diagram;
                        occEnd.layer = inter.layer;
                        occEnd.lifeline = lifeline;
                        occEnd.endsOperand = inter;
                        occEnd.lifeline.occurenceSpecifications.splice(endIndex + 1, 0, occEnd);

                        inter.startingOccurences.push(occStart);
                        inter.endingOccurences.push(occEnd);
                        
                    }
                } else {
                    for(let lifeline of cutLifelines){
                        let index = [
                        lifeline.occurenceSpecifications
                        .map(e => {
                            if (e instanceof MessageOccurenceSpecification) {
                                return (e.message.graphicElement as MessageView).getIndex();
                            } else {
                                if (e instanceof OperandOccurenceSpecification) {
                                    if (e.startsOperand) {
                                        return (e.startsOperand.graphicElement as FragmentView).getIndexStart();
                                    }
                                    return (e.endsOperand.graphicElement as FragmentView).getIndexEnd();
                                }
                            }
                        }, []),
                        lifeline.occurenceSpecifications
                        .map(e => {
                            if (e instanceof MessageOccurenceSpecification) {
                                return (e.message.graphicElement as MessageView).position.y;
                            } else {
                                if (e instanceof OperandOccurenceSpecification) {
                                    if (e.startsOperand) {
                                        return (e.startsOperand.graphicElement as FragmentView).getTop();
                                    }
                                    return (e.endsOperand.graphicElement as FragmentView).getBottom();
                                }
                            }
                        }, [])
                        ];

                        function sortFunction(a:number[], b:number[]) {
                            if (a[0] === b[0]) {
                                return 0;
                            }
                            else {
                                return (a[0] < b[0]) ? -1 : 1;
                            }
                        }

                        index.sort(sortFunction);
                        let startIndex = 0, endIndex = 0;
                        for(let i = 0; i < index[0].length; i++) index[0][i] = i;

                        for(let i = 0; i < index[0].length; i++){
                            // console.log(index[0][i]);
                            // console.log(index[1][i] + "<" + firstHit.y);
                            if(index[1][i]<firstHit.y){
                                startIndex = index[0][i];
                                // console.log("START" + startIndex);
                                break;
                            }
                            startIndex = index[0][i] + 1;
                        }

                        for(let i = 0; i < index[0].length; i++){
                            // console.log(index[0][i]);
                            // console.log(index[1][i] + ">" + secondHit.y);
                            if(index[1][i]<secondHit.y){
                                endIndex = index[0][i];
                                // console.log("END" + endIndex);
                                break;
                            }
                            endIndex = index[0][i] + 1;
                        }

                        let occStart = new OperandOccurenceSpecification();
                        occStart.diagram = inter.diagram;
                        occStart.layer = inter.layer;
                        occStart.lifeline = lifeline;
                        occStart.startsOperand = inter;
                        occStart.lifeline.occurenceSpecifications.splice(startIndex, 0, occStart);
                        inter.startingOccurences.push(occStart);
                        // console.log(startIndex);
                        
                        let occEnd = new OperandOccurenceSpecification();
                        occEnd.diagram = inter.diagram;
                        occEnd.layer = inter.layer;
                        occEnd.lifeline = lifeline;
                        occEnd.endsOperand = inter;
                        occEnd.lifeline.occurenceSpecifications.splice(endIndex + 1, 0, occEnd);
                        inter.endingOccurences.push(occEnd);
                        // console.log(endIndex+1);

                    }                    
                }

                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);

                createPopup({
                    Operator: [
                        InteractionOperator.ALT,
                        InteractionOperator.LOOP,
                        InteractionOperator.OPT,
                        InteractionOperator.PAR
                    ],
                    Constraint: null
                })
                .then(({ Operator, Constraint }: { Operator: InteractionOperator, Constraint: string }) => {
                    comb.interactionOperator = Operator;
                    inter.interactionConstraint = Constraint;
                    LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
                });
                
                break;
            }
        }
    },
    (event, hits) => {},
    (event, hits) => {
        // destroy combined fragment view
        newFragView.parent.remove(newFragView);
        newFragView = null;
    },
    (ev, h) => {
        // update combined fragment view
        let castResult = RaycastControl.simpleDefaultIntersect(ev as MouseEvent);
        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                newFragView.redrawByDestination(new Vector3(
                    h.point.x,
                    h.point.y,
                    0
                ));
                break;
            }
        }
    },
    createCombFrag)
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    StateSequence
    .start('DELETE_COMBINED_FRAGMENT')
    .button('sideDeleteFragment', () => {
        $('#sideDeleteFragment').addClass('actv');
    })
    .click((event, hits) => {
        return hits[0] && hits[0].metadata.parent instanceof FragmentView;
    }, (event, hits) => {
        // console.log(hits[0].metadata.parent);
        let fragment = (hits[0].metadata.parent.businessElement as InteractionOperand).parent;
        for (let child of fragment.children) {
            fragment.layer.graphicElement.remove(child.graphicElement);
            for (let occ of child.endingOccurences) {
                occ.lifeline.occurenceSpecifications = occ.lifeline.occurenceSpecifications.filter(e => e != occ);
            }
        }
        for (let occ of fragment.children[0].startingOccurences) {
            occ.lifeline.occurenceSpecifications = occ.lifeline.occurenceSpecifications.filter(e => e != occ);
        }
        if (fragment.parent == null) {
            // root fragment
            fragment.layer.fragments = fragment.layer.fragments.filter(e => e != fragment);
        } else {
            // nonroot fragment
            fragment.parent.children = fragment.parent.children.filter(e => e != fragment);
        }
        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
    })
    .finish(() =>{
        $('.actv').removeClass('actv');
    });

    let addOperand = StateSequence.start('CREATE_INTERACTION_OPERAND')
    .button('sideOperand',()=>{
        $('#sideOperand').addClass('actv');
    });

    let comb: CombinedFragment = null;
    addOperand
    .click((event, hits) => {
         comb = (hits[0].metadata.parent.businessElement as InteractionOperand).parent;
        return hits.length != 0 && hits[0].metadata.parent instanceof FragmentView;        
    }, () => {
        let inter = new InteractionOperand();
        if(comb.interactionOperator == InteractionOperator.ALT || comb.interactionOperator == InteractionOperator.PAR){
            
            inter.interactionConstraint = 'newConstraint';

            inter.diagram = comb.diagram;
            inter.layer = comb.layer;
            inter.parent = comb;
            inter.children = [];
            
            inter.startingOccurences = comb.children[comb.children.length - 1].endingOccurences.map(a => a, []);
            for(let occ of inter.startingOccurences){
                occ.startsOperand = inter;
            }
            inter.endingOccurences = [];
            
            comb.children.push(inter);

            function within(x: number, a: number, b: number) {
                let min = Math.min(a,b);
                let max = Math.max(a,b);
                return x > min && x < max;
            }

            let left = (comb.children[0].graphicElement as FragmentView).getLeft();
            let right = (comb.children[0].graphicElement as FragmentView).getRight();
            let cutLifelines = comb.layer.lifelines.filter(e => within(e.graphicElement.position.x, left, right));
            let endIndex = -1;

            for(let lifeline of cutLifelines){
                for(let i = 0; i < lifeline.occurenceSpecifications.length; i++){
                    let found = inter.startingOccurences.find(e => e == lifeline.occurenceSpecifications[i], null);
                    if(found != null){
                        endIndex = i;
                        break;
                    }
                }

                let occEnd = new OperandOccurenceSpecification();
                occEnd.diagram = inter.diagram;
                occEnd.layer = inter.layer;
                occEnd.lifeline = lifeline;
                occEnd.endsOperand = inter;
                occEnd.lifeline.occurenceSpecifications.splice(endIndex + 1, 0, occEnd);
                inter.endingOccurences.push(occEnd);
            }

            createPopup({
                Operator: [inter.parent.interactionOperator],
                Constraint: null
            })
            .then(({ Operator, Constraint }: { Operator: InteractionOperator, Constraint: string }) => {
                comb.interactionOperator = Operator;
                inter.interactionConstraint = Constraint;
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
            });
            LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
        }

        
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });

    let interToDelete: InteractionOperand;
    let deleteOperand = StateSequence.start('DELETE_INTERACTION_OPERAND')
    .button('sideDeleteOperand',()=>{
        $('#sideDeleteOperand').addClass('actv');
    });

    deleteOperand
    .click((event, hits) => {
        interToDelete = hits[0].metadata.parent.businessElement as InteractionOperand;
        return hits.length != 0 && hits[0].metadata.parent instanceof FragmentView;        
    }, () => {
        comb = interToDelete.parent;
        if(comb.children.length > 1){
            
            if(interToDelete != comb.children[0]){
                if(interToDelete != comb.children[comb.children.length-1]){
                    let nextOperand = comb.children[comb.children.indexOf(interToDelete)+1];
                    nextOperand.startingOccurences = interToDelete.startingOccurences;
                    nextOperand.children = interToDelete.children;
                    for(let occ of interToDelete.startingOccurences){
                        occ.startsOperand = nextOperand;
                    }
                } else {
                    for(let frag of interToDelete.children){
                        frag.parent = interToDelete.parent.parent;
                    }
                    let prevOperand = comb.children[comb.children.indexOf(interToDelete)-1];
                    
                    for(let occ of prevOperand.endingOccurences){
                        occ.startsOperand = null;
                    }
                    
                }

                for(let occ of interToDelete.endingOccurences){
                    occ.lifeline.occurenceSpecifications = occ.lifeline.occurenceSpecifications.filter(e => e != occ);
                } 

                comb.children = comb.children.filter(e => e != interToDelete);
                comb.layer.graphicElement.remove(interToDelete.graphicElement);           
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
            }
        }

        
    })
    .finish(() => {
        $('.actv').removeClass('actv');
    });
}
