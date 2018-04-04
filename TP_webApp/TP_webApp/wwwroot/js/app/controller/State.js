export class State {
    constructor(_code) {
        this._code = _code;
        this._incomingTransitions = [];
        this._outgoingTransitions = [];
        this._handlers = [];
    }
    get code() {
        return this._code;
    }
    specialize(specializationCode) {
        let newState = new State(this.code + '_' + specializationCode);
        // TODO add state duplication logic
        return newState;
    }
    get outgoingTransitions() {
        return this._outgoingTransitions;
    }
    get incomingTransitions() {
        return this._incomingTransitions;
    }
    registerOutgoingTransition(transition) {
        this.outgoingTransitions.push(transition);
    }
    registerIncomingTransition(transition) {
        this.incomingTransitions.push(transition);
    }
}
//# sourceMappingURL=State.js.map