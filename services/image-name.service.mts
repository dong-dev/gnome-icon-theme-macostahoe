import { readFile } from "node:fs/promises";
import { IniDocument } from "../models/ini-document.mts";
import type { ImageContext } from "../constants.mts";
import { desktopEnvironment } from "../config.mts";
import { DesktopEnvironment } from "../types/desktop-environment.enum.mts";

export class ImageNameService {
    imageNameMap: Record<string, string[]> = {}
    databasePath: string = '';
    constructor(imageContext: ImageContext)
    constructor(databasePath: string)
    constructor(databasePathOrImageContext: string | ImageContext) {
        if (typeof databasePathOrImageContext == 'string') {
            this.setDatabasePath(databasePathOrImageContext);
        } else {
            this.setContext(databasePathOrImageContext);
        }
    }

    setContext(imageContext: ImageContext) {
        this.databasePath = './original/database/image-name-' + imageContext.toString() + (desktopEnvironment == DesktopEnvironment.Gnome ? "" : "-kde") + '-database.ini';
    }
    setDatabasePath(databasePath: string) {
        this.databasePath = databasePath;
    }

    async refresh() {
        const content = await readFile(this.databasePath, "utf8");
        const document = new IniDocument(content);
        for (const { name, value } of document.getItems()) {
            this.imageNameMap[name] = value
                .split(',')
                .map(name => name.trim())
                .filter(({ length }) => length)
        }
    }
}