import { ImageContext } from "../../constants.mts";
import { IconGeneratorStrategy } from "../icon-generator.strategy.mts";

export class DevicesIconGeneratorStrategy extends IconGeneratorStrategy {
    readonly imageContext = ImageContext.Devices;


    constructor() {
        super()
        this.imageNameService.setContext(this.imageContext);
        this.generateImageService.setContext(this.imageContext);
        this._createFolderGroupElements(this.imageContext, 'Devices');
    }
}