/*
The entry point of the application
*/
import * as Globals from './globals';
import { Font, FontLoader } from 'three';

function loadFont(font_url: string): Promise<Font> {

    let font_loader: FontLoader = new FontLoader();

    return new Promise<Font>((resolve, reject) => {
        font_loader.load(font_url, (font: Font): void => {
            resolve(font);
        },
        null,
        (error) => {
            reject(error);
        });
    });
}

// load a font and set it on resolve
loadFont(Globals.FONT_URL).then((font: Font) => {
    Globals.setFont(font);
}).catch((error) => {
    console.log(error);
});