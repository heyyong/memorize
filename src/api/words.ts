import { get, taskQueue } from './req';

export interface RetrieveEntry {
    metadata: object;
    results: HeadwordEntry[];
}

export interface HeadwordEntry {
    id: string;
    language: string;
    lexicalEntries: LexicalEntry[];
    pronunciations: PronunciationsList;
    type: string;
    word: string;
}

interface LexicalEntry {
    compounds: RelatedEntriesArray[];
    derivativeOf: RelatedEntriesArray[];
    entries: Entry[];
    grammaticalFeatures: GrammaticalFeaturesList;
    language: string;
    lexicalCategory: LexicalCategory;
    notes: CategorizedTextList;
    phrasalVerbs: RelatedEntriesArray;
    phrases: RelatedEntriesArray;
    pronunciations: PronunciationsList;
    root: string;
    text: string;
    variantForms: VariantFormsList;
}

interface Entry {
    crossReferenceMarkers: string[];
    crossReference: CrossReferencesList;
    etymologies: string[];
    grammaticalFeatures: GrammaticalFeaturesList;
    homographNumber: string;
    inflections: InflectedForm[];
    notes: CategorizedTextList;
    pronunciations: PronunciationsList;
    senses: Sense[];
    variantForms: VariantFormsList;
}

interface Sense {
    anotonmys: SynonymsAntonyms;
    constructions: InlineModel2[];
    crossReferenceMarkers: string[];
    crossReferences: CrossReferencesList;
    definitions: string[];
    domainClasses: DomainClassesList;
    domains: DomainsList;
    etymologies: string[];
    examples: ExamplesList;
    id: string;
    inflections: InflectedForm[];
    notes: CategorizedTextList;
    pronunciations: PronunciationsList;
    regions: RegionsList[];
    registers: RegistersList;
    semanticClasses: SemanticClassesList;
    shortDefinitions: string[];
    subsensess: Sense[];
    synonyms: SynonymsAntonyms;
    thesaurusLinks: ThesaurusLink[];
    variantForms: VariantFormsList;
}

interface InflectedForm {
    domains: DomainsList;
    grammaticalFeatures: GrammaticalFeaturesList;
    inflectedForm: string;
    lexicalCategory: LexicalCategory;
    pronunciations: PronunciationsList;
    regions: RegionsList;
    registers: RegistersList;
}


interface LexicalCategory {
    id: string;
    text: string;
}

interface InlineModel1 {
    audioFile: string;
    dialects: string[]
    phoneticNotation: string;
    phoneticSpelling: string;
    regions: RegionsList;
    registers: RegistersList;
}

interface InlineModel2 {
    domains: DomainsList;
    id: string;
    language: string;
    regions: RegionsList;
    registers: RegistersList;
    text: string;
}

interface InlineModel3 {
    id: string;
    text: string;
    type: string;
}

interface InlineModel4 {
    id: string;
    text: string;
    type: string;
}

interface InlineModel5 {
    domains: DomainsList;
    notes: CategorizedTextList;
    pronunciations: PronunciationsList;
    regions: RegionsList;
    registers: RegistersList;
    text: string;
}

interface InlineModel6 {
    id: string;
    text: string;
    type: string;
}

interface InlineModel7 {
    id: string;
    text: string;
}

interface InlineModel8 {
    id: string;
    text: string;
}

interface InlineModel9 {
    id: string;
    text: string;
}

interface InlineModel10 {
    domains: DomainsList;
    id: string;
    language: string;
    regions: RegionsList;
    registers: RegistersList;
    text: string;
}

interface InlineModel11 {
    id: string;
    text: string;
}

interface InlineModel13 {
    id: string;
    text: string;
}

interface ThesaurusLink {
    entry_id: string;
    sense_id: string;
}

type RegionsList = InlineModel7[];
type RegistersList = InlineModel8[];
type VariantFormsList = InlineModel5[]
type DomainsList = InlineModel9[];
type CategorizedTextList = InlineModel4[];
type RelatedEntriesArray = InlineModel2[];
type SynonymsAntonyms = InlineModel10[];
type SemanticClassesList = InlineModel13[];
type ExamplesList = InlineModel2[];
type GrammaticalFeaturesList = InlineModel3[];
type DomainClassesList = InlineModel11[];
type CrossReferencesList = InlineModel6[];
export type PronunciationsList = InlineModel1[];

export const getWord = taskQueue(5, 60, async function getWord(lang: string, word: string): Promise<RetrieveEntry> {
    try {
        console.log(`start to request getWord(${lang}, ${word})`)
        const { data } = await get(`/api/v2/words/${lang}?q=${word}`);
        console.log(`finish to request getWord(${lang}, ${word})`)

        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
})