// Original file: proto3/memorize.proto

import type { Word as _Word, Word__Output as _Word__Output } from './Word';

export interface GetNextWordResponse {
  'word'?: (_Word | null);
  'offset'?: (number);
  'total'?: (number);
  '_word'?: "word";
  '_offset'?: "offset";
  '_total'?: "total";
}

export interface GetNextWordResponse__Output {
  'word'?: (_Word__Output | null);
  'offset'?: (number);
  'total'?: (number);
  '_word': "word";
  '_offset': "offset";
  '_total': "total";
}
