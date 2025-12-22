import { resolve } from "node:path";
import { OUTPUT_FOLDER } from "../constants.mts";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { Exec } from "../utils/exec.mts";

export class GenerateImageService {
    constructor() {

    }

    async generateImage(originalName: string, expectedName: string, size: number, isHDPI: boolean = false): Promise<any> {
        const binaryName = 'magick';
        const inputFile = `./original/apps/${originalName}.png`;
        const outputFolder = resolve(OUTPUT_FOLDER, `./${size}x${size}${isHDPI ? "@2" : ""}/apps`);
        const outputFile = resolve(outputFolder, `${expectedName}.png`);
        const dpiOption = `-units PixelsPerInch -set density ${isHDPI ? 72 * 2 : 72}`;
        const resizeOption = `-resize ${isHDPI ? size * 2 : size}x`;

        if (!existsSync(outputFolder)) {
            await mkdir(outputFolder, { recursive: true })
        }

        const command = [
            binaryName,
            inputFile,
            dpiOption,
            resizeOption,
            outputFile,
        ].join(" ");
        return await Exec(command)
    }
}