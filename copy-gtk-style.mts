#!/usr/bin/env node

import { homedir } from 'os'
import { resolve } from 'path';
import { cp } from 'fs/promises';
import { existsSync } from 'fs';
export class CopyFileEntry {
    source: string = '';
    destination: string = '';
    constructor(source: string, destination: string) {
        this.source = source;
        this.destination = destination;
    }
}


const filesToCopy: CopyFileEntry[] = [
    new CopyFileEntry('./config/gtk/3.0/gtk.css', resolve(homedir(), '.config', 'gtk-3.0', 'gtk.css')),
    new CopyFileEntry('./config/gtk/4.0/gtk.css', resolve(homedir(), '.config', 'gtk-4.0', 'gtk.css')),
];

for (const { source, destination } of filesToCopy) {
    if (!existsSync(source)) {
        console.warn('File', source, 'not found!');
        continue;
    }
    if (existsSync(destination)) {
        console.warn('File', destination.replace(homedir(), '~'), 'already exists, override it now!');
    }
    await cp(source, destination, { recursive: true });
}