import { Vector3, Euler } from 'three';
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import * as Config from "../config";
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
export class MessageView extends GraphicElement {
    constructor(parent) {
        super(parent);
        this.animation = {
            start: {
                source: new Vector3(0, 0, 0),
                destination: new Vector3(0, 0, 0)
            },
            end: {
                source: new Vector3(0, 0, 0),
                destination: new Vector3(0, 0, 0)
            }
        };
        this._source = new Vector3(0, 0, 0);
        this._destination = new Vector3(0, 0, 0);
        this.arrowBody = new CustomMesh(ASSETS.messageArrowBodyGeometry, ASSETS.messageArrowBodyMaterial);
        this.arrowBody.position.set(0, 0, 0);
        this.add(this.arrowBody);
        this.arrowHead = new CustomMesh(ASSETS.messageArrowHeadGeometry, ASSETS.messageArrowHeadMaterial);
        this.arrowHead.position.set(0, 0, 0);
        this.add(this.arrowHead);
        this.text = new Text3D(this);
        this.add(this.text);
        return this;
    }
    updateLayout(index) {
        this.index = index;
        //calculate where the start, end points should be
        var start = this.businessElement.start.lifeline.graphicElement.source.clone();
        var end = this.businessElement.end.lifeline.graphicElement.source.clone();
        start.y += -Config.firstMessageOffset - Config.messageOffset * index;
        end.y += -Config.firstMessageOffset - Config.messageOffset * index;
        //update only if current and correct points mismatch
        if (!(this._source.equals(start) && this._destination.equals(end))) {
            this.animation.start.source.copy(this._source);
            this.animation.start.destination.copy(this._destination);
            this.animation.end.source.copy(start);
            this.animation.end.destination.copy(end);
            this.animationLength = 1;
            this.animationProgress = 0;
            // this.redraw();
        }
        this.text.update(this.businessElement.name);
        return this;
    }
    redraw() {
        this._length = Math.sqrt(Math.pow(this._destination.x - this._source.x, 2)
            + Math.pow(this._destination.y - this._source.y, 2)
            + Math.pow(this._destination.z - this._source.z, 2));
        this.position.set((this._source.x + this._destination.x) / 2, (this._source.y + this._destination.y) / 2, (this._source.z + this._destination.z) / 2);
        let dirEuler = new Euler(Math.atan2(this._destination.z - this._source.z, this._destination.y - this._source.y), 0, Math.atan2(this._destination.y - this._source.y, this._destination.x - this._source.x) - Math.PI / 2);
        this.arrowHead.rotation.copy(dirEuler);
        this.arrowBody.rotation.copy(dirEuler);
        let dir = new Vector3(this._destination.x - this._source.x, this._destination.y - this._source.y, this._destination.z - this._source.z).normalize();
        this.arrowHead.scale.setY(Config.messageArrowHeadLength);
        this.arrowHead.position.copy(dir).multiplyScalar((this._length - Config.messageArrowHeadLength) / 2 - Config.lifelineRadius);
        this.arrowBody.scale.setY(this._length - Config.lifelineRadius * 2 - Config.messageArrowHeadLength + Config.messageArrowOverlap);
        this.arrowBody.position.copy(dir).multiplyScalar(-Config.lifelineRadius);
    }
    //optimized for always horizontal in one layer messages
    redrawSimple() {
        this._length = Math.abs(this._destination.x - this._source.x);
        this.position.set((this._source.x + this._destination.x) / 2, this._source.y, this._source.z);
        let halfPI = Math.PI / 2;
        this.arrowHead.rotation.z = -halfPI;
        this.arrowBody.rotation.z = -halfPI;
        let dir = 1;
        if (this._destination.x < this._source.x) {
            dir = -1;
            this.arrowHead.rotation.z = halfPI;
            this.arrowBody.rotation.z = halfPI;
        }
        this.arrowHead.scale.setY(Config.messageArrowHeadLength);
        this.arrowHead.position.x = dir * ((this._length - Config.messageArrowHeadLength) / 2 - Config.lifelineRadius);
        this.arrowBody.scale.setY(this._length - Config.lifelineRadius * 2 - Config.messageArrowHeadLength + Config.messageArrowOverlap);
        this.arrowBody.position.x = dir * (-Config.lifelineRadius);
    }
    redrawBySource(source) {
        this._source.copy(source);
        this._destination.setY(source.y);
        this.redrawSimple();
    }
    redrawByDestination(dest) {
        this._destination.copy(dest);
        this._source.setY(dest.y);
        this.redrawSimple();
    }
    resetPosition() {
        this.updateLayout(this.index);
    }
    get source() {
        return this._source;
    }
    get destination() {
        return this._destination;
    }
    set source(source) {
        this._source.copy(source);
    }
    set destination(destination) {
        this._destination.copy(destination);
    }
    animate() {
        this.source = this.animator(this.animation.start.source, this.animation.end.source, this.animationProgress);
        this.destination = this.animator(this.animation.start.destination, this.animation.end.destination, this.animationProgress);
        this.redraw();
    }
}
//# sourceMappingURL=MessageView.js.map