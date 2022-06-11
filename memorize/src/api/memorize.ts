/* eslint-disable */
import * as Long from "long";
import * as _m0 from "protobufjs/minimal";
import { CallContext, CallOptions } from "nice-grpc-common";

export const protobufPackage = "";

export interface Word {
  id: number;
  voc: string;
  cla: string[];
  pron: Pron | undefined;
  properties: Property[];
}

export interface Property {
  id: number;
  prop: string;
  meanings: Meaning[];
}

export interface Pron {
  id: number;
  audio: string;
  phonetic: string;
}

export interface Meaning {
  id: number;
  content: string;
  examples: Example[];
}

export interface Example {
  id: number;
  example: string;
}

export interface VocCla {
  voc: string;
  cla: string;
}

export interface GetClaListRequest {}

export interface GetClaListResponse {
  cla: string[];
}

export interface UploadWordCollectionRequest {
  vocList: VocCla[];
}

export interface UploadWordCollectionResponse {
  failedWords: string[];
}

export interface TriggerWordSyncRequest {
  cla?: string | undefined;
}

export interface TriggerWordSyncResponse {
  id: number;
}

export interface GetNextWordRequest {
  planId: number;
  spell?: string | undefined;
}

export interface GetNextWordResponse {
  word?: Word | undefined;
  offset?: number | undefined;
  total?: number | undefined;
}

export interface MarkWordRequest {
  planId: number;
  word: string;
  status: MarkWordRequest_MemorizedStatus;
}

export enum MarkWordRequest_MemorizedStatus {
  Approvad = 0,
  Rejected = 1,
  UNRECOGNIZED = -1,
}

export interface MarkWordResponse {
  id: number;
}

export interface GenNewMemorizePlanRequest {
  count: number;
}

export interface GenNewMemorizePlanResponse {
  planId: number;
}

export interface GetWordListRequest {
  offset: number;
  pageSize: number;
}

export interface GetWordListResponse {
  wordList: Word[];
  count: number;
  offset: number;
  total: number;
}

function createBaseWord(): Word {
  return { id: 0, voc: "", cla: [], pron: undefined, properties: [] };
}

