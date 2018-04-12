import { State } from "./State";
import { StateTransition } from "./StateTransition";
import { Curve, Event } from "three";
import { CustomMesh } from "../view/CustomMesh";
import { EventType, EventBus } from "./EventBus";

export const stateNeutral: State = new State('NEUTRAL');
export const stateButton: State = new State('BUTTON');
export const stateClicked: State = new State('CLICKED');
export const stateDragged: State = new State('DRAGGED');
export const stateDialog: State = new State('DIALOG');
export const stateClickedInternal: State = new State('CLICK_INTERNAL');
export const stateKeyPressed: State = new State('KEY_PRESSED');

let isSettingEscape: boolean = false;

export class StateSequence {

    private order: number = 0;
    private linked: boolean = false;
    private state: State = null;
    private condition: (event: Event, hits: CustomMesh[], eventType: EventType) => boolean = () => true;
    private action: (event: Event, hits: CustomMesh[]) => void = () => {
        throw new Error("State transition with default action");
    };

    public static start(name: string): StateSequence {
        let newSeq = new StateSequence(name, [], null);
        newSeq.state = stateNeutral;
        newSeq.linked = true;
        return newSeq;
    }

    private constructor(private name: string, private sequencePool: StateSequence[], private sourceState: State) {
        sequencePool.push(this);
    }

    public click(condition: (event: Event, hits: CustomMesh[]) => boolean, action: (event: Event, hits: CustomMesh[]) => void): StateSequence {
        let newSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateClicked.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event: Event, hits: CustomMesh[], eventType: EventType) => {
            return eventType == EventType.MOUSE_DOWN && condition(event, hits);
        };
        newSeq.action = action;
        newSeq.order = this.order + 1;

        newSeq.escape();

        return newSeq;
    }

    public drag(condition: (event: Event, hits: CustomMesh[]) => boolean, 
                success: (event: Event, hits: CustomMesh[]) => void, 
                failure: (event: Event, hits: CustomMesh[]) => void, 
                cleanup: (event: Event, hits: CustomMesh[]) => void,
                update: (event: Event, hits: CustomMesh[]) => void,
                fallbackState: StateSequence
            ): StateSequence {

        let newSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateDragged.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event: Event, hits: CustomMesh[], eventType: EventType) => {
            return eventType == EventType.MOUSE_UP && condition(event, hits);
        };
        newSeq.action = (e, h) => { success(e,h); cleanup(e,h); };

        let failSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        failSeq.state = fallbackState.state;
        failSeq.condition = (event: Event, hits: CustomMesh[], eventType: EventType) => {
            return eventType == EventType.MOUSE_UP && !condition(event, hits);
        };
        failSeq.action = (e, h) => { failure(e,h); cleanup(e,h); };

        let updateSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        updateSeq.state = this.state;
        updateSeq.condition = (event: Event, hits: CustomMesh[], eventType: EventType) => eventType == EventType.MOUSE_MOVE;
        updateSeq.action = update;

        return newSeq;
    }

    private mousemove(fallback: State, callback: (event: Event, hits: CustomMesh[]) => void): StateSequence {
        let newSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = null;

        return null;
    }

    public button(buttonId: string, action: () => void = () => {}): StateSequence {
        let newSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateButton.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event: Event, hits: any, eventType: EventType) => eventType == EventType.BUTTON && event.target.id == buttonId;
        newSeq.action = action;
        newSeq.order = this.order + 1;

        newSeq.escape();
        return newSeq;
    }

    public dialog(callback: (dto: any) => void): StateSequence {
        throw new Error("Not implemented yet");
    }

    public keypressed(condition: (event: Event, hits: CustomMesh[]) => boolean, action: (event: Event, hits: CustomMesh[]) => void): StateSequence {
        let newSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateKeyPressed.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event: Event, hits: CustomMesh[], eventType: EventType) => {
            return eventType == EventType.KEY_PRESSED && condition(event, hits);
        };
        newSeq.action = action;
        newSeq.order = this.order + 1;

        newSeq.escape();

        return newSeq;
    }

    private escape(): void {
        if (!isSettingEscape) {
            isSettingEscape = true;
            this
            .keypressed((e: any) => {
                return e.keyCode == 27
            }, (e: Event) => {
            })
            .finish(() => {});
            isSettingEscape = false;
        }
    }

    public finish(action: (event: Event, hits: CustomMesh[]) => void): void {
        let newSeq: StateSequence = new StateSequence(this.name, this.sequencePool, this.state);
        newSeq.state = stateNeutral;
        newSeq.condition = (event: Event, hits: any, eventType: EventType) => eventType == EventType.SCENE_UPDATE;
        newSeq.action = action;
        newSeq.order = this.order + 1;
        for (let seq of this.sequencePool) {
            seq.link();
        }
    }

    public timer(timeout: number, callback: () => void): StateSequence {
        throw new Error("Not implemented yet");

        //dont forget to check if we are in original state at callback execution
    }

    private link(): void {

        if (this.linked) {
            return;
        }

        let transition = new StateTransition(this.sourceState, this.state, this.condition, this.action);
        transition.source.registerOutgoingTransition(transition);
        transition.target.registerIncomingTransition(transition);
        this.linked = true;
    }

}