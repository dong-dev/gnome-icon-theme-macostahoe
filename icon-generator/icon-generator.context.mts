import { ImageContext } from "../constants.mts";
import { IconGeneratorStrategy } from "./icon-generator.strategy.mts";
import { ActionsIconGeneratorStrategy } from "./strategies/actions.icon-generator.strategy.mts";
import { AppsIconGeneratorStrategy } from "./strategies/apps.icon-generator.strategy.mts";
import { MimeTypesIconGeneratorStrategy } from "./strategies/mimetypes.icon-generator.strategy.mts";
import { PlacesIconGeneratorStrategy } from "./strategies/places.icon-generator.strategy.mts";
import { ScalableAppsIconGeneratorStrategy } from "./strategies/scalable-apps.icon-generator.strategy.mts";

export class IconGeneratorContext {
    strategy: IconGeneratorStrategy = new IconGeneratorStrategy()

    constructor(imageContext: ImageContext)
    constructor(strategy: IconGeneratorStrategy)
    constructor(strategyOrImageContext: IconGeneratorStrategy | ImageContext) {
        if (strategyOrImageContext instanceof ImageContext) {
            this.setStrategy(strategyOrImageContext);
        } else {
            this.setStrategy(strategyOrImageContext);
        }
    }

    setStrategy(imageContext: ImageContext): void
    setStrategy(strategy: IconGeneratorStrategy): void
    setStrategy(strategyOrImageContext: IconGeneratorStrategy | ImageContext) {
        if (strategyOrImageContext instanceof IconGeneratorStrategy) {
            this.strategy = strategyOrImageContext;
            return;
        }
        if (strategyOrImageContext instanceof ImageContext) {
            switch (strategyOrImageContext) {
                case ImageContext.Actions:
                    this.strategy = new ActionsIconGeneratorStrategy();
                    break;
                case ImageContext.Apps:
                    this.strategy = new AppsIconGeneratorStrategy();
                    break;
                case ImageContext.MimeTypes:
                    this.strategy = new MimeTypesIconGeneratorStrategy();
                    break;
                case ImageContext.Places:
                    this.strategy = new PlacesIconGeneratorStrategy();
                    break;
                case ImageContext.ScalableApps:
                    this.strategy = new ScalableAppsIconGeneratorStrategy();
                    break;
                default:
                    break;
            }
            return;
        }
    }

    getFolderGroupElements() {
        return this.strategy.getFolderGroupElements();
    }
    async createFolder() {
        return await this.strategy.createFolder();
    }
    async generateImages() {
        await this.strategy.generateCroppedImages();
        return await this.strategy.generateImages();
    }
}