import { Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity()
export class ClaCoverRate {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public cla: string;

    @Index()
    @Column()
    public subtitleId: number;

    @Column()
    public words: number;

    @Column()
    public covered: number;

    @Column()
    public rate: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;

    @Column('simple-array')
    public unknown: string[]
}

@Entity()
export class MovieSubtitle {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public name: string;

    @Index()
    @Column()
    public episodeName: string;

    @Column()
    public season: string;

    @Column()
    public episode: string;

    @Column()
    public srtContent: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}
