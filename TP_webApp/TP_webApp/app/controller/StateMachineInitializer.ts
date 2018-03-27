import { StateSequence } from "./StateMachineBuilder";
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
import { Message, StoredMessage, MessageKind } from "../model/Message";
import { OccurenceSpecification, MessageOccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
import { CommunicationController } from "./CommunicationController";
import { Serializer } from "./Serializer";
import { Layer } from "../model/Layer";
import { BusinessElement } from "../model/BusinessElement";
import { GraphicElement } from "../view/GraphicElement";
import { Vector3, Vector2 } from "three";
import { createPopup } from "../view/Popup";
import { State } from "./State";

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
    .button('sideLife')
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

                    LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                });
                break;
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
    .finish(() => {});

    StateSequence
    .start('DELETE_LIFELINE')
    .button('sideDeleteLife')
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
                
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
            }
        }
    })
    .finish(() => {});

    let startLifeline: Lifeline = null;
    let endLifeline: Lifeline = null;
    let newMsg = new StoredMessage();
    newMsg.name = '[Animation]';
    let newMessageView: MessageView = new MessageView(newMsg);

    let createMessagePreDrag = StateSequence
    .start('CREATE_MESSAGE')
    .button('sideMessage');
    
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
        //onsuccess                
        let startOcc = new MessageOccurenceSpecification();
        let endOcc = new MessageOccurenceSpecification();

        startOcc.diagram = startLifeline.diagram;
        endOcc.diagram = endLifeline.diagram;

        startOcc.layer = startLifeline.layer;
        endOcc.layer = endLifeline.layer;

        let msg = new StoredMessage();

        msg.diagram = startLifeline.diagram;
        msg.layer = startLifeline.layer;
        msg.name = 'new msg';
        msg.kind = MessageKind.SYNC_CALL;
        
        msg.start = startOcc;
        msg.end = endOcc;

        startOcc.message = msg;
        endOcc.message = msg;

        startOcc.lifeline = startLifeline;
        endOcc.lifeline = endLifeline;

        startLifeline.occurenceSpecifications.push(startOcc);
        endLifeline.occurenceSpecifications.push(endOcc);

        startLifeline.layer.messages.push(msg);

        // hold my beer
        msg.graphicElement = newMessageView;

        msg.layer.messages.sort((a,b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        (msg.start.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        (msg.end.lifeline.occurenceSpecifications as MessageOccurenceSpecification[]).sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });

        msg.graphicElement = null;

        createPopup({ Name: null, Type: [
            MessageKind.SYNC_CALL,
            MessageKind.ASYNC_CALL,
            MessageKind.RETURN
        ]}).then(({ Name, Type }: { Name: string, Type: MessageKind }) => {
            msg.name = Name;
            msg.kind = Type;
            LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
        });
                
    },
    (ev, hits) => {
        //onfail
    },
    (ev, hits) => {
        //cleanup
        startLifeline = null;
        endLifeline = null;
        holdLifelineView =null;

        newMessageView.position.setY(10000); //advanced programing technique
        newMessageView.parent.remove(newMessageView);
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
    .finish(() => {});

    StateSequence
    .start('DELETE_MESSAGE')
    .button('sideDeleteMessage')
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

                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }

    })
    .finish(() =>{})

    StateSequence
        .start("SAVE_DIAGRAM")
        .button('saveDiagram')
        .finish(() => {
            CommunicationController.instance.saveDiagram(Globals.CURRENTLY_OPENED_DIAGRAM);
            Globals.setDiagramSaved(true);
        });
  
    StateSequence
    .start('CREATE_LAYER')
    .button('sideLayer')
    .finish(() => {
        let layer = new Layer();

        layer.diagram = Globals.CURRENTLY_OPENED_DIAGRAM;

        Globals.CURRENTLY_OPENED_DIAGRAM.layers.push(layer);
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    });

    StateSequence
    .start('DELETE_LAYER')
    .button('sideDeleteLayer')
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

                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);

                break;
            }
    }})
    .finish(()=>{});


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
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
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
        lastOffsetX = (ev as MouseEvent).offsetX;
    },
    moveLifelineStart)
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
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
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

    let lifelineRenamed: Lifeline = null;
    StateSequence
    .start('RENAME_LIFELINE')
    .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof LifelineView;
    }, (event, hits) => {
        lifelineRenamed = hits[0].metadata.parent.businessElement;
    })
    .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent == lifelineRenamed.graphicElement;
    }, () => {
        let rename = lifelineRenamed;
        createPopup({ Name: rename.name }).then(({ Name }: { Name: string }) => {
            rename.name = Name;
            LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
        });
    })
    .finish(() => {});

    let messageRenamed: Message = null;
    StateSequence
    .start('RENAME_MESSAGE')
    .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof MessageView;
    }, (event, hits) => {
        messageRenamed = hits[0].metadata.parent.businessElement;
    })
    .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent == messageRenamed.graphicElement;
    }, () => {
        let rename = messageRenamed;
        createPopup({ Name: rename.name, Type: [
            MessageKind.SYNC_CALL,
            MessageKind.ASYNC_CALL,
            MessageKind.RETURN
        ] }).then(({ Name, Type }: { Name: string, Type: MessageKind }) => {
            rename.name = Name;
            rename.kind = Type;
            LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
        });
    })
    .finish(() => {});
}