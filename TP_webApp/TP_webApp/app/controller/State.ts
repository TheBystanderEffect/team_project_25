import { StateTransition } from "./StateTransition";

export class State {

    public constructor(
        private _code: string
    )
    {}

    private _incomingTransitions: StateTransition[] = [];
    private _outgoingTransitions: StateTransition[] = [];

    private _handlers: (() => StateTransition)[] = [];

    public get code(): string {
        return this._code;
    }

    public specialize(specializationCode: string): State {
        let newState = new State(this.code + '_' + specializationCode);

        // TODO add state duplication logic

        return newState;
    }

    public get outgoingTransitions(): StateTransition[] {
        return this._outgoingTransitions;
    }

    public get incomingTransitions(): StateTransition[] {
        return this._incomingTransitions;
    }

    public registerOutgoingTransition(transition: StateTransition): void {
        this.outgoingTransitions.push(transition);
    }

    public registerIncomingTransition(transition: StateTransition): void {
        this.incomingTransitions.push(transition);
    }

}