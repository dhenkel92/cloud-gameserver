import ServiceLocator from './ServiceLocator';

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