export const Word = {
  encode(message: Word, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.voc !== "") {
      writer.uint32(18).string(message.voc);
    }
    for (const v of message.cla) {
      writer.uint32(26).string(v!);
    }
    if (message.pron !== undefined) {
      Pron.encode(message.pron, writer.uint32(162).fork()).ldelim();
    }
    for (const v of message.properties) {
      Property.encode(v!, writer.uint32(402).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Word {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.voc = reader.string();
          break;
        case 3:
          message.cla.push(reader.string());
          break;
        case 20:
          message.pron = Pron.decode(reader, reader.uint32());
          break;
        case 50:
          message.properties.push(Property.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<Word>): Word {
    const message = createBaseWord();
    message.id = object.id ?? 0;
    message.voc = object.voc ?? "";
    message.cla = object.cla?.map((e) => e) || [];
    message.pron =
      object.pron !== undefined && object.pron !== null
        ? Pron.fromPartial(object.pron)
        : undefined;
    message.properties =
      object.properties?.map((e) => Property.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProperty(): Property {
  return { id: 0, prop: "", meanings: [] };
}

export const Property = {
  encode(
    message: Property,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.prop !== "") {
      writer.uint32(18).string(message.prop);
    }
    for (const v of message.meanings) {
      Meaning.encode(v!, writer.uint32(402).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Property {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProperty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.prop = reader.string();
          break;
        case 50:
          message.meanings.push(Meaning.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<Property>): Property {
    const message = createBaseProperty();
    message.id = object.id ?? 0;
    message.prop = object.prop ?? "";
    message.meanings =
      object.meanings?.map((e) => Meaning.fromPartial(e)) || [];
    return message;
  },
};

function createBasePron(): Pron {
  return { id: 0, audio: "", phonetic: "" };
}

export const Pron = {
  encode(message: Pron, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.audio !== "") {
      writer.uint32(18).string(message.audio);
    }
    if (message.phonetic !== "") {
      writer.uint32(26).string(message.phonetic);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Pron {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePron();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.audio = reader.string();
          break;
        case 3:
          message.phonetic = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<Pron>): Pron {
    const message = createBasePron();
    message.id = object.id ?? 0;
    message.audio = object.audio ?? "";
    message.phonetic = object.phonetic ?? "";
    return message;
  },
};

function createBaseMeaning(): Meaning {
  return { id: 0, content: "", examples: [] };
}

export const Meaning = {
  encode(
    message: Meaning,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.content !== "") {
      writer.uint32(18).string(message.content);
    }
    for (const v of message.examples) {
      Example.encode(v!, writer.uint32(402).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Meaning {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMeaning();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.content = reader.string();
          break;
        case 50:
          message.examples.push(Example.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<Meaning>): Meaning {
    const message = createBaseMeaning();
    message.id = object.id ?? 0;
    message.content = object.content ?? "";
    message.examples =
      object.examples?.map((e) => Example.fromPartial(e)) || [];
    return message;
  },
};

function createBaseExample(): Example {
  return { id: 0, example: "" };
}

export const Example = {
  encode(
    message: Example,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.example !== "") {
      writer.uint32(18).string(message.example);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Example {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExample();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.example = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<Example>): Example {
    const message = createBaseExample();
    message.id = object.id ?? 0;
    message.example = object.example ?? "";
    return message;
  },
};

function createBaseVocCla(): VocCla {
  return { voc: "", cla: "" };
}

export const VocCla = {
  encode(
    message: VocCla,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.voc !== "") {
      writer.uint32(10).string(message.voc);
    }
    if (message.cla !== "") {
      writer.uint32(18).string(message.cla);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VocCla {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVocCla();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.voc = reader.string();
          break;
        case 2:
          message.cla = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<VocCla>): VocCla {
    const message = createBaseVocCla();
    message.voc = object.voc ?? "";
    message.cla = object.cla ?? "";
    return message;
  },
};

function createBaseGetClaListRequest(): GetClaListRequest {
  return {};
}

export const GetClaListRequest = {
  encode(
    _: GetClaListRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetClaListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetClaListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(_: DeepPartial<GetClaListRequest>): GetClaListRequest {
    const message = createBaseGetClaListRequest();
    return message;
  },
};

function createBaseGetClaListResponse(): GetClaListResponse {
  return { cla: [] };
}

export const GetClaListResponse = {
  encode(
    message: GetClaListResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.cla) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetClaListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetClaListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cla.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<GetClaListResponse>): GetClaListResponse {
    const message = createBaseGetClaListResponse();
    message.cla = object.cla?.map((e) => e) || [];
    return message;
  },
};

function createBaseUploadWordCollectionRequest(): UploadWordCollectionRequest {
  return { vocList: [] };
}

export const UploadWordCollectionRequest = {
  encode(
    message: UploadWordCollectionRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.vocList) {
      VocCla.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UploadWordCollectionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadWordCollectionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vocList.push(VocCla.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(
    object: DeepPartial<UploadWordCollectionRequest>
  ): UploadWordCollectionRequest {
    const message = createBaseUploadWordCollectionRequest();
    message.vocList = object.vocList?.map((e) => VocCla.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUploadWordCollectionResponse(): UploadWordCollectionResponse {
  return { failedWords: [] };
}

export const UploadWordCollectionResponse = {
  encode(
    message: UploadWordCollectionResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.failedWords) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UploadWordCollectionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadWordCollectionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.failedWords.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(
    object: DeepPartial<UploadWordCollectionResponse>
  ): UploadWordCollectionResponse {
    const message = createBaseUploadWordCollectionResponse();
    message.failedWords = object.failedWords?.map((e) => e) || [];
    return message;
  },
};

function createBaseTriggerWordSyncRequest(): TriggerWordSyncRequest {
  return { cla: undefined };
}

export const TriggerWordSyncRequest = {
  encode(
    message: TriggerWordSyncRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.cla !== undefined) {
      writer.uint32(10).string(message.cla);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TriggerWordSyncRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTriggerWordSyncRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cla = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(
    object: DeepPartial<TriggerWordSyncRequest>
  ): TriggerWordSyncRequest {
    const message = createBaseTriggerWordSyncRequest();
    message.cla = object.cla ?? undefined;
    return message;
  },
};

function createBaseTriggerWordSyncResponse(): TriggerWordSyncResponse {
  return { id: 0 };
}

export const TriggerWordSyncResponse = {
  encode(
    message: TriggerWordSyncResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TriggerWordSyncResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTriggerWordSyncResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(
    object: DeepPartial<TriggerWordSyncResponse>
  ): TriggerWordSyncResponse {
    const message = createBaseTriggerWordSyncResponse();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseGetNextWordRequest(): GetNextWordRequest {
  return { planId: 0, spell: undefined };
}

export const GetNextWordRequest = {
  encode(
    message: GetNextWordRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.planId !== 0) {
      writer.uint32(8).int32(message.planId);
    }
    if (message.spell !== undefined) {
      writer.uint32(18).string(message.spell);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetNextWordRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNextWordRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.planId = reader.int32();
          break;
        case 2:
          message.spell = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<GetNextWordRequest>): GetNextWordRequest {
    const message = createBaseGetNextWordRequest();
    message.planId = object.planId ?? 0;
    message.spell = object.spell ?? undefined;
    return message;
  },
};

function createBaseGetNextWordResponse(): GetNextWordResponse {
  return { word: undefined, offset: undefined, total: undefined };
}

export const GetNextWordResponse = {
  encode(
    message: GetNextWordResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.word !== undefined) {
      Word.encode(message.word, writer.uint32(10).fork()).ldelim();
    }
    if (message.offset !== undefined) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.total !== undefined) {
      writer.uint32(24).int32(message.total);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetNextWordResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNextWordResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.word = Word.decode(reader, reader.uint32());
          break;
        case 2:
          message.offset = reader.int32();
          break;
        case 3:
          message.total = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<GetNextWordResponse>): GetNextWordResponse {
    const message = createBaseGetNextWordResponse();
    message.word =
      object.word !== undefined && object.word !== null
        ? Word.fromPartial(object.word)
        : undefined;
    message.offset = object.offset ?? undefined;
    message.total = object.total ?? undefined;
    return message;
  },
};

function createBaseMarkWordRequest(): MarkWordRequest {
  return { planId: 0, word: "", status: 0 };
}

export const MarkWordRequest = {
  encode(
    message: MarkWordRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.planId !== 0) {
      writer.uint32(8).int32(message.planId);
    }
    if (message.word !== "") {
      writer.uint32(18).string(message.word);
    }
    if (message.status !== 0) {
      writer.uint32(400).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MarkWordRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarkWordRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.planId = reader.int32();
          break;
        case 2:
          message.word = reader.string();
          break;
        case 50:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<MarkWordRequest>): MarkWordRequest {
    const message = createBaseMarkWordRequest();
    message.planId = object.planId ?? 0;
    message.word = object.word ?? "";
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseMarkWordResponse(): MarkWordResponse {
  return { id: 0 };
}

export const MarkWordResponse = {
  encode(
    message: MarkWordResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MarkWordResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarkWordResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<MarkWordResponse>): MarkWordResponse {
    const message = createBaseMarkWordResponse();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseGenNewMemorizePlanRequest(): GenNewMemorizePlanRequest {
  return { count: 0 };
}

export const GenNewMemorizePlanRequest = {
  encode(
    message: GenNewMemorizePlanRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).int32(message.count);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenNewMemorizePlanRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenNewMemorizePlanRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.count = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(
    object: DeepPartial<GenNewMemorizePlanRequest>
  ): GenNewMemorizePlanRequest {
    const message = createBaseGenNewMemorizePlanRequest();
    message.count = object.count ?? 0;
    return message;
  },
};

function createBaseGenNewMemorizePlanResponse(): GenNewMemorizePlanResponse {
  return { planId: 0 };
}

export const GenNewMemorizePlanResponse = {
  encode(
    message: GenNewMemorizePlanResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.planId !== 0) {
      writer.uint32(8).int32(message.planId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GenNewMemorizePlanResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenNewMemorizePlanResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.planId = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(
    object: DeepPartial<GenNewMemorizePlanResponse>
  ): GenNewMemorizePlanResponse {
    const message = createBaseGenNewMemorizePlanResponse();
    message.planId = object.planId ?? 0;
    return message;
  },
};

function createBaseGetWordListRequest(): GetWordListRequest {
  return { offset: 0, pageSize: 0 };
}

export const GetWordListRequest = {
  encode(
    message: GetWordListRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.offset !== 0) {
      writer.uint32(8).int32(message.offset);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWordListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWordListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.offset = reader.int32();
          break;
        case 2:
          message.pageSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<GetWordListRequest>): GetWordListRequest {
    const message = createBaseGetWordListRequest();
    message.offset = object.offset ?? 0;
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseGetWordListResponse(): GetWordListResponse {
  return { wordList: [], count: 0, offset: 0, total: 0 };
}

export const GetWordListResponse = {
  encode(
    message: GetWordListResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.wordList) {
      Word.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.count !== 0) {
      writer.uint32(240).int32(message.count);
    }
    if (message.offset !== 0) {
      writer.uint32(400).int32(message.offset);
    }
    if (message.total !== 0) {
      writer.uint32(408).int32(message.total);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWordListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWordListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.wordList.push(Word.decode(reader, reader.uint32()));
          break;
        case 30:
          message.count = reader.int32();
          break;
        case 50:
          message.offset = reader.int32();
          break;
        case 51:
          message.total = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial(object: DeepPartial<GetWordListResponse>): GetWordListResponse {
    const message = createBaseGetWordListResponse();
    message.wordList = object.wordList?.map((e) => Word.fromPartial(e)) || [];
    message.count = object.count ?? 0;
    message.offset = object.offset ?? 0;
    message.total = object.total ?? 0;
    return message;
  },
};

export type MemorizeServiceDefinition = typeof MemorizeServiceDefinition;
export const MemorizeServiceDefinition = {
  name: "MemorizeService",
  fullName: "MemorizeService",
  methods: {
    genNewMemorizePlan: {
      name: "GenNewMemorizePlan",
      requestType: GenNewMemorizePlanRequest,
      requestStream: false,
      responseType: GenNewMemorizePlanResponse,
      responseStream: false,
      options: {},
    },
    markWord: {
      name: "MarkWord",
      requestType: MarkWordRequest,
      requestStream: false,
      responseType: MarkWordResponse,
      responseStream: false,
      options: {},
    },
    getNextWord: {
      name: "GetNextWord",
      requestType: GetNextWordRequest,
      requestStream: false,
      responseType: GetNextWordResponse,
      responseStream: false,
      options: {},
    },
    getWordList: {
      name: "GetWordList",
      requestType: GetWordListRequest,
      requestStream: false,
      responseType: GetWordListResponse,
      responseStream: false,
      options: {},
    },
    triggerWordSync: {
      name: "TriggerWordSync",
      requestType: TriggerWordSyncRequest,
      requestStream: false,
      responseType: TriggerWordSyncResponse,
      responseStream: false,
      options: {},
    },
    uploadWordCollection: {
      name: "UploadWordCollection",
      requestType: UploadWordCollectionRequest,
      requestStream: false,
      responseType: UploadWordCollectionResponse,
      responseStream: false,
      options: {},
    },
    getClaList: {
      name: "GetClaList",
      requestType: GetClaListRequest,
      requestStream: false,
      responseType: GetClaListResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface MemorizeServiceServiceImplementation<CallContextExt = {}> {
  genNewMemorizePlan(
    request: GenNewMemorizePlanRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<GenNewMemorizePlanResponse>>;
  markWord(
    request: MarkWordRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<MarkWordResponse>>;
  getNextWord(
    request: GetNextWordRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<GetNextWordResponse>>;
  getWordList(
    request: GetWordListRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<GetWordListResponse>>;
  triggerWordSync(
    request: TriggerWordSyncRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<TriggerWordSyncResponse>>;
  uploadWordCollection(
    request: UploadWordCollectionRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<UploadWordCollectionResponse>>;
  getClaList(
    request: GetClaListRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<GetClaListResponse>>;
}

export interface MemorizeServiceClient<CallOptionsExt = {}> {
  genNewMemorizePlan(
    request: DeepPartial<GenNewMemorizePlanRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<GenNewMemorizePlanResponse>;
  markWord(
    request: DeepPartial<MarkWordRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<MarkWordResponse>;
  getNextWord(
    request: DeepPartial<GetNextWordRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<GetNextWordResponse>;
  getWordList(
    request: DeepPartial<GetWordListRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<GetWordListResponse>;
  triggerWordSync(
    request: DeepPartial<TriggerWordSyncRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<TriggerWordSyncResponse>;
  uploadWordCollection(
    request: DeepPartial<UploadWordCollectionRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<UploadWordCollectionResponse>;
  getClaList(
    request: DeepPartial<GetClaListRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<GetClaListResponse>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
