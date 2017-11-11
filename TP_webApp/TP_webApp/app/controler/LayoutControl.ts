import {Diagram} from "../model/Diagram"
import {DiagramView} from "../view/DiagramView"
import {LayerView} from "../view/LayerView"
import {LifelineView} from "../view/LifelineView"
import {Geometry} from "three"

export class LayoutControl{
 
    public static magic(diagram:Diagram){
        diagram.diagramView=new DiagramView(diagram);

        diagram.layers.forEach((layer, index) => {
            var templayerptr = new LayerView(0,0,-1000*index,500,600);
            diagram.diagramView.add(templayerptr.mesh);

            layer.lifelines.forEach((lifeline, index) =>{
                var templifelineptr = new LifelineView(
                        templayerptr.getPosition().x - templayerptr.width/2 + 100 + index*250,
                        templayerptr.getPosition().y + templayerptr.height/2,
                        0,
                        600
                    );
                templayerptr.mesh.add(templifelineptr.mesh);
/*
                lifeline.occurenceSpecifications.forEach(occurenceSpecification =>{
                    
                });*/


            });

        });

    }


}