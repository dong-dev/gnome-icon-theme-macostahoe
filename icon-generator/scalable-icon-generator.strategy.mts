import { ImageContext } from "../constants.mts";
import { GroupElement, ItemElement } from "../models/ini-document.mts";
import { IconGeneratorStrategy } from "./icon-generator.strategy.mts";

export class ScalableIconGeneratorStrategy extends IconGeneratorStrategy {
    constructor() {
        super()

    }

    async generateImages(): Promise<void> {
        await this.imageNameService.refresh();
        for (const originalName of Object.keys(this.imageNameService.imageNameMap)) {
            const expectedNames = this.imageNameService.imageNameMap[originalName];
            if (expectedNames === null || !Array.isArray(expectedNames)) {
                continue;
            }
            for (const expectedName of expectedNames) {
                await this.generateImageService.copySvgFile(originalName, expectedName);
            }
        }
    }
    async generateCroppedImages() {
    }
}