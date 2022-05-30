import md5 from 'md5';

export type IVocabulary = Vocabulary;

export class Vocabulary {
    public cla: string;
    public volSet: string;

    public id: string;
    public voc: string;
    public created: number;
    public updated: number;
    public properties: PropertySet[];
    public error: boolean;

    public r: Record<string, any>;

    private _updated: boolean = false;

    constructor(cla: string, volSet: string, voc: string, prop: any) {
        this.cla = cla;
        this.volSet = volSet;

        this.fromJSON(voc, prop)
    }

    public getId(): string {
        const format = `${this.cla}_${this.volSet}_${this.voc}`;

        return md5(format);
    }

    public fromJSON(voc: string, prop: any) {
        this.voc = voc;

        if (prop._id) {
            this.id = prop._id;
        } else {
            this.id = this.getId();
        }

        if (prop._created) {
            this.created = prop._created;
        } else {
            this.created = new Date().getTime()
        }

        if (prop._updated) {
            this.updated = prop._updated;
        } else {
            this.updated = new Date().getTime()
        }

        this.properties = [];
        for (const p in prop.contents) {
            const propertySet = new PropertySet(p, prop.contents[p])
            this.properties.push(propertySet);
        }

        this.r = {};
        if (prop.r) {
            this.r = prop.r;
        }

        if (prop.error !== undefined) {
            this.error = prop.error
        } else {
            this.error = false;
        }
    }

    public toJSON(): [voc: string, obj: any] {
        const _this = this;

        const obj = {
            contents: {} as any,
            r: _this.r,
            error: _this.error,
            _id: _this.id,
            _created: _this.created,
            _updated: _this._updated ? new Date().getTime() : _this.updated,
        };

        for (const prop of this.properties) {
            obj.contents[prop.type] = {}

            if (prop.tense) {
                obj.contents[prop.type].tense = prop.tense;
            }

            obj.contents[prop.type].list = [];
            for (const p of prop.properties) {
                const m = {
                    meaning: p.meaning,
                    example: p.example,
                } as any;

                if (p.plural != null) {
                    m.plural = p.plural;
                }

                obj.contents[prop.type].list.push(m);
            }
        }

        return [_this.voc, obj];
    }

    public markAsUpdated() {
        this._updated = true;
    }
}

class PropertySet {
    public type: string;

    public tense?: [pastTense: string, pastParticiple: string, presentParticiple: string] | null;

    public properties: Property[];

    constructor(propertyType: string, obj: any) {
        this.type = propertyType;

        if (['vi', 'vt', 'v'].includes(this.type)) {
            this.tense = obj.tense;
        } else {
            this.tense = null;
        }

        this.properties = [];
        for (const p of obj.list) {
            this.properties.push(new Property(p.meaning, p.example, p.plural));
        }
    }
}

class Property {
    public meaning: string;
    public example: string;
    public plural: string | null;

    constructor(meaning: string, example: string, plural: string | null) {
        this.meaning = meaning;
        this.example = example;
        this.plural = plural;
    }
}