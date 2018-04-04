import { Vector3 } from 'three';
import { GraphicElement } from "./GraphicElement";
import { CustomMesh } from "./CustomMesh";
import * as Config from "../config";
import { ASSETS } from "../globals";
import { Text3D } from './Text3D';
export class FragmentView extends GraphicElement {
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
        this.fragmentBody = new CustomMesh(ASSETS.fragmentBodyGeometry, ASSETS.fragmentBodyMaterial);
        this.fragmentBody.position.set(0, 0, 0);
        this.add(this.fragmentBody);
        this.operatorText = new Text3D(this);
        this.add(this.operatorText);
        this.conditionText = new Text3D(this);
        this.add(this.conditionText);
        return this;
    }
    updateLayout(index) {
        this.index = index;
        //calculate where the start,end points should be
        var start = this.businessElement.parent.startingOccurences[0].lifeline.graphicElement.source.clone();
        var end = this.businessElement.parent.endingOccurences[1].lifeline.graphicElement.source.clone();
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
        this.operatorText.update(this.businessElement.interactionOperator.toString());
        return this;
    }
}
//# sourceMappingURL=FragmentView.js.map