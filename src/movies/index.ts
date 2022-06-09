import { AppDataSource } from '@/data-source';
import { ClaCoverRate, MovieSubtitle } from '@/entity/movie';
import { Voc } from '@/entity/voc';
import { promises } from 'fs';

async function readSubtitles() {
    let dirs = await promises.readdir(__dirname, { withFileTypes: true });
    dirs = dirs.filter(dir => dir.isFile() && dir.name.endsWith('.srt'));

    const subtitleReg = AppDataSource.getRepository(MovieSubtitle);
    for (const dir of dirs) {
        const file = await promises.readFile(`${__dirname}/${dir.name}`, { encoding: 'utf-8' });

        const reg = /Love Death and Robots S(\d+)E(\d+) - ([\w\s']+) \(NetNaija\.com\)\.srt/;
        console.log(dir.name);
        const [, season, episode, episodeName] = reg.exec(dir.name);

        const subtitle = new MovieSubtitle();
        subtitle.name = 'Love Death and Robots';
        subtitle.episodeName = episodeName;
        subtitle.season = season;
        subtitle.episode = episode;
        subtitle.srtContent = file;

        await subtitleReg.save(subtitle);
        console.log('save subtitle');
    }

    return;
}

async function getClaVocMap(cla: string): Promise<Record<string, boolean>> {
    const map: Record<string, boolean> = {};
    const vocReg = AppDataSource.getRepository(Voc);

    for (const voc of await vocReg.find({ where: { cla: 'cet4' } })) {
        map[voc.voc] = false;
    }

    return map;
}

async function summarizeVocs(cla: string, map: Record<string, boolean>, name: string) {
    const subtitleReg = AppDataSource.getRepository(MovieSubtitle);
    const coverReg = AppDataSource.getRepository(ClaCoverRate);
    const subtitles = await subtitleReg.find({ where: { name } });

    for (const subtitle of subtitles) {
        console.log('summarize ' + subtitle.name + ' ' + subtitle.episodeName);
        const content = subtitle
            .srtContent.split('\n\n')
            .map(item => item.split('\n'))
            .map(item => item.slice(2))
            .map(item => item.map(line => {
                if (line.startsWith('[')) line = line.slice(1);
                if (line.endsWith(']')) line = line.slice(line.length - 1);

                return line;
            }));

        const cloned: Record<string, boolean> = {}
        for (let key in map) {
            cloned[key] = map[key];
        }

        let wordMap: Record<string, boolean> = {};
        for (const paragraph of content) {
            for (const line of paragraph) {
                const words = line
                    .split(/[\s|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]+/)
                    .filter(w => !/^\d+$/.test(w))
                    .map(w => w.toLowerCase());

                for (const word of words) {
                    wordMap[word] = true;
                }
            }
        }

        let covered: number = 0;
        let unknown: string[] = [];
        for (const w in wordMap) {
            if (w in cloned) covered++
            else unknown.push(w);
        }


        const rate = Math.ceil((covered / Object.keys(wordMap).length) * 100);
        console.log(rate);
        const coverRate = new ClaCoverRate();
        coverRate.cla = cla;
        coverRate.subtitleId = subtitle.id;
        coverRate.words = Object.keys(wordMap).length;
        coverRate.covered = covered;
        coverRate.rate = rate;
        coverRate.unknown = unknown;

        await coverReg.save(coverRate);
    }

}

(async () => {
    try {
        await AppDataSource.initialize()
        const vocMap = await getClaVocMap('cet4');
        await summarizeVocs('cet4', vocMap, 'Love Death and Robots');

    } catch (err) {
        console.error(err);
    }
})()