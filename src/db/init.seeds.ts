import { appDataSource } from "@/dbConfig";
import { runSeeders } from "typeorm-extension";
import { parse as pathParse } from 'path';

export const fakeImgsLogPath = './public/fakeFileLog.log'

export const fixturesAmount = {
  user: 5,
  locks: 10,
  QRAccess: 20,
}
if (pathParse(process.argv[1]).name === 'init.seeds') {
  const seedsMain = async () => {
    appDataSource.initialize().then(async () => {
      await appDataSource.synchronize(true);
      await runSeeders(appDataSource);
      {
        process.exit()
      }
    })
  }

  seedsMain()
}