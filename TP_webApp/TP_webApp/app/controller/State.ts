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

}