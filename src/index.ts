import { syncWordToDB } from "./sync";
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {
    console.log('start to sync words to db...');
    await syncWordToDB(AppDataSource);

}).catch(error => console.log(error))
