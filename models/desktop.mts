import { DesktopAction } from "./desktop-action.mts";
import { DesktopEntry } from "./desktop-entry.mts";
import {
    IniDocument,
    GroupElement,
    ItemElement,
} from "./ini-document.mts";

export class Desktop {
    filename = '';
    entry?: DesktopEntry = undefined;
    actions: DesktopAction[] = [];

    constructor(content: string, filename: string) {
        this.filename = filename;
        const document = new IniDocument(content);
        const desktopGroups = document.children.filter(item => item instanceof GroupElement);
        for (const desktopGroup of desktopGroups) {
            if (desktopGroup.name == 'Desktop Entry') {
                this.entry = new DesktopEntry(desktopGroup);
                continue;
            }
            if (desktopGroup.name.startsWith('Desktop Action ')) {
                const actionName = desktopGroup.name.slice(15).trim();
                if (!actionName) {
                    continue;
                }
                const actionContent = desktopGroup.children.filter(item => item instanceof ItemElement);
                const action = new DesktopAction(actionName, actionContent);
                this.actions.push(action);
                continue;
            }
        }
    }

}