import { State } from "./State";
import { StateTransition } from "./StateTransition";
import { Curve } from "three";

const stateNeutral: State = new State('NEUTRAL');
const stateButton: State = new State('BUTTON');
const stateClicking: State = new State('CLICKING');
const stateDragging: State = new State('DRAGGING');
const stateText: State = new State('TEXT');

export class StateSequence {

    public constructor(private name: string) {

    }

    private currentState: State = null;
    private currentTransition: StateTransition = null;

    private addState() {

    }

    public click(condition: (event: Event) => boolean, action: (event: Event) => void): StateSequence {
        throw new Error("Not implemented yet");
    }

    public drag(condition: (event: Event) => boolean, action: (event: Event) => void): StateSequence {
        throw new Error("Not implemented yet");
    }

    public button(buttonId: string): StateSequence {
        throw new Error("Not implemented yet");
    }

    public text(): StateSequence {
        throw new Error("Not implemented yet");
    }

    public finish(): void {
        throw new Error("Not implemented yet");
    }

}