import { StateSequence } from "./StateMachineBuilder";
import { RaycasterControl } from "./RaycastControl";
import { GLContext } from "../view/GLContext";

new StateSequence('CREATE_LIFELINE')
.button('sideMessage')
.click((e: Event) => {
    // DETECT RAYCAST ON LIFELINE HERE
    return false;
},(e: Event) => {
    // CREATE LIFELINE HERE
})
.finish();