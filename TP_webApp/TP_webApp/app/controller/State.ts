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

        // TODO add state duplication logic

        return newState;
    }

    public get outgoingTransitions(): StateTransition[] {
        return Object.keys(this._outgoingTransitions).map((e: string) => this._outgoingTransitions[e]);
    }

    public registerOutgoingTransition(transition: StateTransition): void {
        if (this._outgoingTransitions[transition.source.code] != null) {
            throw new Error(`State transition already exists from ${this.code}`);
        }
        this._outgoingTransitions[transition.source.code] = transition;
    }

    public registerIncomingTransition(transition: StateTransition): void {
        if (this._incomingTransitions[transition.target.code] != null) {
            throw new Error(`State transition already exists to ${this.code}`);
        }
        this._incomingTransitions[transition.target.code] = transition;
    }

}