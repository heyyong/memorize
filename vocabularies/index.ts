import Ajv, { Schema, ValidateFunction } from 'ajv';
import ajvError from 'ajv-errors';
import { parse, stringify } from 'yaml';
import { basename, join } from 'path';
import { readFileSync, promises } from 'fs';

import { Vocabulary } from './Vocabulary';

export { IVocabulary } from './Vocabulary';

export const VocAddr = __dirname;

let schema: Schema | null = null;
try {
    const schemaAddr = __dirname + '/schema.yaml'
    const buf = readFileSync(schemaAddr, { encoding: 'utf-8' });
    schema = parse(buf);
    console.log('read schema success')
} catch (err) {
    console.error(`getSchema error`);
    process.exit(1);
}

let validate: ValidateFunction<Vocabulary> | null = null;
try {
    const ajv = new Ajv({ allErrors: true });
    ajvError(ajv);
    validate = ajv.compile<any>(schema!)!;
} catch (err) {
    console.error('compile schema failed')
    process.exit(1);
}

const vocAddr = __dirname;

export async function getVocClassification(): Promise<string[]> {
    try {
        const dirents = await promises.readdir(vocAddr, { withFileTypes: true });

        const collection = dirents.filter(dir => dir.isDirectory()).map(dir => join(vocAddr, dir.name))

        return collection;
    } catch (err) {
        console.error('getVocClassification error!')
        process.exit(1);
    }
}

export async function getVocabularies(collAddr: string): Promise<Vocabulary[]> {
    try {
        const collName = basename(collAddr)
        const dirents = await promises.readdir(collAddr, { withFileTypes: true });

        const files = dirents.filter(dir => dir.isFile() && dir.name.endsWith('.yaml'));

        const vocSets: Vocabulary[] = [];
        for (const file of files) {
            const fileAddr = join(vocAddr, collName, file.name);
            const content = await promises.readFile(fileAddr, { encoding: 'utf-8' });
            const rawVocSet = parse(content);


            for (const key in rawVocSet) {
                if (!validate!(rawVocSet[key])) {
                    const err = validate!.errors![validate?.errors?.length! - 1];
                    console.log(`${key} failed`, err);
                    process.exit(1);
                }

                const voc = new Vocabulary(collName, file.name, key, rawVocSet[key])
                vocSets.push(voc)
            }
        }

        return vocSets
    } catch (err) {
        console.error('validate error: ', err);
        process.exit(1);
    }
}


export async function writeBackVoc(call: string, vocSet: string, vocs: Vocabulary[]): Promise<void> {
    const vocObj = {} as any;
    for (const voc of vocs) {
        const [key, json] = voc.toJSON()
        vocObj[key] = json;
    }

    const str = stringify(vocObj)
    await promises.writeFile(join(vocAddr, call, vocSet), str)
}

