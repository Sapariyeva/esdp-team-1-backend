import { Euser } from '../../entities/user.entity';
import { ELock } from '@/entities/lock.entity';
import { EQRAccess } from '@/entities/QRAccess.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { fixturesAmount } from '../init.seeds';
import { NotificationsRepository } from '@/repositories/notifications.repository';
import { QRAccessRepository } from '@/repositories/QRAccess.repository';
import { EOrganization } from '@/entities/organization.entity';
import { EBuilding } from '@/entities/building.entity';
import { ETenant } from '@/entities/tenant.entity';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const organizationFactory = factoryManager.get(EOrganization)
    const buildingFactory = factoryManager.get(EBuilding)
    const tenantFactory = factoryManager.get(ETenant)
    const userFactory = factoryManager.get(Euser);
    const locksFactory = factoryManager.get(ELock);
    const QRAccessFactory = factoryManager.get(EQRAccess);

    await organizationFactory.saveMany(fixturesAmount.organizations);
    await buildingFactory.saveMany(fixturesAmount.buildings);
    await locksFactory.saveMany(fixturesAmount.locks);
    await tenantFactory.saveMany(fixturesAmount.tenants);
    await userFactory.saveMany(fixturesAmount.user);
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

