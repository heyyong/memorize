export class Voc {
    public voc: string;
    public cla: string;
    public pron: {
        audio: string;
        phonetic: string;
    }

    constructor(obj: any) {
        this.voc = obj.voc;
        this.cla = obj.cla;
        this.pron = obj.pron;
    }
}