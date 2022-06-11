import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { MemorizeServiceClient as _MemorizeServiceClient, MemorizeServiceDefinition as _MemorizeServiceDefinition } from './MemorizeService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Example: MessageTypeDefinition
  GenNewMemorizePlanRequest: MessageTypeDefinition
  GenNewMemorizePlanResponse: MessageTypeDefinition
  GetClaListRequest: MessageTypeDefinition
  GetClaListResponse: MessageTypeDefinition
  GetNextWordRequest: MessageTypeDefinition
  GetNextWordResponse: MessageTypeDefinition
  GetWordListRequest: MessageTypeDefinition
  GetWordListResponse: MessageTypeDefinition
  MarkWordRequest: MessageTypeDefinition
  MarkWordResponse: MessageTypeDefinition
  Meaning: MessageTypeDefinition
  MemorizeService: SubtypeConstructor<typeof grpc.Client, _MemorizeServiceClient> & { service: _MemorizeServiceDefinition }
  Pron: MessageTypeDefinition
  Property: MessageTypeDefinition
  TriggerWordSyncRequest: MessageTypeDefinition
  TriggerWordSyncResponse: MessageTypeDefinition
  UploadWordCollectionRequest: MessageTypeDefinition
  UploadWordCollectionResponse: MessageTypeDefinition
  VocCla: MessageTypeDefinition
  Word: MessageTypeDefinition
}

