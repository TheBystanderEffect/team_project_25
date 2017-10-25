"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var three_2 = require("three");
var CameraControls = /** @class */ (function () {
    function CameraControls(camera) {
        this.camera = camera;
        this.self = this;
    }
    CameraControls.prototype.init = function (camera) {
        this.pitchObject.add(camera);
        this.yawObject.position.y = 10;
        this.yawObject.add(this.pitchObject);
    };
    Object.defineProperty(CameraControls.prototype, "enabled", {
        set: function (v) {
            this.enabled = v;
        },
        enumerable: true,
        configurable: true
    });
    CameraControls.prototype.onmousemove = function (event) {
        if (!this.enabled) {
            return;
        }
        var movementX = event.movementX || 0;
        var movementY = event.movementY || 0;
        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;
        this.pitchObject.rotation.x = Math.max(-(Math.PI / 2), Math.min((Math.PI, this.pitchObject.rotation.x)));
        this.camera.updateMatrix();
    };
    Object.defineProperty(CameraControls.prototype, "getObject", {
        get: function () {
            return this.yawObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CameraControls.prototype, "getPitchObject", {
        get: function () {
            return this.pitchObject;
        },
        enumerable: true,
        configurable: true
    });
    CameraControls.prototype.getDirection = function () {
        var direction = new three_1.Vector3(0, 0, -1);
        var rotation = new three_2.Euler(0, 0, 0, "YXZ");
    };
    return CameraControls;
}());
exports.CameraControls = CameraControls;
//# sourceMappingURL=CameraControls.js.map