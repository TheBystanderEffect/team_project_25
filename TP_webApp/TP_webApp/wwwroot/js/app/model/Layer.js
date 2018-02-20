import { BusinessElement } from "./BusinessElement";
export class Layer extends BusinessElement {
    constructor(lifelines, combinedFragments, messages) {
        super();
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
    lopata() {
        console.log("TEST SUCCESS!");
    }
}
//# sourceMappingURL=Layer.js.map