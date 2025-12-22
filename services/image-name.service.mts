import { readFile } from "fs/promises";
import { IniDocument } from "../models/ini-document.mts";

export class ImageNameService {
    imageNameMap: Record<string, string[]> = {}
    databasePath: string = '';
    constructor(databasePath: string) {
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