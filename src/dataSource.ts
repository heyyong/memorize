import "reflect-metadata"
import { DataSource } from "typeorm"

import { MUser } from '@/entity/user';
import { MVocSet, MVocSetToVoc } from "@/entity/wordSet";
import { MDailyWordList, MMemoDailyWordRecordDetail } from "@/entity/memoRecords";

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './memorize.sqlite3',

    synchronize: true,
    logging: false,
    entities: [
        // User
        MUser,

        // Vocabularies

        // VocSet
        MVocSet, MVocSetToVoc,

        // memoRecords
        MDailyWordList, MMemoDailyWordRecordDetail,
    ],
    migrations: [],
    subscribers: [],
})
