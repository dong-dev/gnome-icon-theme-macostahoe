import { ItemElement, type GroupElement } from "./ini-document.mts";

export class DesktopEntry {
    name = '';
    type = '';
    icon = '';
    mimeType: string[] = [];
    exec = '';
    noDisplay = false;
    constructor(group: GroupElement) {
        let isNameFound = false;
        let isTypeFound = false;
        let isIconFound = false;
        let isMimeTypeFound = false;
        let isExecFound = false;
        let isNoDisplayFound = false;
        for (const item of group.children.filter(item => item instanceof ItemElement)) {
            if (item.name == "Name") {
                if (!isNameFound) {
                    this.name = item.value;
                    isNameFound = true;
                }
            }
            else if (item.name == "MimeType") {
                if (!isMimeTypeFound) {
                    this.mimeType = item.value.split(";").filter(mime => mime.length > 0);
                    isMimeTypeFound = true;
                }
            }
            else if (item.name == "Icon") {
                if (!isIconFound) {
                    this.icon = item.value;
                    isIconFound = true;
                }
            }
            else if (item.name == "Exec") {
                if (!isExecFound) {
                    this.exec = item.value;
                    isExecFound = true;
                }
            }
            else if (item.name == "Type") {
                if (!isTypeFound) {
                    this.type = item.value;
                    isNameFound = true;
                }
            }
            else if (item.name == "NoDisplay") {
                if (!isNoDisplayFound) {
                    let boolValue = item.value;
                    this.noDisplay = boolValue.toLowerCase() == "true";
                    isNoDisplayFound = true;
                }
            }
            if (
                isNameFound
                && isTypeFound
                && isIconFound
                && isMimeTypeFound
                && isExecFound
                && isNoDisplayFound
            ) {
                break;
            }
        }
    }
}