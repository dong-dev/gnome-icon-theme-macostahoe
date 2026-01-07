import { ImageContext } from "../../constants.mts";
import { GroupElement, ItemElement } from "../../models/ini-document.mts";
import { ScalableIconGeneratorStrategy } from "../scalable-icon-generator.strategy.mts";

export class ScalableUserInterfaceGeneratorStrategy extends ScalableIconGeneratorStrategy {
    readonly imageContext = ImageContext.ScalableUserInterface;


    constructor() {
        super()
        this.imageNameService.setContext(this.imageContext);
        this.generateImageService.setContext(this.imageContext);
        this.groupElements = [
            new GroupElement(
                this.imageContext.path,
                [
                    new ItemElement("Context", "UI"),
                    new ItemElement("Size", "16"),
                    new ItemElement("MinSize", "8"),
                    new ItemElement("MaxSize", "512"),
                    new ItemElement("Type", "Scalable"),
                ]
            )
        ];
    }
}