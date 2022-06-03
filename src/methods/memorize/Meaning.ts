// Original file: proto3/memorize.proto

import type { Example as _Example, Example__Output as _Example__Output } from './Example';

export interface Meaning {
  'id'?: (number);
  'content'?: (string);
  'examples'?: (_Example)[];
}

export interface Meaning__Output {
  'id': (number);
  'content': (string);
  'examples': (_Example__Output)[];
}
