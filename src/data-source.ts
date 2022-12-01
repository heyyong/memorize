import "reflect-metadata"
import { DataSource } from "typeorm"

import { User } from '@/entity/user';
import { VocSet, VocSetToVoc } from "@/entity/wordSet";
import { Voc, Property, Meaning, Pronunciation, Example, } from '@/entity/vocabularies';
import { DailyWordList, MemoDailyWordRecordDetail } from "@/entity/memoRecords";

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './memorize.sqlite3',

    synchronize: true,
    logging: false,
    entities: [
        // User
        User,

        // Vocabularies
        Voc, Property, Meaning, Pronunciation, Example,

        // VocSet
        VocSet, VocSetToVoc,

        // memoRecords
        DailyWordList, MemoDailyWordRecordDetail,
    ],
    migrations: [],
    subscribers: [],
})
