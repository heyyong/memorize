import { createChannel, createClient, Client } from 'nice-grpc-web';
import { MemorizeServiceClient, MemorizeServiceDefinition } from './memorize';

const channel = createChannel('http://127.0.0.1:8081');

export const api: MemorizeServiceClient = createClient(
    MemorizeServiceDefinition,
    channel,
);