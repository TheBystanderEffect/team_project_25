export class StateTransition {
    constructor(_source, _target, _condition, _action) {
        this._source = _source;
        this._target = _target;
        this._condition = _condition;
        this._action = _action;
    }
    get source() {
        return this._source;
    }
    get target() {
        return this._target;
    }
    set source(state) {
        this._source = state;
    }
    set target(state) {
        this._target = state;
    }
    tryAccept(e, hits, eventType) {
        if (!this._condition(e, hits, eventType)) {
            return false;
        }
        this._action(e, hits);
        return true;
    }
}
//# sourceMappingURL=StateTransition.js.map