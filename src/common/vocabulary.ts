import { PartOfSpeech } from "@/entity/vocabularies";

export class Vocabulary {
    public spelling: string;
    public dict: string;

    public posMap: Map<string, PoS>;
}

export class PoS extends Array<Sense> {
    public pos: string;

    public pron: Pronoun;
}

export class Pronoun {
    public ipa: string;

    public audio: Buffer;
}

export class Sense {
    public title: string;

    public phrase: string[];

    public definitions: {
        definition: string;
        examples: string[];
    }[];
}