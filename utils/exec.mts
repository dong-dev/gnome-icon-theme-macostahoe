import { exec } from "node:child_process";

export function Exec(command: string) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
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