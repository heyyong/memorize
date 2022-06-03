import * as grpc from '@grpc/grpc-js';
import { AppDataSource } from "@/data-source"
import { Server } from '@/handler';

(async () => {
    try {
        await AppDataSource.initialize()
        Server.bindAsync("0.0.0.0:8099", grpc.ServerCredentials.createInsecure(), () => {
            Server.start();
            console.log('server start success');
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})()

