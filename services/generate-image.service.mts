import { resolve } from "node:path";
import { ImageContext, OUTPUT_FOLDER, TEMPORARY_FOLDER } from "../constants.mts";
import { Exec } from "../utils/exec.mts";
import { cp } from "node:fs/promises";

interface ImageSize {
    Width: number;
    Height: number;
}

export class GenerateImageService {
    get isDarwin() {
        return process.platform == 'darwin';
    }

    context: ImageContext = ImageContext.Apps
    constructor(context: ImageContext = ImageContext.Apps) {
        this.context = context;
    }

    setContext(content: ImageContext) {
        this.context = content;
    }

    getInputFilePath(originalName: string) {
        return `./original/${this.context}/${originalName}.png`;
    }

    getOutputFilePath(expectedName: string, size: number, isHiDPI: boolean = false) {
        const outputFolder = resolve(OUTPUT_FOLDER, `./${size}x${size}${isHiDPI ? "@2" : ""}/${this.context}`);
        return resolve(outputFolder, `${expectedName}.png`);
    }
    getTemporaryFilePath(expectedName: string) {
        const outputFolder = resolve(TEMPORARY_FOLDER, `./${this.context}`);
        return resolve(outputFolder, `${expectedName}.png`);
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
        if (this.isDarwin) {
            return await this.generateImage(originalName, expectedName, size, isHiDPI);
        }
        const binaryName = 'magick';
        const inputFile = this.getTemporaryFilePath(originalName);
        const outputFile = this.getOutputFilePath(expectedName, size, isHiDPI);
        const dpiOption = `-units PixelsPerInch -set density ${isHiDPI ? 72 * 2 : 72}`;
        const resizeOption = `-resize ${isHiDPI ? size * 2 : size}x`;
        const outputFileOption = outputFile;
        const command = [
            binaryName,
            inputFile,
            dpiOption,
            resizeOption,
            outputFileOption,
        ].join(" ");
        return await Exec(command)
    }

    async generateImageDarwin(originalName: string, expectedName: string, size: number, isHiDPI: boolean = false) {
        const binaryName = 'sips';
        const inputFile = this.getTemporaryFilePath(originalName);
        const outputFile = this.getOutputFilePath(expectedName, size, isHiDPI);
        const dpiOption = `--setProperty dpiWidth ${isHiDPI ? 72 * 2 : 72} --setProperty dpiHeight ${isHiDPI ? 72 * 2 : 72}`;
        const resizeOption = `--resampleHeightWidth ${isHiDPI ? size * 2 : size} ${isHiDPI ? size * 2 : size}`;
        const outputFileOption = "--out " + outputFile;
        const command = [
            binaryName,
            inputFile,
            dpiOption,
            resizeOption,
            outputFileOption,
        ].join(" ");
        return await Exec(command)
    }

    async identify(originalName: string): Promise<ImageSize> {
        if (this.isDarwin) {
            return await this.identifyDarwin(originalName);
        }
        const binaryName = 'magick';
        const inputFile = this.getInputFilePath(originalName);
        const action = 'identify';
        const option = '-format "%wx%h"';
        const command = [
            binaryName,
            action,
            option,
            inputFile,
        ].join(' ');
        const result = await Exec(command);
        if (typeof result != 'string') {
            throw new Error("Unexpected result type: " + typeof result);
        }
        if (!result.includes('x')) {
            throw new Error('Unexpected result format');
        }
        const [Width, Height] = result.split('x').map(size => parseInt(size)).filter(x => !isNaN(x))
        if (Width === undefined || Height === undefined) {
            throw new Error('Invalid sizes');
        }

        return {
            Width,
            Height,
        }
    }

    /**
     * 
     * @param originalName 
     * @returns 
     * @example
     * /Users/username/Desktop/imagefile.jpg
     * pixelWidth: 1024
     * pixelHeight: 768
     */

    async identifyDarwin(originalName: string): Promise<ImageSize> {
        const binaryName = 'sips';
        const inputFile = this.getInputFilePath(originalName);
        const option = '-g pixelWidth -g pixelHeight';
        const command = [
            binaryName,
            option,
            inputFile,
        ].join(' ');
        const result = await Exec(command);
        if (typeof result != 'string') {
            throw new Error("Unexpected result type: " + typeof result);
        }
        if (!result.includes('pixelWidth:') || !result.includes('pixelHeight:')) {
            throw new Error('Unexpected result format');
        }
        const [Width, Height] = [0, 0]

        return {
            Width,
            Height,
        }
    }

    async generateCroppedImage(originalName: string, width: number = 1024, height: number = 1024) {
        // magick image.jpg -gravity Center -crop 200x200+0+0 cropped_center.jpg

        const binaryName = 'magick';
        const inputFile = this.getInputFilePath(originalName);
        const outputFile = this.getTemporaryFilePath(originalName);
        const cropOption = `-gravity Center -crop ${width}x${height}+0+0`;
        const outputFileOption = outputFile;
        const command = [
            binaryName,
            inputFile,
            cropOption,
            outputFileOption,
        ].join(" ");
        return await Exec(command)
    }

    async copySvgFile(originalName: string, expectedName: string) {
        const inputFile = `./original/${this.context}/${originalName}.svg`;
        const outputFolder = resolve(OUTPUT_FOLDER, ...this.context.toString().split('-'));
        const outputFile = resolve(outputFolder, `${expectedName}.svg`);
        await cp(inputFile, outputFile);
    }
}