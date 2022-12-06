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
export class MVocabulary {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public spelling: string;

    @Index()
    @Column()
    public dict: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}



@Entity()
export class MPartOfSpeech {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Index()
    @Column()
    public pos: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class MSense {
    @PrimaryGeneratedColumn()
    public id: number;

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
    public sense: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class MPronunciation {
    @PrimaryGeneratedColumn()
    public id: number;

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

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}


@Entity()
export class MSenseDefinition {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column({ default: null, })
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Column()
    public defininition: string;

    // @Index()
    // @Column()
    // public level: Level;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class MPhrase {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    @ManyToOne(() => MSense, (sense) => sense.id)
    public senseId: number;

    @Index()
    @Column()
    public phrase: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class MExample {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    @ManyToOne(() => MVocabulary, (voc) => voc.id)
    public vocId: number;

    @Index()
    @Column()
    @ManyToOne(() => MSenseDefinition, (def) => def.id)
    public defId: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}