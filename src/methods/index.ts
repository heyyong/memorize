import { MemorizeServiceHandlers } from './memorize/MemorizeService';
import { genNewMemorizePlan } from './genNewMemorizePlan';
import { triggerWordSync } from '@/methods/triggerWordSync';
import { getNextWord } from '@/methods/getNextWord';
import { markWord } from '@/methods/markWord';
import { getWordList } from '@/methods/getWordList';

export const methods: MemorizeServiceHandlers = {
    genNewMemorizePlan,
    triggerWordSync,
    getNextWord,
    markWord,
    getWordList,
} as any;
