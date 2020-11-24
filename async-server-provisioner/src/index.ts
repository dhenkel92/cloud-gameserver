import { CronJob } from 'cron';
import ServiceLocator from './ServiceLocator';

const serviceLocator = ServiceLocator.getInstance();
const jobs: CronJob[] = [];

process.on('SIGINT', () => {
  jobs.forEach(job => job.stop());
  serviceLocator.getGameDeploymentService()
    .then(service => service.stop());
  serviceLocator.getMySqlAdapter()
    .then(adapter => adapter.close());
});

(async () => {
  try {
    const job = new CronJob('0 * * * * *', async () => {
      // tslint:disable-next-line:no-console
      console.dir('Hello Cron');
    });
    jobs.push(job);

    jobs.forEach(j => j.start());

    const service = await serviceLocator.getGameDeploymentService();
    await service.start();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }
})();
