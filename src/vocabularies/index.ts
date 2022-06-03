import { promises } from 'fs';
import { basename } from 'path';

export async function getVoc(claList: string[], offset: number = 0, limit: number = undefined): Promise<{ voc: string; cla: string }[]> {
    try {
        const dirs = await promises.readdir(`${__dirname}/`, { withFileTypes: true });

        const vocFiles = await Promise.all(
            dirs.filter(dir => dir.isFile() && dir.name.endsWith('.txt'))
                .filter(dir => {
                    if (claList.length === 0) return true;
                    const cla = basename(dir.name, '.txt');
                    console.log(claList, cla);
                    return claList.includes(cla);
                })
                .map(async dir => {
                    const cla = basename(dir.name, '.txt');

                    return [cla, await promises.readFile(__dirname + '/' + dir.name, { encoding: 'utf-8' })];
                }),
        );
        console.log(vocFiles.length)
        const vocs: { voc: string, cla: string }[] = [];
        for (const [cla, file] of vocFiles) {
            file.split('\n').filter(Boolean).forEach(line => {
                vocs.push({
                    cla,
                    voc: line.trim(),
                });
            })
        }

        return vocs.slice(offset, limit ? limit : vocs.length);
    } catch (err) {
        console.error('getVoc error')
        throw err;
    }
}