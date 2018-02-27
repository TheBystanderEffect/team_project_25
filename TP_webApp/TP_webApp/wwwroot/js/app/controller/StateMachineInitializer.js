import { StateSequence } from "./StateMachineBuilder";
import { LayerView } from "../view/LayerView";
import { Lifeline } from "../model/Lifeline";
import { LayoutControl } from "./LayoutControl";
import * as Globals from '../globals';
import { LifelineView } from "../view/LifelineView";
import { MessageView } from "../view/MessageView";
import { Message } from "../model/Message";
import { OccurenceSpecification } from "../model/OccurenceSpecification";
import { CommunicationController } from "./CommunicationController";
import { Serializer } from "./Serializer";
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
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
        // TODO refactor this
        for (let obj of h) {
            if (obj.metadata.parent instanceof LayerView) {
                let lifelineNew = new Lifeline('Standard name', '', [], obj.metadata.parent.businessElement);
                obj.metadata.parent.businessElement.AddLifeline(lifelineNew);
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
        .finish(() => { });
    StateSequence
        .start('DELETE_LIFELINE')
        .button('sideDeleteLife')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
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
        .finish(() => { });
    let startLifeline = null;
    StateSequence
        .start('CREATE_MESSAGE')
        .button('sideMessage')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
        // TODO refactor this
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                startLifeline = obj.metadata.parent.businessElement;
                break;
            }
        }
    })
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                let endLifeline = obj.metadata.parent.businessElement;
                return startLifeline != endLifeline;
            }
        }
        return false;
    }, (e, h) => {
        // TODO refactor this
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                let endLifeline = obj.metadata.parent.businessElement;
                console.log('Start: ' + startLifeline.name + ' End: ' + endLifeline.name);
                let startOcc = new OccurenceSpecification(startLifeline, null);
                let endOcc = new OccurenceSpecification(endLifeline, null);
                let msg = new Message('new msg', null, null, startOcc, endOcc);
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
        .finish(() => { });
    StateSequence
        .start('DELETE_MESSAGE')
        .button('sideDeleteMessage')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof MessageView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
        //console.log(h)
        for (let obj of h) {
            if (obj.metadata.parent instanceof MessageView) {
                console.log('AHA! lopata');
                console.log(obj.metadata.parent.businessElement);
                obj.metadata.parent.businessElement.delete();
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
        .finish(() => { });
    StateSequence
        .start("SAVE_DIAGRAM")
        .button('saveDiagram')
        .finish(() => {
        CommunicationController.instance.saveDiagram(Serializer.instance.serialize(Globals.CURRENTLY_OPENED_DIAGRAM, true), () => { });
    });
}
//# sourceMappingURL=StateMachineInitializer.js.map