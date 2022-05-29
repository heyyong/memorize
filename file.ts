import { format } from 'date-fns';

import { IVocabulary } from './vocabularies/Vocabulary';

export function genMarkdown(vocs: IVocabulary[]): string {
    const today = format(new Date(), 'yyyy-MM-dd')

    const targetMap: Record<string, boolean> = {};
    for (const voc of vocs) {
        const target = `${voc.cla}/${voc.volSet}`;
        if (!(target in targetMap))
            targetMap[target] = true;
        continue;
    }

    const ranVocs = vocs.slice().sort(() => Math.random() - 0.5);

    const title = `# ${Object.keys(targetMap).join(',')};${today};`;
    let content: string = '';
    content += title + '\n\n';

    for (let i = 0; i < ranVocs.length; i++) {
        const voc = ranVocs[i];
        const index = `${i + 1},${voc.id.slice(0, 6)}:` + `\n\n`;

        let conList: string = ``;
        for (let j = 0; j < voc.properties.length; j++) {
            const propertySet = voc.properties[j];

            conList += `* ${propertySet.type}:`;
            // if (['vi', 'vt'].includes(propertySet.type)) {
            // conList += /*'<!-- Here write participle -->'*/;
            // }
            conList += '\n';

            let meanList: string = '';
            for (const { meaning } of propertySet.properties) {
                meanList += `    * ${meaning}\n`;
            }

            conList += meanList;
        }

        content += index + conList + '---\n\n';
    }

    return content;
}
