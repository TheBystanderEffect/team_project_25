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
                let lifelineNew = new Lifeline('Standard name','',[], obj.metadata.parent.parent);
                obj.metadata.parent.parent.AddLifeline(lifelineNew);
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                for (let child of GLContext.instance.scene.children) {
                    GLContext.instance.scene.remove(child);
                }
                GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
    .finish(() => {});
    StateSequence
    .start('CREATE_LIFELINE')
    .button('sideDeleteLife')
    .click((e: Event, h: CustomMesh[]) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    },(e: Event, h: CustomMesh[]) => {

        // TODO refactor this
            console.log(h);
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                // let lifelineNew = new Lifeline('Standard name','',[], obj.metadata.parent.parent);
                // obj.metadata.parent.parent.AddLifeline(lifelineNew);
                obj.metadata.parent.parent.delete();    
                // for (let element of obj.metadata.parent.parent.layer.lifelines) {
                //     if (element == obj.metadata.parent.parent) {
                //         console.log(element )
                //     }
                // }
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                for (let child of GLContext.instance.scene.children) {
                    GLContext.instance.scene.remove(child);
                }
                GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
    .finish(() => {});
}