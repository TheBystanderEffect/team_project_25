import { Font } from 'three';

export let FONT: Font = null;
export let FONT_URL: string = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

export function setFont(font: Font): void {
    FONT = font;
}