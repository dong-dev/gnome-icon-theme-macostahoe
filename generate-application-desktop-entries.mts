import { readdir, readFile, writeFile } from 'fs/promises'
import { resolve } from 'path';
import { CommentElement, GroupElement, IniDocument, ItemElement, LineElement } from './models/ini-document.mts';

const applicationFolder = resolve('./original/database/applications')

const desktopFiles = (await readdir(applicationFolder)).filter(path => path.endsWith('.desktop'));
for (const desktopFile of desktopFiles) {

    const content = await readFile(resolve(applicationFolder, desktopFile), 'utf-8');
    const document = new IniDocument(content);
    document.children = document.children.map(child => {
        if (child instanceof GroupElement) {
            child.children = child.children.filter(
                line => {
                    if (line instanceof ItemElement && line.name.match(/^(Name|Keywords|Comment|GenericName)\[/)) {
                        return false;
                    }
                    return true;
                }
            )
        }
        return child
    })
    await writeFile(resolve(applicationFolder, desktopFile), document.toString('\n'), 'utf-8');
}