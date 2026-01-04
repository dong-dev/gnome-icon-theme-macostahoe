import { ImageContext } from "../../constants.mts";
import { IconGeneratorStrategy } from "../icon-generator.strategy.mts";

export class ActionsIconGeneratorStrategy extends IconGeneratorStrategy {
    readonly imageContext = ImageContext.Actions;

    
    constructor() {
        super()
        this.imageNameService.setContext(this.imageContext);
        this.generateImageService.setContext(this.imageContext);
        this._createFolderGroupElements(this.imageContext, 'Actions');
    }
}