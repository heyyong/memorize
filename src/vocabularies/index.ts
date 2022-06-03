import { promises } from 'fs';
import { basename } from 'path';

export async function getVoc(): Promise<{ voc: string; cla: string }[]> {
    try {
        const dirs = await promises.readdir(`${__dirname}/`, { withFileTypes: true });

        const vocFiles = await Promise.all(
            dirs.filter(dir => dir.isFile() && dir.name.endsWith('.txt'))
                .map(async dir => {
                    const cla = basename(dir.name, '.txt');

                    return [cla, await promises.readFile(__dirname + '/' + dir.name, { encoding: 'utf-8' })];
                }),
        );

        const vocs: { voc: string, cla: string }[] = [];
        for (const [cla, file] of vocFiles) {
            file.split('\n').filter(Boolean).forEach(line => {
                vocs.push({
                    cla,
                    voc: line.trim(),
                });
            })
        }

        return vocs;
    } catch (err) {
        console.error('getVoc error')
        throw err;
    }
}