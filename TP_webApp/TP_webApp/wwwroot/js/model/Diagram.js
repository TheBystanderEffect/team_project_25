"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Diagram = /** @class */ (function () {
    function Diagram() {
    }
    Object.defineProperty(Diagram.prototype, "layers", {
        get: function () {
            return this._layers;
        },
        set: function (layers) {
            this._layers = layers;
        },
        enumerable: true,
        configurable: true
    });
    Diagram.prototype.addLayer = function (layer) {
        this._layers.push(layer);
    };
    return Diagram;
}());
exports.Diagram = Diagram;
//# sourceMappingURL=Diagram.js.map