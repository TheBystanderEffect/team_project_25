import { StateSequence } from "./StateMachineBuilder";
import { RaycastControl } from "./RaycastControl";
import { GLContext } from "../view/GLContext";

// StateSequence
// .start('CREATE_LIFELINE')
// .button('sideLife')
// .click((e: Event) => {
//     // DETECT RAYCAST ON LIFELINE HERE
//     return false;
// },(e: Event) => {
//     // DIALOG POPUP
// })
// .dialog((dto: any) => {
//     // CREATE LIFELINE HERE
// })
// .finish();

export function initializeStateTransitions() {
    
    let fork: StateSequence =
    StateSequence
    .start('TEST_SEQUENCE')
    .button('sideLife')
    .button('sideMessage');

    fork
    .button('sideLayer')
    .finish(() => {
        console.log('layer lopata');
    });

    fork
    .button('sideLife')
    .finish(() => {
        console.log('lifeline lopata');
    });
}