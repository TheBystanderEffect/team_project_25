export class Layer {
    constructor(lifelines, combinedFragments, messages) {
        this.lifelines = lifelines;
        this.combinedFragments = combinedFragments;
        this.messages = messages;
    }
    AddMessage(message) {
        this.messages.push(message);
    }
    AddLifeline(lifelines) {
        this.lifelines.push(lifelines);
    }
}
//# sourceMappingURL=Layer.js.map