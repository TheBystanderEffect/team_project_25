export class Layer {
    constructor(lifelines, combinedFragments, messages, position) {
        this.lifelines = lifelines;
        this.combinedFragments = combinedFragments;
        this.messages = messages;
        this.position = position;
    }
    AddMessage(message) {
        this.messages.push(message);
    }
}
//# sourceMappingURL=Layer.js.map