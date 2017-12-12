import { Font } from 'three';
import { Diagram } from './model/Diagram';

export let FONT: Font = null;
export let FONT_URL: string = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

export let CURRENTLY_OPENED_DIAGRAM: Diagram = null;

export function setFont(font: Font): void {
    FONT = font;
}

export function setOpenDiagram(diagram: Diagram): void {
    CURRENTLY_OPENED_DIAGRAM = diagram;
}