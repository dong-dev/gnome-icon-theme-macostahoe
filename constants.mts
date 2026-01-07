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
    path: string = '';
    constructor(value: string, path?: string) {
        this.value = value;
        if (path === undefined) {
            this.path = value;
        } else {
            this.path = path;
        }
    }
    static Actions: ImageContext = new ImageContext('actions');
    static Apps: ImageContext = new ImageContext('apps');
    static Devices: ImageContext = new ImageContext('devices');
    static MimeTypes: ImageContext = new ImageContext('mimetypes');
    static Places: ImageContext = new ImageContext('places');
    static ScalableApps: ImageContext = new ImageContext('scalable-apps', 'scalable/apps');
    static ScalableUserInterface: ImageContext = new ImageContext('scalable-ui', 'scalable/ui');
    static UserInterface: ImageContext = new ImageContext('ui');
    toString(): string {
        return this.value;
    }
}
