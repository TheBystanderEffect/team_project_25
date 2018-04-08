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
import { Message, StoredMessage, MessageKind } from "../model/Message";
import { OccurenceSpecification, MessageOccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
import { CommunicationController } from "./CommunicationController";
import { Serializer } from "./Serializer";
import { Layer } from "../model/Layer";
import { BusinessElement } from "../model/BusinessElement";
import { GraphicElement } from "../view/GraphicElement";
import { Vector3, Vector2 } from "three";
import { CameraControls } from "../view/CameraControls";
import * as Config from "../config";
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
                
                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
            }
        }
    })
    .finish(() => {});

    let startLifeline: Lifeline = null;
    let endLifeline: Lifeline = null;
    let newMsg = new StoredMessage();
    newMsg.name = '[Animation]';
    let newMessageView: MessageView = new MessageView(newMsg);
    newMessageView.shouldAnimate = false;

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

                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
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
        LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);
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

                LayoutControl.layout(Globals.CURRENTLY_OPENED_DIAGRAM);

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
    .button('rename');

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
    .finish(() => {});

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

    StateSequence
    .start('ZoomToLayer')
    .button('lookAtLayer')
    .click((event, hits)=>{
        for(let hit of hits){
            if(hit.parent instanceof LayerView)
            return true;
        }
        return false
    },(event, hits)=>{
        for(let hit of hits){
            if(hit.parent instanceof LayerView){
                let layer:Layer = hit.parent.businessElement as Layer;
                let layerView = layer.graphicElement as LayerView;
                let layerRectangle = layerView.getRectangleCenter();
                GLContext.instance.cameraControls.loadViewpoint(layerRectangle.x, layerRectangle.y, layerView.position.z + Config.layerOffset, 0, 0)
                break;
            }
        }
    })
    .finish(()=>{});
}
