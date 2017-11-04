import { Scene } from 'three';
import { GraphicElement } from './GraphicElement';
import { LayerView } from './LayerView';
import { LifelineView } from './LifelineView';
import { MessageView } from './MessageView';
import { TextView } from './TextView';
import { setOpenDiagram } from '../globals';
import { RaycasterControl } from '../controller/RaycastControl'
import { GLContext } from './GLContext';

export function addClick(){
    RaycasterControl.instance.toDo = 1;

}


export function toggleNav() {
    let side = document.getElementById("mySidenav");
    if (side.style.width === "0px") {
        side.style.width = "250px";
        document.getElementById("main").style.width = "250px";
        document.getElementById("openMenu").style.marginLeft = "250px";
        document.getElementById("openMenu").innerHTML = "Close";
    }
    else {
        side.style.width = "0px";
        document.getElementById("main").style.width = "0px";
        document.getElementById("openMenu").style.marginLeft = "0px";
        document.getElementById("openMenu").innerHTML = "Open";
    }
}

function loadDiagram(id: number) {
    while(GLContext.instance.scene.children.length > 0){
        GLContext.instance.scene.remove(GLContext.instance.scene.children[0]);
    }

    let req: XMLHttpRequest = new XMLHttpRequest();
    req.open('GET',`/api/data/diagram/${id}`);
    req.addEventListener("load", ( ev: Event ) => {

        function json2elm(obj: any): GraphicElement {
            switch(obj.type) {
                case 'LAYER':
                return new LayerView(obj.x, obj.y, obj.z, obj.width, obj.height);
                case 'LIFELINE':
                return new LifelineView(obj.source_x, obj.source_y, obj.source_z, obj.length);
                case 'MESSAGE':
                return new MessageView(obj.source_x, obj.source_y, obj.source_z, obj.destination_x, obj.destination_y, obj.destination_z);
                case 'TEXT':
                return new TextView(obj.source_x, obj.source_y, obj.source_z, obj.text_string, obj.text_size);
            }
        }

        let diagram = JSON.parse(req.responseText);
        setOpenDiagram(diagram);
        diagram.elements.map(json2elm).forEach((elm: GraphicElement) => {
            elm.draw(GLContext.instance.scene);
        });
    });
    req.send();
}

export function makeButton(diagramId: number) {
    let btn = document.createElement("BUTTON");
    let text = document.createTextNode(`Diagram ${diagramId}`);
    btn.appendChild(text);
    btn.onclick = loadDiagram.bind(null, diagramId);
    document.getElementById("mySidenav").appendChild(btn);
}