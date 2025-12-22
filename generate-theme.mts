import { rm, mkdir, writeFile } from "node:fs/promises";
import { OUTPUT_FOLDER, SIZES, THEME_NAME } from "./constants.mts";
import { CommentElement, GroupElement, IniDocument, ItemElement, LineElement } from "./models/ini-document.mts";
import { resolve } from "node:path";
import { ImageNameService } from "./services/image-name.service.mts";
import { GenerateImageService } from "./services/generate-image.service.mts";


const document = new IniDocument();

const folderGroups: GroupElement[] = [];

for (const size of SIZES) {
    folderGroups.push(
        new GroupElement(
            `${size}x${size}/apps`,
            [
                new ItemElement('Size', "" + size),
                new ItemElement('Context', 'Applications'),
                new ItemElement('Type', 'Threshold'),
                new LineElement(''),
            ]
        ),
        new GroupElement(
            `${size}x${size}@2/apps`,
            [
                new ItemElement('Size', "" + size),
                new ItemElement('Scale', '2'),
                new ItemElement('Context', 'Applications'),
                new ItemElement('Type', 'Threshold'),
                new LineElement(''),
            ]
        ),
    );
}

const scalableGroup = new GroupElement(
    'scalable/apps',
    [
        new ItemElement("Context", "Applications"),
        new ItemElement("Size", "128"),
        new ItemElement("MinSize", "8"),
        new ItemElement("MaxSize", "512"),
        new ItemElement("Type", "Scalable"),
    ]
);
folderGroups.push(scalableGroup);


const headerGroup = new GroupElement(
    'Icon Theme',
    [
        new ItemElement("Name", THEME_NAME),
        new ItemElement("Comment", 'macOS Tahoe Icon Theme'),
        new ItemElement("Example", 'folder'),
        new ItemElement("Inherits", [
            'Adwaita'
        ].join(",")),
        new LineElement(''),
        new CommentElement('# Directory list'),
        new ItemElement('Directories', [...folderGroups.map(group => group.name), ''].join(',')),
        new LineElement(''),
    ]
);

document.children.push(headerGroup);
document.children.push(...folderGroups);
await rm(resolve('.', OUTPUT_FOLDER), { recursive: true, force: true });
await mkdir(resolve('.', OUTPUT_FOLDER), { recursive: true });
await writeFile(resolve('.', OUTPUT_FOLDER, 'index.theme'), document.toString())

const imageNameService = new ImageNameService('./original/database/image-name-map-database.ini');
const generateImageService = new GenerateImageService();
await imageNameService.refresh();

for (const { name } of folderGroups) {
    await mkdir(resolve('.', OUTPUT_FOLDER, name), { recursive: true })
}
for (const originalName of Object.keys(imageNameService.imageNameMap)) {
    const expectedNames = imageNameService.imageNameMap[originalName];
    if (expectedNames === null || !Array.isArray(expectedNames)) {
        continue;
    }
    for (const expectedName of expectedNames) {
        for (const size of SIZES) {
            const [result1x, result2x] = await Promise.all([
                generateImageService.generateImage(originalName, expectedName, size),
                generateImageService.generateImage(originalName, expectedName, size, true),
            ])
        }
    }
}