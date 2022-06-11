// Original file: proto3/memorize.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GenNewMemorizePlanRequest as _GenNewMemorizePlanRequest, GenNewMemorizePlanRequest__Output as _GenNewMemorizePlanRequest__Output } from './GenNewMemorizePlanRequest';
import type { GenNewMemorizePlanResponse as _GenNewMemorizePlanResponse, GenNewMemorizePlanResponse__Output as _GenNewMemorizePlanResponse__Output } from './GenNewMemorizePlanResponse';
import type { GetClaListRequest as _GetClaListRequest, GetClaListRequest__Output as _GetClaListRequest__Output } from './GetClaListRequest';
import type { GetClaListResponse as _GetClaListResponse, GetClaListResponse__Output as _GetClaListResponse__Output } from './GetClaListResponse';
import type { GetNextWordRequest as _GetNextWordRequest, GetNextWordRequest__Output as _GetNextWordRequest__Output } from './GetNextWordRequest';
import type { GetNextWordResponse as _GetNextWordResponse, GetNextWordResponse__Output as _GetNextWordResponse__Output } from './GetNextWordResponse';
import type { GetWordListRequest as _GetWordListRequest, GetWordListRequest__Output as _GetWordListRequest__Output } from './GetWordListRequest';
import type { GetWordListResponse as _GetWordListResponse, GetWordListResponse__Output as _GetWordListResponse__Output } from './GetWordListResponse';
import type { MarkWordRequest as _MarkWordRequest, MarkWordRequest__Output as _MarkWordRequest__Output } from './MarkWordRequest';
import type { MarkWordResponse as _MarkWordResponse, MarkWordResponse__Output as _MarkWordResponse__Output } from './MarkWordResponse';
import type { TriggerWordSyncRequest as _TriggerWordSyncRequest, TriggerWordSyncRequest__Output as _TriggerWordSyncRequest__Output } from './TriggerWordSyncRequest';
import type { TriggerWordSyncResponse as _TriggerWordSyncResponse, TriggerWordSyncResponse__Output as _TriggerWordSyncResponse__Output } from './TriggerWordSyncResponse';
import type { UploadWordCollectionRequest as _UploadWordCollectionRequest, UploadWordCollectionRequest__Output as _UploadWordCollectionRequest__Output } from './UploadWordCollectionRequest';
import type { UploadWordCollectionResponse as _UploadWordCollectionResponse, UploadWordCollectionResponse__Output as _UploadWordCollectionResponse__Output } from './UploadWordCollectionResponse';

