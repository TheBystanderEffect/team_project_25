export class BusinessElement {
    get graphicElement() {
        return this._graphicElement;
    }
    set graphicElement(graphicElement) {
        this._graphicElement = graphicElement;
    }
    toJSON() {
        let obj = {};
        for (let key in Object.keys(this)) {
            if (key != '_diagramView' && key != '_graphicElement') {
                obj[key] = this[key];
            }
        }
        obj._graphicElement = undefined;
        return JSON.stringify(obj);
    }
}
//# sourceMappingURL=BusinessElement.js.map