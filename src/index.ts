import { AppDataSource } from "@/dataSource"
import { getEntry } from '@/underlie/cambridge';

(async () => {
    try {
        await getEntry('remember');
        // await AppDataSource.initialize()
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})()

