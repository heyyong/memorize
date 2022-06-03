// Original file: proto3/memorize.proto

import type { Meaning as _Meaning, Meaning__Output as _Meaning__Output } from './Meaning';

export interface Property {
  'id'?: (number);
  'prop'?: (string);
  'meanings'?: (_Meaning)[];
}

export interface Property__Output {
  'id': (number);
  'prop': (string);
  'meanings': (_Meaning__Output)[];
}
