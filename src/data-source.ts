import "reflect-metadata"
import { DataSource } from "typeorm"
import { Voc, Property, Meaning, Pronunciation, Example } from './entity/voc';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './memorize.sqlite3',

    synchronize: true,
    logging: false,
    entities: [Voc, Property, Meaning, Pronunciation, Example],
    migrations: [],
    subscribers: [],
})
