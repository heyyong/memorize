import { program } from 'commander';
import { format } from 'date-fns';
import mdpdf from 'markdown-pdf';
import { promises } from 'fs';
import { genMarkdown } from './file';

import pkg from './package.json';
import { getVocabularies, getVocClassification, IVocabulary } from './vocabularies';

const CACHE_ADDR = __dirname + '/.cache';
const ADDR = process.cwd();
console.log(process.argv);
program
    .name('memorize')
    .version(pkg.version);

program
    .argument('<generate>')
    .option('-f, --from <from...>')
    .action(async (_: string, options: Record<string, any>) => {
        try {
            const clas = await getVocClassification()
            const vocSets = await Promise.all(clas.map(cla => getVocabularies(cla)));

            const vocList = checkUnique(vocSets);
            console.log(`vocabularies load! total: ${vocList.length}`)

            const result: IVocabulary[] = [];

            // Load from
            const froms: [cla: string, set: string][] = [];
            {
                for (const from of options.from as string[]) {
                    if (!from || typeof from != 'string' || from.split('/').length !== 2) {
                        throw new Error('need generate! format like <cla>/<set>');
                    } else {
                        const [cla, set] = from.split('/') as [string, string];
                        froms.push([cla, set]);
                    }
                }

                for (const voc of vocList) {
                    for (const [cla, set] of froms) {
                        if (voc.cla === cla && voc.volSet === set) {
                            result.push(voc);
                        }
                    }
                }
                console.log(`Load ${options.from} success. total ${result.length}`);
            }

            let cache: string = '';
            {
                cache = await generateCache(froms.map(([cla,]) => cla), result);
                console.log('Generate cache success! ' + cache);
            }

            // Convert to PDF
            {
                mdpdf().from(cache).to(ADDR + `/${format(new Date(), 'yyyy_MM_dd')}.pdf`, () => {
                    console.log('Done');
                });
            }
        } catch (err) {
            console.error('process exit!')
            console.error(err)
            process.exit(1);
        }
    });

program.parse(process.argv);

async function generateCache(vocSetList: string[], vocList: IVocabulary[]): Promise<string> {
    const content = await genMarkdown(vocList);
    const file = CACHE_ADDR + `/${vocSetList.join(',')}_${format(new Date(), 'yyyy_MM_dd')}.md`
    await promises.writeFile(file, content)

    return file;
}

function checkUnique(vocSets: IVocabulary[][]): IVocabulary[] {
    const vocMap: Record<string, IVocabulary> = {};

    let err: boolean = false;

    const vocList: IVocabulary[] = [];
    for (const vocSet of vocSets) {
        for (const voc of vocSet) {
            if (!(voc.voc in vocMap)) {
                vocMap[voc.voc] = voc;
                vocList.push(voc);
                continue;
            }

            err = true;
            const dup = vocMap[voc.voc];
            console.error(`Duplicate word: ${voc.voc}. from ${dup.cla},${dup.volSet}; to ${voc.cla},${dup.volSet}`);
        }
    }

    if (err) {
        throw new Error(`Duplicate error`);
    }

    return vocList;
}