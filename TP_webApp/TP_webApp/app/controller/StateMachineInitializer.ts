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
import { Vector3, Vector2 } from "three";
import { FragmentView } from "../view/FragmentView";
import { InteractionOperand } from "../model/InteractionOperand";
import { InteractionOperator, CombinedFragment } from "../model/CombinedFragment";
import { Lens } from "ramda/index";
import { CameraControls } from "../view/CameraControls";
import * as Config from "../config";
import { createPopup } from "../view/Popup";
import { State } from "./State";
import * as $ from 'jquery';

// StateSequence
// .start('CREATE_LIFELINE')
// .button('sideLife')
// .click((e: Event) => {
//     // DETECT RAYCAST ON LIFELINE HERE``
//     return false;
// },(e: Event) => {
//     // DIALOG POPUP
// })
// .dialog((dto: any) => {
//     // CREATE LIFELINE HERE
// })
// .finish();

export function initializeStateTransitions() {
    
    // StateSequence
    // .start('TEST_SEQUENCE')
    // .button('sideLife')
    // .button('sideMessage')
    // .click((e: MouseEvent, hits: CustomMesh[]) => {
    //     return true;
    // }, (e: MouseEvent, hits: CustomMesh[]) => {
    //     console.log('Hits by raycast:')
    //     console.log(hits);
    // })
    // .finish(() => {
    //     console.log('layer lopata');
    // });

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
        $('#sideLife').removeClass('actv');
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

                for (let occurence of lifeline.occurenceSpecifications) {

                    if (occurence instanceof MessageOccurenceSpecification) {
                        toRemove.push(occurence.message.start, occurence.message.end);
                        toRemoveMessages.push(occurence.message);

                    } else if (occurence instanceof OperandOccurenceSpecification) {
                        // TODO
                    }
                    
                }

                for (let occ of toRemove) {
                    occ.lifeline.occurenceSpecifications.splice(occ.lifeline.occurenceSpecifications.indexOf(occ), 1);
                }

                for (let msg of toRemoveMessages) {
                    msg.layer.messages.splice(msg.layer.messages.indexOf(msg), 1);
                    msg.graphicElement.parent.remove(msg.graphicElement);
                }
                
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
            }
        }
    })
    .finish(() => {
        $('#sideDeleteLife').removeClass('actv');
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
            if (obj.parent instanceof LifelineView) {
                holdLifelineView = obj.parent;
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
            if (obj.parent instanceof LifelineView) {
                endLifeline = obj.parent.businessElement;
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

            msg.layer.messages.sort((a,b) => {
                return -(a.graphicElement.position.y - b.graphicElement.position.y);
            });
            (msg.start.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
                return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
            });
            (msg.end.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
                return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
            });

            //msg.graphicElement = null;
            newMessageView = new MessageView(newMsg);
            newMessageView.shouldAnimate = false;
            //holdLifelineView.parent.add(newMessageView);
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
    $('#sideMessage').removeClass('actv');
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
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }

    })
    .finish(() =>{
        $('#sideDeleteMessage').removeClass('actv');
    })

    StateSequence
        .start("SAVE_DIAGRAM")
        .button('saveDiagram',()=>{
            $('#saveDiagram').addClass('actv');
        })
        .finish(() => {
            CommunicationController.instance.saveDiagram(Globals.CURRENTLY_OPENED_DIAGRAM);
            Globals.setDiagramSaved(true);
            $('#saveDiagram').removeClass('actv');
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
        $('#sideLayer').removeClass('actv');
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
        $('#sideDeleteLayer').removeClass('actv');
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

        //TODO occurence specifications need to be updated to be linked with the changed lifeline

        movedMessage.layer.messages.sort((a,b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        (movedMessage.start.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        (movedMessage.end.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });

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

        //TODO occurence specifications need to be updated to be linked with the changed lifeline

        movedMessage.layer.messages.sort((a,b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        (movedMessage.start.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        (movedMessage.end.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });

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
        movedMessage.layer.messages.sort((a,b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        (movedMessage.start.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        (movedMessage.end.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
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
        //movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        (movedMessage.graphicElement as MessageView).source.y = (movedMessage.graphicElement as MessageView).source.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        (movedMessage.graphicElement as MessageView).destination.y = (movedMessage.graphicElement as MessageView).destination.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        
        lastOffsetY = (ev as MouseEvent).offsetY;
    },
    moveMessageStart)
    .finish(() => { });

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
        $('#rename').removeClass('actv');
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
    .finish(() => {});

    let firstHit: Vector3;

    StateSequence
    .start('CREATE_COMBINED_FRAGMENT')
    .button('sideFragment')
    .click((event, hits) => {
        return hits[0] && hits[0].metadata.parent instanceof LayerView;
    }, (event, hits) => {
        let castResult = RaycastControl.simpleDefaultIntersect(event as MouseEvent);
        for (let h of castResult){
            if(h.object.parent instanceof LayerView){
                firstHit = h.point;
                break;
            }
        }
    })
    .click((event, hits) => {
        return hits[0] && hits[0].metadata.parent instanceof LayerView;
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
                                if (isInsideInteractionOperand(firstHit, secondHit, operand)) {
                                    return recursive(operand);
                                }
                            }
                            
                        }
                        return parent;
                }

                let result = recursive(layer);  
                let resultChildren = 
                (result instanceof Layer ? result.fragments : result.children)
                .filter(e => isOutsideCombinedFragment(firstHit, secondHit, e));

                let childMessages = layer.messages.filter(e => isAroundMessage(firstHit, secondHit, e));

                let cutLifelines = layer.lifelines.filter(e => within(e.graphicElement.position.x, firstHit.x, secondHit.x));

                // console.log(result);            ///Parrent
                // console.log(resultChildren);    ///Children
                // console.log(childMessages);     ///Messages
                // console.log(cutLifelines);      ///Lifelines
                
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
                comb.interactionOperator = InteractionOperator.OPT;
                comb.diagram = layer.diagram;
                comb.layer = layer;
                comb.parent = result instanceof InteractionOperand ? result : null;

                if (comb.parent == null) {
                    comb.layer.fragments.push(comb);
                } else {
                    comb.parent.children.push(comb);
                }

                let inter = new InteractionOperand();
                inter.interactionConstraint = 'newConstraint';

                inter.diagram = comb.diagram;
                inter.layer = comb.layer;
                inter.parent = comb;
                inter.children = resultChildren;

                inter.startingOccurences = [];
                inter.endingOccurences = [];

                comb.children = [ inter ];

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
                

                // for(let m of childMessages){
                //     let start = (m.start.lifeline.graphicElement as LifelineView).source.clone();
                //     start.y += -Config.firstMessageOffset-Config.messageOffset*(m.graphicElement as MessageView).getIndex();
                //     console.log(m.graphicElement.position.y);
                //     console.log(start);
                // }

                // let start = 1000;
                // let end = -1000;
                // for(let l of cutLifelines){
                //     for(let o of l.occurenceSpecifications){
                //         if(o instanceof MessageOccurenceSpecification){
                //             if(o.message.graphicElement.position.y+Config.firstMessageOffset > firstHit.y){
                //                 // console.log(o.message.graphicElement.position.y);
                //                 start = (o.message.graphicElement as MessageView).getIndex();
                //             }
                //         } else {
                //             if(o instanceof OperandOccurenceSpecification){
                //                 if(o.endsOperand){
                //                     console.log((o.endsOperand.graphicElement as FragmentView).getBottom());
                //                     // console.log((o.endsOperand.graphicElement as FragmentView).getIndexEnd());
                                    
                //                 } else {
                //                     console.log((o.startsOperand.graphicElement as FragmentView).getTop());
                //                     // console.log(o.startsOperand.parent);
                //                 }                          
                //             }
                //         }
                //     }
                // }
                // console.log("");
                
                // console.log(start);
                
                // console.log(newStartOccurenceIndex);
                
                
                break;
            }
        }
    })
    .finish(() => {});

    StateSequence
    .start('DELETE_COMBINED_FRAGMENT')
    .button('sideDeleteFragment')
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
    .finish(() =>{});


}
