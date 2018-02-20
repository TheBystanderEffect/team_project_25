import { BusinessElement } from "./BusinessElement";
export class Lifeline extends BusinessElement {
    constructor(name, type, occurence, layer) {
        super();
        this.name = name;
        this.type = type;
        this.layer = layer;
        this.occurenceSpecifications = occurence;
    }
    get lable() {
        return this._lable;
    }
    set lable(lable) {
        this._lable = lable;
    }
    get layer() {
        return this._layer;
    }
    set layer(v) {
        this._layer = v;
    }
    AddOccurenceSpecification(occurenceSpecification) {
        this.occurenceSpecifications.push(occurenceSpecification);
    }
    delete() {
        console.log(this.layer.messages);
        for (let message of this.occurenceSpecifications.map(e => e.message)) {
            console.log("BLABAAARAGs");
            message.start.at.occurenceSpecifications.splice(message.start.at.occurenceSpecifications.indexOf(message.start), 1);
            message.end.at.occurenceSpecifications.splice(message.end.at.occurenceSpecifications.indexOf(message.end), 1);
            this.layer.messages.splice(this.layer.messages.indexOf(message), 1);
            console.log(message.graphicElement);
            this.layer.graphicElement.remove(message.graphicElement);
        }
        this.layer.lifelines.splice(this.layer.lifelines.indexOf(this), 1);
        this.layer.graphicElement.remove(this.graphicElement);
    }
}
//# sourceMappingURL=Lifeline.js.map