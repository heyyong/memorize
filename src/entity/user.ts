import { TableBase } from "@/entity/base";
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MUser extends TableBase {
    @Index()
    @Column()
    public username: string;

    @Index()
    @Column()
    public token: string;
}