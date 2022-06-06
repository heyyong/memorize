import { createChannel, createClient, Client } from 'nice-grpc-web';
import { MemorizeServiceClient, MemorizeServiceDefinition } from './memorize';

const channel = createChannel('http://memorize.api:8081');

export const api: MemorizeServiceClient = createClient(
    MemorizeServiceDefinition,
    channel,
);