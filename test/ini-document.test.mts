import assert from "node:assert/strict";
import test from "node:test";
import { IniDocument, GroupElement, ItemElement } from "../models/ini-document.mts";

test('Document Parser', () => {
    const content = `[Icon Theme]
Name=macOSTahoe
Comment=macOS Tahoe Icon Theme
Example=folder
Inherits=Adwaita`;
    const document = new IniDocument(content)
    assert.strictEqual(document.children.length, 1);
});


test('Document Parser With Empty Key', () => {
    const content = `[Icon Theme]
Name=macOSTahoe
Comment=macOS Tahoe Icon Theme
Example=
Inherits=Adwaita`;
    const document = new IniDocument(content)
    assert.strictEqual(document.children.length, 1);
    const iconThemeGroup = document.getGroupByName('Icon Theme');
    assert.notEqual(iconThemeGroup, undefined);
    const exampleItem = iconThemeGroup?.getItemByName('Example');
    assert.notStrictEqual(exampleItem, undefined);
    assert.strictEqual(exampleItem?.name, 'Example');
    assert.strictEqual(exampleItem?.value, '');
});

test('Document Writer', () => {
    const firstGroup = new GroupElement(
        "Icon Theme",
        [
            new ItemElement("Name", "macOSTahoe"),
            new ItemElement("Comment", "macOS Tahoe Icon Theme"),
            new ItemElement("Example", "folder"),
            new ItemElement("Inherits", "Adwaita"),
        ]
    );
    const document = new IniDocument([firstGroup]);

    assert.strictEqual(document.children.length, 1);
    const expectedDocumentString = `[Icon Theme]
Name=macOSTahoe
Comment=macOS Tahoe Icon Theme
Example=folder
Inherits=Adwaita`
    assert.strictEqual(expectedDocumentString, document.toString('\n'));
});