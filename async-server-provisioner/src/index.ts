import ServiceLocator from './ServiceLocator';

const serviceLocator = ServiceLocator.getInstance();

(async () => {
  try {
    const service = await serviceLocator.getGameDeploymentService();
    await service.start();
  } catch (e) {
    console.error(e);
  }
})();
