import { resolve } from "node:path";
import { OUTPUT_FOLDER } from "../constants.mts";
import { Exec } from "../utils/exec.mts";

export class GenerateImageService {
    get isDarwin() {
        return process.platform == 'darwin';
    }
    constructor() {

    }

    /**
     * Generate image my the file input and output, cross platform
     * @param originalName 
     * @param expectedName 
     * @param size size in pixel 2x dpi will generate 2x size
     * @param isHiDPI is 2x dpi?
     * @returns 
     */
    async generateImage(originalName: string, expectedName: string, size: number, isHiDPI: boolean = false): Promise<any> {
        let binaryName = 'magick';
        const inputFile = `./original/apps/${originalName}.png`;
        const outputFolder = resolve(OUTPUT_FOLDER, `./${size}x${size}${isHiDPI ? "@2" : ""}/apps`);
        const outputFile = resolve(outputFolder, `${expectedName}.png`);
        let dpiOption = `-units PixelsPerInch -set density ${isHiDPI ? 72 * 2 : 72}`;
        let resizeOption = `-resize ${isHiDPI ? size * 2 : size}x`;
        let outputFileOption = outputFile;
        if (this.isDarwin) {
            binaryName = 'sips';
            dpiOption = `--setProperty dpiWidth ${isHiDPI ? 72 * 2 : 72} --setProperty dpiHeight ${isHiDPI ? 72 * 2 : 72}`;
            resizeOption = `--resampleHeightWidth ${isHiDPI ? size * 2 : size} ${isHiDPI ? size * 2 : size}`;
            outputFileOption = "--out " + outputFile;
        }


        const command = [
            binaryName,
            inputFile,
            dpiOption,
            resizeOption,
            outputFileOption,
        ].join(" ");
        return await Exec(command)
    }
}