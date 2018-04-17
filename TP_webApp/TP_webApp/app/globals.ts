import { Font } from 'three';
import { Diagram } from './model/Diagram';
import { Assets } from "./view/Assets";
import * as $ from 'jquery';

export let FONT: Font = null;
export let FONT_URL: string = '/fonts/helvetiker_regular.typeface.json';

export let CURRENTLY_OPENED_DIAGRAM: Diagram = null;
export let IS_DIAGRAM_SAVED: boolean = false;

export let ASSETS: Assets = null;

export function setFont(font: Font): void {
    FONT = font;
}

export function setOpenDiagram(diagram: Diagram): void {
    $('#OrderLayouts').empty();

    for (let index = 0; index < diagram.layers.length; index++) {
        const element = diagram.layers[index];
        $('#OrderLayouts').append('<li class="sortable-item"><a ><i aria-hidden="true"></i> Layout'+index+' </a></li>')
    }
    CURRENTLY_OPENED_DIAGRAM = diagram;
}

export function setDiagramSaved(diagramSaved: boolean): void {
    IS_DIAGRAM_SAVED = diagramSaved;
}

export function setAssets(assets: Assets): void {
    ASSETS = assets;
}