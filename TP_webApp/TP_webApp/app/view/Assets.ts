import { PlaneGeometry, CylinderGeometry, MeshLambertMaterial, MeshBasicMaterial} from 'three'
import * as Config from "../config"

export class Assets{

    //not sure about the namings, input appreciated
    public layerRectangleGeometry: PlaneGeometry;
    public layerRectangleMaterial: MeshLambertMaterial;

    public lifelineBodyGeometry: CylinderGeometry;
    public lifelineBodyMaterial: MeshBasicMaterial;

    public messageArrowBodyGeometry: CylinderGeometry;
    public messageArrowHeadGeometry: CylinderGeometry;
    public messageArrowBodyMaterial: MeshBasicMaterial;
    public messageArrowHeadMaterial: MeshBasicMaterial;

    public textMaterial: MeshBasicMaterial;

    public constructor(){

        this.layerRectangleGeometry = new PlaneGeometry(1,1);
        this.layerRectangleMaterial = new MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});

        this.lifelineBodyGeometry = new CylinderGeometry(Config.lifelineRadius, Config.lifelineRadius, 1, 8 );
        this.lifelineBodyMaterial = new MeshBasicMaterial( {color: 0xFF0000} );

        this.messageArrowBodyGeometry = new CylinderGeometry( Config.messageArrowBodyRadius, Config.messageArrowBodyRadius, 1, 8 );
        this.messageArrowHeadGeometry = new CylinderGeometry( Config.messageArrowHeadRadiusTip, Config.messageArrowHeadRadiusBase, 1, 16 ); 
        this.messageArrowBodyMaterial = new MeshBasicMaterial( {color: 0x00FF00});
        this.messageArrowHeadMaterial = new MeshBasicMaterial( {color: 0x00FF00});

        this.textMaterial = new MeshBasicMaterial( {color: 0x000000});

    }

}