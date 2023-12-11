import { Euser } from '../../entities/user.entity';
import { ELock } from '@/entities/lock.entity';
import { EQRAccess } from '@/entities/QRAccess.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { fixturesAmount } from '../init.seeds';
import { NotificationsRepository } from '@/repositories/notifications.repository';
import { QRAccessRepository } from '@/repositories/QRAccess.repository';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(Euser);
    const locksFactory = factoryManager.get(ELock);
    const QRAccessFactory = factoryManager.get(EQRAccess);

    await userFactory.saveMany(fixturesAmount.user);
    await locksFactory.saveMany(fixturesAmount.locks)
    await QRAccessFactory.saveMany(fixturesAmount.QRAccess);
    await this.addNotifications();
  }

  private addNotifications = async () => {
    const accessRepo = new QRAccessRepository()
    const notificationRepo: NotificationsRepository = new NotificationsRepository()
    const AccessEntries = await accessRepo.getAllQRAccess()
    for (let e of AccessEntries){
      await notificationRepo.saveNotification(notificationRepo.makeExpirationNotification(e, 60 * 60 * 1000))
      await notificationRepo.saveNotification(notificationRepo.makeExpirationNotification(e, 15 * 60 * 1000))
    }
    return
  }
}

