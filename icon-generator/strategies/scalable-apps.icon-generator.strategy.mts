import { ImageContext } from "../../constants.mts";
import { GroupElement, ItemElement } from "../../models/ini-document.mts";
import { ScalableIconGeneratorStrategy } from "../scalable-icon-generator.strategy.mts";

export class ScalableAppsIconGeneratorStrategy extends ScalableIconGeneratorStrategy {
    readonly imageContext = ImageContext.ScalableApps;


    constructor() {
        super()
        this.imageNameService.setContext(this.imageContext);
        this.generateImageService.setContext(this.imageContext);
        this.groupElements = [
            new GroupElement(
                'scalable/apps',
                [
                    new ItemElement("Context", "Applications"),
                    new ItemElement("Size", "128"),
                    new ItemElement("MinSize", "8"),
                    new ItemElement("MaxSize", "512"),
                    new ItemElement("Type", "Scalable"),
                ]
            )
        ];
    }
}