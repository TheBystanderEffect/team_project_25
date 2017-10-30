import { Font } from 'three';

export let FONT: Font = null;
export let FONT_URL: string = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

export let CURRENTLY_OPENED_DIAGRAM: any = null;

export function setFont(font: Font): void {
    FONT = font;
}

export function setOpenDiagram(diagram: any): void {
    CURRENTLY_OPENED_DIAGRAM = diagram;
}