export interface MemorizeServiceClient extends grpc.Client {
  GenNewMemorizePlan(argument: _GenNewMemorizePlanRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  GenNewMemorizePlan(argument: _GenNewMemorizePlanRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  GenNewMemorizePlan(argument: _GenNewMemorizePlanRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  GenNewMemorizePlan(argument: _GenNewMemorizePlanRequest, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  genNewMemorizePlan(argument: _GenNewMemorizePlanRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  genNewMemorizePlan(argument: _GenNewMemorizePlanRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  genNewMemorizePlan(argument: _GenNewMemorizePlanRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  genNewMemorizePlan(argument: _GenNewMemorizePlanRequest, callback: grpc.requestCallback<_GenNewMemorizePlanResponse__Output>): grpc.ClientUnaryCall;
  
  GetClaList(argument: _GetClaListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  GetClaList(argument: _GetClaListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  GetClaList(argument: _GetClaListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  GetClaList(argument: _GetClaListRequest, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  getClaList(argument: _GetClaListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  getClaList(argument: _GetClaListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  getClaList(argument: _GetClaListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  getClaList(argument: _GetClaListRequest, callback: grpc.requestCallback<_GetClaListResponse__Output>): grpc.ClientUnaryCall;
  
  GetNextWord(argument: _GetNextWordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  GetNextWord(argument: _GetNextWordRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  GetNextWord(argument: _GetNextWordRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  GetNextWord(argument: _GetNextWordRequest, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  getNextWord(argument: _GetNextWordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  getNextWord(argument: _GetNextWordRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  getNextWord(argument: _GetNextWordRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  getNextWord(argument: _GetNextWordRequest, callback: grpc.requestCallback<_GetNextWordResponse__Output>): grpc.ClientUnaryCall;
  
  GetWordList(argument: _GetWordListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  GetWordList(argument: _GetWordListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  GetWordList(argument: _GetWordListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  GetWordList(argument: _GetWordListRequest, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  getWordList(argument: _GetWordListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  getWordList(argument: _GetWordListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  getWordList(argument: _GetWordListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  getWordList(argument: _GetWordListRequest, callback: grpc.requestCallback<_GetWordListResponse__Output>): grpc.ClientUnaryCall;
  
  MarkWord(argument: _MarkWordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  MarkWord(argument: _MarkWordRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  MarkWord(argument: _MarkWordRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  MarkWord(argument: _MarkWordRequest, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  markWord(argument: _MarkWordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  markWord(argument: _MarkWordRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  markWord(argument: _MarkWordRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  markWord(argument: _MarkWordRequest, callback: grpc.requestCallback<_MarkWordResponse__Output>): grpc.ClientUnaryCall;
  
  TriggerWordSync(argument: _TriggerWordSyncRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  TriggerWordSync(argument: _TriggerWordSyncRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  TriggerWordSync(argument: _TriggerWordSyncRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  TriggerWordSync(argument: _TriggerWordSyncRequest, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  triggerWordSync(argument: _TriggerWordSyncRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  triggerWordSync(argument: _TriggerWordSyncRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  triggerWordSync(argument: _TriggerWordSyncRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  triggerWordSync(argument: _TriggerWordSyncRequest, callback: grpc.requestCallback<_TriggerWordSyncResponse__Output>): grpc.ClientUnaryCall;
  
  UploadWordCollection(argument: _UploadWordCollectionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  UploadWordCollection(argument: _UploadWordCollectionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  UploadWordCollection(argument: _UploadWordCollectionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  UploadWordCollection(argument: _UploadWordCollectionRequest, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  uploadWordCollection(argument: _UploadWordCollectionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  uploadWordCollection(argument: _UploadWordCollectionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  uploadWordCollection(argument: _UploadWordCollectionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  uploadWordCollection(argument: _UploadWordCollectionRequest, callback: grpc.requestCallback<_UploadWordCollectionResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface MemorizeServiceHandlers extends grpc.UntypedServiceImplementation {
  GenNewMemorizePlan: grpc.handleUnaryCall<_GenNewMemorizePlanRequest__Output, _GenNewMemorizePlanResponse>;
  
  GetClaList: grpc.handleUnaryCall<_GetClaListRequest__Output, _GetClaListResponse>;
  
  GetNextWord: grpc.handleUnaryCall<_GetNextWordRequest__Output, _GetNextWordResponse>;
  
  GetWordList: grpc.handleUnaryCall<_GetWordListRequest__Output, _GetWordListResponse>;
  
  MarkWord: grpc.handleUnaryCall<_MarkWordRequest__Output, _MarkWordResponse>;
  
  TriggerWordSync: grpc.handleUnaryCall<_TriggerWordSyncRequest__Output, _TriggerWordSyncResponse>;
  
  UploadWordCollection: grpc.handleUnaryCall<_UploadWordCollectionRequest__Output, _UploadWordCollectionResponse>;
  
}

export interface MemorizeServiceDefinition extends grpc.ServiceDefinition {
  GenNewMemorizePlan: MethodDefinition<_GenNewMemorizePlanRequest, _GenNewMemorizePlanResponse, _GenNewMemorizePlanRequest__Output, _GenNewMemorizePlanResponse__Output>
  GetClaList: MethodDefinition<_GetClaListRequest, _GetClaListResponse, _GetClaListRequest__Output, _GetClaListResponse__Output>
  GetNextWord: MethodDefinition<_GetNextWordRequest, _GetNextWordResponse, _GetNextWordRequest__Output, _GetNextWordResponse__Output>
  GetWordList: MethodDefinition<_GetWordListRequest, _GetWordListResponse, _GetWordListRequest__Output, _GetWordListResponse__Output>
  MarkWord: MethodDefinition<_MarkWordRequest, _MarkWordResponse, _MarkWordRequest__Output, _MarkWordResponse__Output>
  TriggerWordSync: MethodDefinition<_TriggerWordSyncRequest, _TriggerWordSyncResponse, _TriggerWordSyncRequest__Output, _TriggerWordSyncResponse__Output>
  UploadWordCollection: MethodDefinition<_UploadWordCollectionRequest, _UploadWordCollectionResponse, _UploadWordCollectionRequest__Output, _UploadWordCollectionResponse__Output>
}
