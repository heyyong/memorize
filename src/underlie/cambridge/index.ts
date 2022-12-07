import { XMLParser } from 'fast-xml-parser';
import { get } from '@/underlie/cambridge/api';
import { Vocabulary, PoS, Pronoun, Sense } from '@/common/vocabulary';

export enum CambridgeDicCode {
    'British' = 'british',
    'EssentialBritishEnglish' = 'essential-british-english',
    'EssentialAmericanEnglish' = 'essential-american-english',
    'AmericanEnglish' = 'american-english',
    'BusinessEnglish' = 'business-english',
    'LearnerEnglish' = 'lerner-english',
}

const xmlParser = new XMLParser();

const assignArray = (object: any, key: string) => {
    // if (key === 'def-block')
    //     console.log(object['def-block'])

    if (!object[key]) object[key] = [];
    else if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
    }

    return object[key];
}

export async function getEntry(entryId: string, dict = CambridgeDicCode.AmericanEnglish) {
    const resp = await get<{ entryContent: string }>(`/dictionaries/${dict}/entries/${entryId}/?format=xml`);

    const dictContent = xmlParser.parse(resp.data.entryContent).di;

    const voc = new Vocabulary(); {
        voc.spelling = dictContent.header.title;
        voc.dict = `Cambridge(${dict})`;
        voc.posMap = new Map();
    };

    for (const posXML of assignArray(dictContent, 'pos-block')) {
        const pos = new PoS();
        (pos.pos = posXML.header.info.posgram.pos, `posXML's posgram shouldn't be empty`);

        const pron = new Pronoun();
        (pron.ipa = posXML.header.info.info.pron.ipa, `posXML's pron ipa shouldn't be empty`);

        for (const senseXML of assignArray(posXML, 'sense-block')) {
            const sense = new Sense();
            sense.title = senseXML.header?.title || '';
            sense.phrase = [];
            sense.definitions = [];

            for (const defXML of assignArray(senseXML, 'def-block')) {
                const def = {
                    definition: defXML.definition.def,
                    examples: [],
                };

                for (const exXML of assignArray(defXML, 'examp')) {
                    def.examples.push(exXML.eg)
                }
                console.log(def);
                sense.definitions.push(def);
            }
            pos.push(sense)
        }

        pos.pron = pron;
        voc.posMap.set(pos.pos, pos);
    }

    return voc;
}