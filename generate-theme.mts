#!/usr/bin/env node

import {
    rm,
    mkdir,
    writeFile,
} from "node:fs/promises";
import {
    ImageContext,
    OUTPUT_FOLDER,
    TEMPORARY_FOLDER,
    THEME_NAME,
} from "./constants.mts";
import {
    CommentElement,
    GroupElement,
    IniDocument,
    ItemElement,
    LineElement,
} from "./models/ini-document.mts";
import { resolve } from "node:path";
import { IconGeneratorContext } from "./icon-generator/icon-generator.context.mts";
import { desktopEnvironment } from "./config.mts";
import { DesktopEnvironment } from "./types/desktop-environment.enum.mts";

/**
 * Build the theme.index document
 */
const document = new IniDocument();

/**
 * Define png folders
 */
const iconFolderGroups: GroupElement[] = [];

const IconGenerators: IconGeneratorContext[] = [
    new IconGeneratorContext(ImageContext.Actions),
    new IconGeneratorContext(ImageContext.Apps),
    new IconGeneratorContext(ImageContext.Devices),
    new IconGeneratorContext(ImageContext.MimeTypes),
    new IconGeneratorContext(ImageContext.Places),
    new IconGeneratorContext(ImageContext.ScalableApps),
    new IconGeneratorContext(ImageContext.ScalableUserInterface),
    new IconGeneratorContext(ImageContext.UserInterface),
]

/**
 * loop sizes then create folder group items (both normal and hidpi)
 */
for (const iconGenerator of IconGenerators) {
    iconFolderGroups.push(
        ...iconGenerator.getFolderGroupElements()
    );
}


/**
 * Icon Theme header group
 */
const headerGroup = new GroupElement(
    'Icon Theme',
    [
        new ItemElement("Name", THEME_NAME),
        new ItemElement("Comment", 'macOS Tahoe Icon Theme'),
        new ItemElement("Example", 'folder'),
        new ItemElement("Inherits", [
            desktopEnvironment == DesktopEnvironment.Gnome ? 'Adwaita' : 'breeze',
        ].join(",")),
        new LineElement(''),
        new CommentElement('Directory list'),
        new ItemElement(
            'Directories',
            [
                ...iconFolderGroups.map(group => group.name),
                ''
            ].join(',')
        ),
        new LineElement(''),
    ]
);

document.children.push(headerGroup);
document.children.push(...iconFolderGroups);

await rm(resolve('.', OUTPUT_FOLDER), { recursive: true, force: true });
await mkdir(resolve('.', OUTPUT_FOLDER), { recursive: true });
await writeFile(resolve('.', OUTPUT_FOLDER, 'index.theme'), document.toString());

await rm(resolve('.', TEMPORARY_FOLDER), { recursive: true, force: true });
await mkdir(resolve('.', TEMPORARY_FOLDER), { recursive: true });

for (const iconGenerator of IconGenerators) {
    await iconGenerator.createFolder()
    await iconGenerator.generateImages();
}