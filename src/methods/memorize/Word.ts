// Original file: proto3/memorize.proto

import type { Pron as _Pron, Pron__Output as _Pron__Output } from './Pron';
import type { Property as _Property, Property__Output as _Property__Output } from './Property';

export interface Word {
  'id'?: (number);
  'voc'?: (string);
  'cla'?: (string);
  'pron'?: (_Pron | null);
  'properties'?: (_Property)[];
}

export interface Word__Output {
  'id': (number);
  'voc': (string);
  'cla': (string);
  'pron': (_Pron__Output | null);
  'properties': (_Property__Output)[];
}
