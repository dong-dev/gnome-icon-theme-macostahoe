#!/usr/bin/env node

const { exec: originalExec } = require('child_process');

function exec(command) {
    return new Promise((resolve, reject) => {
        originalExec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            if (stderr) {
                reject(new Error(stderr))
                return;
            }
            resolve(stdout);
        });
    })
}

let sizes = [
    16,
    22,
    24,
    32,
    36,
    48,
    64,
    72,
    96,
    128,
    192,
    256,
]
let imageNameMap = {
    ActivityMonitor: [
        "org.gnome.SystemMonitor",
    ],
    AppleTV: [
    ],
    AppStore: [
        "org.gnome.Software",
    ],
    Calculator: [
        "org.gnome.Calculator",
    ],
    Calendar: [
        "org.gnome.Calendar",
    ],
    Clock: [
        "org.gnome.clocks",
    ],
    Code: [
        "vscode",
    ],
    Console: [
        "org.gnome.Logs",
    ],
    Contact: [
    ],
    DiskUnity: [
        "org.gnome.DiskUtility",
    ],
    Finder: [
        "org.gnome.Nautilus",
    ],
    FontBook: [
        "org.gnome.font-viewer",
    ],
    Godot: [
        "godot",
    ],
    Help: [
    ],
    Map: [
    ],
    Music: [
        "org.gnome.Decibels",
    ],
    Passwords: [
    ],
    PhotoBooth: [
    ],
    Photos: [
    ],
    QuicktimePlayer: [
        "org.gnome.Showtime",
    ],
    Safari: [
        "firefox",
    ],
    SystemSettings: [
        "org.gnome.Settings",
    ],
    Terminal: [
        "org.gnome.Ptyxis",
    ],
    TextEditor: [
        "org.gnome.TextEditor",
    ],
}

async function generateImage(size, isHDPI, originalName, expectedName) {
    const command = `magick ./original/apps/${originalName}.png -units PixelsPerInch -set density ${isHDPI ? 72 * 2 : 72} -resize ${isHDPI ? size * 2 : size}x ./${size}x${size}${isHDPI ? "@2" : ""}/apps/${expectedName}.png`;
    return await exec(command)
}

(async () => {
    for (const originalName of Object.keys(imageNameMap)) {
        const expectedNames = imageNameMap[originalName];
        if (expectedNames === null || !Array.isArray(expectedNames)) {
            continue;
        }
        for (const expectedName of expectedNames) {
            for (const size of sizes) {
                const [result1x, result2x] = await Promise.all([generateImage(size, false, originalName, expectedName), generateImage(size, true, originalName, expectedName)])
            }
        }
    }
})()