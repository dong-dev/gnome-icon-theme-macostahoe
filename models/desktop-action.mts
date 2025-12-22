import type { ItemElement } from "./ini-document.mts";

export class DesktopAction {
    actionName = '';
    name = '';
    icon = '';
    exec = '';
    constructor(actionName: string, items: ItemElement[]) {
        this.actionName = actionName;
        
        for (const line of items) {
            if (line.name == "Name" && this.name === '') {
                this.name = line.value;
            }
            if (line.name == "Icon" && this.icon === '') {
                this.icon = line.value;
            }
            if (line.name == "Exec" && this.exec === '') {
                this.exec = line.value;
            }
        }
    }
}