"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kinds;
(function (kinds) {
    kinds[kinds["complete"] = 0] = "complete";
    kinds[kinds["lost"] = 1] = "lost";
    kinds[kinds["found"] = 2] = "found";
    kinds[kinds["unknow"] = 3] = "unknow";
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
var Message = /** @class */ (function () {
    function Message(name, sort, kind, start, end) {
        this.name = name;
        this.kind = kind;
        this.sort = sort;
        this.start = start;
        this.end = end;
    }
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=Message.js.map