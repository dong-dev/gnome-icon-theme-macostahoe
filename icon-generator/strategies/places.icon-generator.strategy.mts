import { ImageContext } from "../../constants.mts";
import { IconGeneratorStrategy } from "../icon-generator.strategy.mts";

export class PlacesIconGeneratorStrategy extends IconGeneratorStrategy {
    readonly imageContext = ImageContext.Places;
    constructor() {
        super()
        this.imageNameService.setContext(this.imageContext);
        this.generateImageService.setContext(this.imageContext);
        this._createFolderGroupElements(this.imageContext, 'Places');
    }

    async generateCroppedImages() {
        await this.imageNameService.refresh()

        for (const originalName of Object.keys(this.imageNameService.imageNameMap)) {
            const size = await this.generateImageService.identify(originalName);
            if (size.Width !== 1024 || size.Height !== 1024) {
                console.warn('Invalid size!', originalName);
                continue;
            }
            await this.generateImageService.generateCroppedImage(originalName, 928, 928);
        }

    }
}