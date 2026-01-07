import { mkdir } from "node:fs/promises";
import { ImageContext, OUTPUT_FOLDER, SIZES, TEMPORARY_FOLDER } from "../constants.mts";
import { GroupElement, ItemElement, LineElement } from "../models/ini-document.mts";
import { GenerateImageService } from "../services/generate-image.service.mts";
import { ImageNameService } from "../services/image-name.service.mts";
import { resolve } from "node:path";

export class IconGeneratorStrategy {
    groupElements: GroupElement[] = []

    imageNameService: ImageNameService = new ImageNameService(new ImageContext(''));
    generateImageService = new GenerateImageService(new ImageContext(''));
    constructor() {

    }

    async createFolder() {
        if (this.groupElements.length < 1) {
            return;
        }
        for (const { name } of this.groupElements) {
            await mkdir(resolve('.', OUTPUT_FOLDER, name), { recursive: true })
        }
        await mkdir(resolve('.', TEMPORARY_FOLDER, this.generateImageService.context.toString()), { recursive: true })
    }

    getFolderGroupElements(): GroupElement[] {
        return this.groupElements;
    }
    _createFolderGroupElements(imageContext: ImageContext, context: string): GroupElement[] {
        if (this.groupElements.length) {
            return this.groupElements;
        }
        this.groupElements = SIZES
            .map(size => [
                /**
                 * Normal icon folder
                 */
                new GroupElement(
                    `${size}x${size}/${imageContext.path}`,
                    [
                        new ItemElement('Size', "" + size),
                        new ItemElement('Context', context),
                        new ItemElement('Type', 'Threshold'),
                        new LineElement(''),
                    ]
                ),
                /**
                 * HiDPI icon folder
                 */
                new GroupElement(
                    `${size}x${size}@2/${imageContext.path}`,
                    [
                        new ItemElement('Size', "" + size),
                        new ItemElement('Scale', '2'),
                        new ItemElement('Context', context),
                        new ItemElement('Type', 'Threshold'),
                        new LineElement(''),
                    ]
                ),
            ])
            .flat();
        return this.groupElements;
    }

    async generateImages() {
        await this.imageNameService.refresh()

        for (const originalName of Object.keys(this.imageNameService.imageNameMap)) {
            const expectedNames = this.imageNameService.imageNameMap[originalName];
            if (expectedNames === null || !Array.isArray(expectedNames)) {
                continue;
            }
            for (const expectedName of expectedNames) {
                for (const size of SIZES) {
                    const [result1x, result2x] = await Promise.all([
                        this.generateImageService.generateImage(originalName, expectedName, size),
                        this.generateImageService.generateImage(originalName, expectedName, size, true),
                    ])
                }
            }
        }
    }
    async generateCroppedImages() {
        await this.imageNameService.refresh()

        for (const originalName of Object.keys(this.imageNameService.imageNameMap)) {
            const size = await this.generateImageService.identify(originalName);
            if (size.Width !== 1024 || size.Height !== 1024) {
                console.warn('Invalid size!', originalName);
                continue;
            }
            await this.generateImageService.generateCroppedImage(originalName);
        }

    }
}