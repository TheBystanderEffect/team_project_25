import { PlaneGeometry, CylinderGeometry, MeshLambertMaterial, MeshBasicMaterial, DoubleSide } from 'three';
import * as Config from "../config";
export class Assets {
    constructor() {
        this.layerRectangleGeometry = new PlaneGeometry(1, 1);
        this.layerRectangleMaterial = new MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: DoubleSide });
        this.lifelineBodyGeometry = new CylinderGeometry(Config.lifelineRadius, Config.lifelineRadius, 1, 8);
        this.lifelineBodyMaterial = new MeshBasicMaterial({ color: 0xFF0000 });
        this.messageArrowBodyGeometry = new CylinderGeometry(Config.messageArrowBodyRadius, Config.messageArrowBodyRadius, 1, 8);
        this.messageArrowHeadGeometry = new CylinderGeometry(Config.messageArrowHeadRadiusTip, Config.messageArrowHeadRadiusBase, 1, 16);
        this.messageArrowBodyMaterial = new MeshBasicMaterial({ color: 0x00FF00 });
        this.messageArrowHeadMaterial = new MeshBasicMaterial({ color: 0x00FF00 });
        this.fragmentBodyGeometry = new CylinderGeometry(Config.fragmentBodyRadius, Config.fragmentBodyRadius, 1, 8);
        this.fragmentBodyMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this.textMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this.textBackPlateGeometry = new PlaneGeometry(1, 1);
        this.textBackPlateMaterial = new MeshBasicMaterial({ color: 0xa0a0f0, side: DoubleSide });
    }
}
//# sourceMappingURL=Assets.js.map