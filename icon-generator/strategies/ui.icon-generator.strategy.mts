import { ImageContext } from "../../constants.mts";
import { IconGeneratorStrategy } from "../icon-generator.strategy.mts";

export class UserInterfaceIconGeneratorStrategy extends IconGeneratorStrategy {
    readonly imageContext = ImageContext.UserInterface;


    constructor() {
        super()
        this.imageNameService.setContext(this.imageContext);
        this.generateImageService.setContext(this.imageContext);
        this._createFolderGroupElements(this.imageContext, 'UI');
    }
}