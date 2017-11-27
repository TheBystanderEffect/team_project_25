import { StateTransition } from "./StateTransition";

export class State {

    public constructor(
        private _code: string
    )
    {}

    private _incomingTransitions: { [ stateCode: string ]: StateTransition } = {};
    private _outgoingTransitions: { [ stateCode: string ]: StateTransition } = {};

    private _handlers: (() => StateTransition)[] = [];

    public get code(): string {
        return this._code;
    }

    public specialize(specializationCode: string): State {
        let newState = new State(this.code + '_' + specializationCode);

        // add state duplication logic

        return newState;
    }

    public get outgoingTransitions(): StateTransition[] {
        return Object.keys(this._outgoingTransitions).map((e: string) => this._outgoingTransitions[e]);
    }

    public registerOutgoingTransition(transition: StateTransition): void {
        if (this._outgoingTransitions[transition.source.code] != null) {
            throw new Error("State transition already exists");
        }
        this._outgoingTransitions[transition.source.code] = transition;
    }

    public registerIncomingTransition(transition: StateTransition): void {
        if (this._outgoingTransitions[transition.target.code] != null) {
            throw new Error("State transition already exists");
        }
        this._outgoingTransitions[transition.target.code] = transition;
    }

}