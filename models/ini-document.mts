export class LineElement {
    line: string = ''
    constructor(line: string) {
        this.line = line;
    }

    toString(lineSeperator = '\r\n'): string {
        return this.line;
    }
}

export class ItemElement extends LineElement {
    name: string = '';
    value: string = '';

    constructor(line: string)
    constructor(name: string, value: string)
    constructor(name: string, value?: string) {
        super(name);

        if (value !== undefined) {
            this.name = name;
            this.value = value;
            return;
        }

        const finalLine = name.trimStart();
        const equalCharacterIndex = finalLine.indexOf("=", 1);

        this.name = finalLine.slice(0, equalCharacterIndex);
        this.value = finalLine.slice(equalCharacterIndex + 1);
    }

    toString(lineSeperator = '\r\n'): string {
        return [this.name, this.value].join("=");
    }
}

export class GroupElement extends LineElement {
    name: string = '';
    children: LineElement[] = [];
    constructor(lineOrName: string, items: LineElement[] = []) {
        super(lineOrName);
        let name = lineOrName.trim();
        if (name.at(0) == '[' && name.at(-1) == ']') {
            name = name.slice(1, -1);
        }
        this.name = name;
        this.children = items;
    }

    toString(): string
    toString(lineSeperator = '\r\n'): string {
        const header = "[" + this.name + "]";
        return [
            header,
            ...this.children.map(item => item.toString(lineSeperator)),
        ].join(lineSeperator);
    }

    getItemByName(name: string) {
        return this.getItems().find(item => item.name == name);
    }

    getItems() {
        return this.children.filter(item => item instanceof ItemElement);
    }
}

export class CommentElement extends LineElement {
    comment: string = '';

    constructor(comment: string) {
        super(comment);
        this.comment = comment.trimStart().slice(1);
    }

    toString(lineSeperator = '\r\n'): string {
        return "#" + this.comment;
    }
}

export class IniDocument {

    children: LineElement[] = [];

    constructor(text?: string)
    constructor(children?: LineElement[])
    constructor(childrenOrText?: LineElement[] | string) {
        if (Array.isArray(childrenOrText)) {
            this.children = childrenOrText;
            return;
        }
        if (typeof childrenOrText == "string") {
            this.children = IniDocument.parseText(childrenOrText);
            return;
        }
    }

    /**
     * Private methods
     */

    /**
     * Check if line is a group header
     * @param text Input line to check
     * @returns true if it's a group header, otherwise return false
     */
    private static isGroup(text: string): boolean {
        let finalText = text.trim();
        return finalText.length > 2
            && finalText.startsWith("[")
            && finalText.endsWith("]");
    }

    /**
     * Check if line is a comment
     * @param text Input line to check
     * @returns true if it's comment section, otherwise return false
     */
    private static isComment(text: string): boolean {
        let finalText = text.trimStart();
        return finalText.length > 1 && finalText.at(0) == '#';
    }

    /**
     * Check if line is a group item
     * @param text Input line to check
     * @returns true if it's group item, otherwise return false
     */
    private static isGroupItem(text: string): boolean {
        let finalText = text.trimStart();
        if (finalText.at(0) == '=') {
            return false;
        }
        const equalCharacterIndex = finalText.indexOf("=", 1);
        return equalCharacterIndex != -1 && equalCharacterIndex < finalText.length;
    }

    /**
     * parse text to ini items
     * @param text document content
     * @returns ini items
     */
    private static parseText(text: string): LineElement[] {
        const lineSeperator = /\r?\n/;
        const lines = text.split(lineSeperator);
        const items: LineElement[] = [];
        let currentGroup = undefined;
        for (const line of lines) {
            if (this.isGroup(line)) {
                if (currentGroup) {
                    items.push(new GroupElement(currentGroup.name, currentGroup.children))
                }
                currentGroup = new GroupElement(line, []);
                continue;
            }
            if (this.isComment(line)) {
                const comment = new CommentElement(line);
                if (!currentGroup) {
                    items.push(comment);
                    continue;
                }
                currentGroup.children.push(comment);
                continue;
            }
            if (this.isGroupItem(line)) {
                const item = new ItemElement(line);
                if (!currentGroup) {
                    items.push(item);
                    continue;
                }
                currentGroup.children.push(item)
                continue;
            }
            const lineItem = new LineElement(line);
            if (!currentGroup) {
                items.push(lineItem);
                continue;
            }
            currentGroup.children.push(lineItem);
        }
        if (currentGroup) {
            items.push(currentGroup);
        }
        return items;
    }

    static parse(text: string): IniDocument {
        const chidlren = IniDocument.parseText(text);
        return new IniDocument(chidlren);
    }

    getGroupByName(name: string) {
        return this.getGroups().find(group => group.name == name);
    }

    getGroups() {
        return this.children.filter(group => group instanceof GroupElement);
    }

    getItems() {
        return this.children.filter(item => item instanceof ItemElement);
    }

    getItemByName(name: string) {
        return this.getItems().find(item => item.name == name);
    }

    toString(lineSeperator = '\r\n'): string {
        return this.children
            .map(item => item.toString(lineSeperator))
            .join(lineSeperator);
    }
}