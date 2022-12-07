import { TableBase } from "@/entity/base";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// export enum Level {
//     NULL,
//     A1,
//     A2,
//     B1,
//     B2,
//     C1,
//     C2,
// }

export enum PartOfSpeech {
    Adjective,
    Nouns,
    Verbs,
    Adverb,
    Conjunction,
    Determiner,
    Number,
    OrdinalNumber,
    Preposition,
    Predeterminer,
    Pronoun,
    Prefix,
    Suffix,
    Exclamation,
}

@Entity()
export class MVocabulary extends TableBase {
    @Index()
    @Column()
    public spelling: string;

    @Index()
    @Column()
    public dict: string;
}



@Entity()
export class MPartOfSpeech extends TableBase {
    @Index()
    @Column()
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Index()
    @Column()
    public pos: string;
}

@Entity()
export class MSense extends TableBase {
    @Index()
    @Column()
    @ManyToOne(() => MPartOfSpeech, (pos) => pos.id)
    public posId: number;

    @Index()
    @Column()
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Index()
    @Column()
    public title: string;
}

@Entity()
export class MPronunciation extends TableBase {
    @Index()
    @Column()
    public ipa: string;

    @Index()
    @Column()
    @ManyToOne(() => MPartOfSpeech, (pos) => pos.id)
    public posId: number;

    @Index()
    @Column()
    public audio: Buffer;
}


@Entity()
export class MSenseDefinition extends TableBase {
    @Index()
    @Column({ default: null, })
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Column()
    public defininition: string;

    // @Index()
    // @Column()
    // public level: Level;
}

@Entity()
export class MPhrase extends TableBase {
    @Index()
    @Column()
    @ManyToOne(() => MSense, (sense) => sense.id)
    public senseId: number;

    @Index()
    @Column()
    public phrase: string;
}

@Entity()
export class MExample extends TableBase {
    @Index()
    @Column()
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Index()
    @Column()
    @ManyToOne(() => MSenseDefinition, (def) => def.id)
    public defId: number;

    @Index()
    @Column()
    public example: string;
}