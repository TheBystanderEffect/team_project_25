import { State } from "./State";
import { StateTransition } from "./StateTransition";
import { Curve } from "three";
import { CustomMesh } from "../view/CustomMesh";

export const stateNeutral: State = new State('NEUTRAL');
export const stateButton: State = new State('BUTTON');
export const stateClicked: State = new State('CLICKED');
export const stateDragged: State = new State('DRAGGED');
export const stateDialog: State = new State('DIALOG');

export class StateSequence {

    private order: number = 0;
    private linked: boolean = false;
    private state: State = null;
    private condition: (event: Event, hits: CustomMesh[]) => boolean = () => true;
    private action: (event: Event, hits: CustomMesh[]) => void = () => {
        throw new Error("State transition with default action");
    };

    public static start(name: string): StateSequence {
        let newSeq = new StateSequence(name, null);
        newSeq.state = stateNeutral;
        newSeq.linked = true;
        return newSeq;
    }

    private constructor(private name: string, private preceding: StateSequence) {
    }

    public click(condition: (event: Event, hits: CustomMesh[]) => boolean, action: (event: Event, hits: CustomMesh[]) => void): StateSequence {
        let newSeq: StateSequence = new StateSequence(this.name, this);
        newSeq.state = stateClicked.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = condition;
        newSeq.action = action;
        newSeq.order = this.order + 1;
        return newSeq;
    }

    public drag(condition: (event: Event) => boolean, action: (event: Event) => void, cleanup: (event: Event) => void): StateSequence {
        throw new Error("Not yet implemented");
        // let newSeq: StateSequence = new StateSequence(this.name, this);
        // newSeq.state = stateDragged.specialize(newSeq.name + '_' + this.order);
        // newSeq.condition = condition;
        // newSeq.action = action;
        // newSeq.order = this.order + 1;
        // // TODO add cleanup
        // return newSeq;
    }

    public button(buttonId: string): StateSequence {
        let newSeq: StateSequence = new StateSequence(this.name, this);
        newSeq.state = stateButton.specialize(newSeq.name + '_' + this.order);
        newSeq.condition = (event: Event) => (event.target as HTMLButtonElement).id == buttonId;
        newSeq.action = () => {};
        newSeq.order = this.order + 1;
        return newSeq;
    }

    public dialog(callback: (dto: any) => void): StateSequence {
        throw new Error("Not implemented yet");
    }

    public finish(action: (event: Event, hits: CustomMesh[]) =>  void): void {
        this.state = stateNeutral;
        let thisAct = this.action;
        this.action = (event: Event, hits: CustomMesh[]) => {
            thisAct(event, hits);
            action(event, hits);
        };
        this.link();
    }

    private link(): void {

        if (this.linked) {
            return;
        }

        let transition = new StateTransition(this.preceding.state, this.state, this.condition, this.action);
        transition.source.registerOutgoingTransition(transition);
        transition.target.registerIncomingTransition(transition);
        this.linked = true;
        this.preceding.link();
    }

}