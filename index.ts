import { program } from 'commander';
import { format } from 'date-fns';
import mdpdf from 'markdown-pdf';
import { promises } from 'fs';
import { join } from 'path';

import { genMarkdown } from './file';
import pkg from './package.json';
import { getVocabularies, getVocClassification, IVocabulary, VocAddr } from './vocabularies';
import { stringify } from 'yaml';
import { Vocabulary } from './vocabularies/Vocabulary';

const CACHE_ADDR = __dirname + '/.cache';
const ADDR = process.cwd();

program
    .name('memorize')
    .version(pkg.version);

program
    .argument('<generate>')
    .option('-f, --from <from...>')
    .option('-e, --error <error...>')
    .action(async (_: string, options: Record<string, any>) => {
        try {
            const clas = await getVocClassification()
            const vocSets = await Promise.all(clas.map(cla => getVocabularies(cla)));

            const uniqVocList = checkUnique(vocSets);
            console.log(`vocabularies load! total: ${uniqVocList.length}`)

            // write back
            await writeBack(uniqVocList)

            // Load from
            const { froms, vocResult } = filterVoc(options as any, uniqVocList)

            // generate cache
            let cache: string = '';
            {
                cache = await generateCache(froms.map(([cla,]) => cla), vocResult);
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

async function writeBack(uniqVocList: IVocabulary[]): Promise<void> {
    const writeBack: Record<string, IVocabulary[]> = {}
    for (const voc of uniqVocList) {
        const addr = join(voc.cla, voc.volSet);

        if (!(addr in writeBack)) {
            writeBack[addr] = [];
        }

        writeBack[addr].push(voc)
    }

    await Promise.all(Object.keys(writeBack).map(addr => {
        const vocSet = writeBack[addr]!;

        const file: any = {};
        for (let voc of vocSet) {
            const [spell, json] = voc.toJSON()
            file[spell] = json;
        }

        const str = stringify(file)

        return promises.writeFile(join(VocAddr, addr), str)
    }));
    console.log('update source success!');
}

function filterVoc(options: { from: string[], error?: string[] }, uniqVocList: Vocabulary[]): { froms: [cla: string, set: string][], vocResult: IVocabulary[] } {
    if (!options.from) throw new Error('options.from is necessary')

    let filter: string[] = options.from.slice();
    if (options.error !== undefined) {
        filter = filter.concat(options.error)
    }


    const froms: [cla: string, set: string][] = [];
    for (const from of options.from as string[]) {
        const r = parseCla(from);
        froms.push(r);
    }

    const errors: [cla: string, set: string][] = [];
    for (const e of options.error || []) {
        const r = parseCla(e);
        errors.push(r);
    }


    const vocResult: IVocabulary[] = [];
    for (const voc of uniqVocList) {
        let found = false;

        for (const f of froms) {
            if (voc.belong(f)) {
                vocResult.push(voc);
                found = true;
                break;
            }
        }

        if (!found) {
            for (const e of errors) {
                if (voc.belong(e)) {
                    vocResult.push(voc)
                }
                break;
            }
        }
    }
    console.log(`Load ${options.from} success. total ${vocResult.length}`);

    return {
        froms: froms,
        vocResult: vocResult,
    };
}

function parseCla(addr: string): [cla: string, set: string] {
    if (!addr || typeof addr !== 'string' || addr.split('/').length !== 2) {
        throw new Error('need from argv! format like <cla>/<set>');
    }

    return addr.split('/') as [string, string];
}