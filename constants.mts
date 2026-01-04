import { join } from 'path'
export const THEME_NAME = "macOSTahoe";
export const OUTPUT_FOLDER = join('./themes', THEME_NAME);
export const TEMPORARY_FOLDER = join('./temporary', THEME_NAME);

export const SIZES = [
    16,
    22,
    24,
    32,
    36,
    48,
    64,
    72,
    96,
    128,
    192,
    256,
];

export class ImageContext {
    value: string = '';
    constructor(value: string) {
        this.value = value;
    }
    static Apps: ImageContext = new ImageContext('apps');
    static Places: ImageContext = new ImageContext('places');
    static ScalableApps: ImageContext = new ImageContext('scalable-apps');
    static MimeTypes: ImageContext = new ImageContext('mimetypes');
    static Actions: ImageContext = new ImageContext('actions');
    toString(): string {
        return this.value;
    }
}
