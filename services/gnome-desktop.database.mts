import { resolve } from "path";
import { readdir, readFile } from "fs/promises";
import { Desktop } from "../models/desktop.mts";

export class GnomeDesktopDatabase {
    applicationsPath: string = '.';
    desktopIcons: Desktop[] = [];

    constructor(applicationsPath: string) {
        this.applicationsPath = applicationsPath;
    }

    async listFilesInDirectory(directoryPath = '.') {
        try {
            const files = await readdir(directoryPath);
            return [...files].filter(f => f.endsWith(".desktop")).map(f => resolve(directoryPath, f));
        } catch (err) {
            console.error('Error reading directory:', err);
            throw err;
        }
    }

    async refresh() {
        const desktopFiles = await this.listFilesInDirectory(this.applicationsPath);
        const desktops = []
        for (const desktopFilePath of desktopFiles) {
            const content = await readFile(desktopFilePath, "utf8");
            const desktopLink = new Desktop(content, desktopFilePath);
            desktops.push(desktopLink);
        }
        this.desktopIcons = desktops;
    }
}