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
import { Message } from "../model/Message";
import { OccurenceSpecification } from "../model/OccurenceSpecification";
import { CommunicationController } from "./CommunicationController";
import { Serializer } from "./Serializer";
import { Layer } from "../model/Layer";
import { BusinessElement } from "../model/BusinessElement";
import { GraphicElement } from "../view/GraphicElement";

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
    },(e: Event, h: CustomMesh[]) => {

        // TODO refactor this

        for (let obj of h) {
            if (obj.metadata.parent instanceof LayerView) {
                let lifelineNew = new Lifeline('Standard name','',[], obj.metadata.parent.businessElement);
                obj.metadata.parent.businessElement.AddLifeline(lifelineNew);
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
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
                obj.metadata.parent.businessElement.delete();        
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
    .finish(() => {});

    let startLifeline: Lifeline = null;

    StateSequence
    .start('CREATE_MESSAGE')
    .button('sideMessage')
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
                startLifeline = obj.metadata.parent.businessElement;
                break;
            }
        }
    })
    .click((e: Event, h: CustomMesh[]) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                let endLifeline: Lifeline = obj.metadata.parent.businessElement;
                return startLifeline != endLifeline;
            }
        }
        return false;
    },(e: Event, h: CustomMesh[]) => {

        // TODO refactor this

        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {

                let endLifeline: Lifeline = obj.metadata.parent.businessElement;
                
                let startOcc: OccurenceSpecification = new OccurenceSpecification(startLifeline, null);
                let endOcc: OccurenceSpecification = new OccurenceSpecification(endLifeline, null);

                let msg: Message = new Message('new msg', null, null, startOcc, endOcc);
                startOcc.message = msg;
                endOcc.message = msg;

                startOcc.at = startLifeline;
                endOcc.at = endLifeline;

                startLifeline.occurenceSpecifications.push(startOcc);
                endLifeline.occurenceSpecifications.push(endOcc);

                startLifeline.layer.AddMessage(msg);

                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);

                break;
            }
        }
    })
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
                obj.metadata.parent.businessElement.delete();
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
            CommunicationController.instance.saveDiagram(Serializer.instance.serialize(Globals.CURRENTLY_OPENED_DIAGRAM, true), () => { });
            Globals.setDiagramSaved(true);
        });
  
    StateSequence
    .start('CREATE_LAYER')
    .button('sideLayer')
    .finish(() => {
        Globals.CURRENTLY_OPENED_DIAGRAM.addLayer(new Layer([], [], []));
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
                Globals.CURRENTLY_OPENED_DIAGRAM.diagramView.remove(lay.graphicElement);
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
        movedMessage.parentLayer.messages.sort((a,b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        movedMessage.start.at.occurenceSpecifications.sort((a,b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        movedMessage.end.at.occurenceSpecifications.sort((a,b) => {
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
        movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        lastOffsetY = (ev as MouseEvent).offsetY;
    },
    moveLifelineStart)
    .finish(() => {});
}