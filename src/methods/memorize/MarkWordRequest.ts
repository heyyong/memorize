// Original file: proto3/memorize.proto


// Original file: proto3/memorize.proto

export enum _MarkWordRequest_MemorizedStatus {
  Approvad = 0,
  Rejected = 1,
}

export interface MarkWordRequest {
  'planId'?: (number);
  'word'?: (string);
  'status'?: (_MarkWordRequest_MemorizedStatus | keyof typeof _MarkWordRequest_MemorizedStatus);
}

export interface MarkWordRequest__Output {
  'planId': (number);
  'word': (string);
  'status': (keyof typeof _MarkWordRequest_MemorizedStatus);
}
