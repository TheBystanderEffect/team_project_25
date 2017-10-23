"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layer = /** @class */ (function () {
    function Layer(lifelines, combinedFragments, messages, position) {
        this.lifelines = lifelines;
        this.combinedFragments = combinedFragments;
        this.messages = messages;
        this.position = position;
    }
    Layer.prototype.AddMessage = function (message) {
        this.messages.push(message);
    };
    return Layer;
}());
exports.Layer = Layer;
//# sourceMappingURL=Layer.js.map