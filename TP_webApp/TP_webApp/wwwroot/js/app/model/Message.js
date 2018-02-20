var kinds;
(function (kinds) {
    kinds[kinds["complete"] = 0] = "complete";
    kinds[kinds["lost"] = 1] = "lost";
    kinds[kinds["found"] = 2] = "found";
    kinds[kinds["unknown"] = 3] = "unknown";
})(kinds || (kinds = {}));
;
var sorts;
(function (sorts) {
    sorts[sorts["synchCall"] = 0] = "synchCall";
    sorts[sorts["asynchCall"] = 1] = "asynchCall";
    sorts[sorts["asynchSignal"] = 2] = "asynchSignal";
    sorts[sorts["createMessage"] = 3] = "createMessage";
    sorts[sorts["deleteMessage"] = 4] = "deleteMessage";
    sorts[sorts["reply"] = 5] = "reply";
})(sorts || (sorts = {}));
;
import { BusinessElement } from "./BusinessElement";
export class Message extends BusinessElement {
    get parentLayer() {
        return this.start.at.layer;
    }
    constructor(name, sort, kind, start, end) {
        super();
        this.name = name;
        this.kind = kind;
        this.sort = sort;
        this.start = start;
        this.end = end;
    }
    delete() {
        console.log("deleting message");
        this.start.at.occurenceSpecifications.splice(this.start.at.occurenceSpecifications.indexOf(this.start), 1);
        this.end.at.occurenceSpecifications.splice(this.end.at.occurenceSpecifications.indexOf(this.end), 1);
        this.start.at.layer.messages.splice(this.start.at.layer.messages.indexOf(this), 1);
        //this.end.at.layer.messages.splice(this.end.at.layer.messages.indexOf(this),1)
        this.parentLayer.graphicElement.remove(this.graphicElement);
    }
}
//# sourceMappingURL=Message.js.map