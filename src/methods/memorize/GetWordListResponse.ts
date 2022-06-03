// Original file: proto3/memorize.proto

import type { Word as _Word, Word__Output as _Word__Output } from './Word';

export interface GetWordListResponse {
  'wordList'?: (_Word)[];
  'count'?: (number);
  'offset'?: (number);
  'total'?: (number);
}

export interface GetWordListResponse__Output {
  'wordList': (_Word__Output)[];
  'count': (number);
  'offset': (number);
  'total': (number);
}
