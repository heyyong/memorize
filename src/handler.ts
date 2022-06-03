import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { methods } from './methods';

const PROTO_PATH = join(__dirname, '../proto3/memorize.proto');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

export const Server = new grpc.Server();

// @ts-ignore
Server.addService(protoDescriptor.MemorizeService.service, methods)