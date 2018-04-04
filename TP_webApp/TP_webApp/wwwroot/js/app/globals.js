export let FONT = null;
export let FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';
export let CURRENTLY_OPENED_DIAGRAM = null;
export let IS_DIAGRAM_SAVED = false;
export let ASSETS = null;
export function setFont(font) {
    FONT = font;
}
export function setOpenDiagram(diagram) {
    CURRENTLY_OPENED_DIAGRAM = diagram;
}
export function setDiagramSaved(diagramSaved) {
    IS_DIAGRAM_SAVED = diagramSaved;
}
export function setAssets(assets) {
    ASSETS = assets;
}
//# sourceMappingURL=globals.js.map