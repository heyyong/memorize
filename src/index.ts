import { AppDataSource } from "@/dataSource"

(async () => {
    try {
        await AppDataSource.initialize()
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})()

