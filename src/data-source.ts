import { Task } from "@/entity/task";
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Voc, Property, Meaning, Pronunciation, Example, MemorizedRecord, MemorizedPlan } from './entity/voc';
import { ClaCoverRate, MovieSubtitle } from '@/entity/movie'

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './memorize.sqlite3',

    synchronize: true,
    logging: false,
    entities: [
        Voc, Property, Meaning, Pronunciation, Example, MemorizedRecord, MemorizedPlan, Task,
        MovieSubtitle, ClaCoverRate,
    ],
    migrations: [],
    subscribers: [],
})
