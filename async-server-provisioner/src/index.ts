import tracer from 'dd-trace';
import ServiceLocator from './ServiceLocator';

tracer.init();

const serviceLocator = ServiceLocator.getInstance();

(async () => {
  try {
    const logger = serviceLocator.getLogger();
    const service = await serviceLocator.getGameDeploymentService();
    logger.info('Starting consumer');
    await service.start();
  } catch (e) {
    console.error(e);
  }
})();
