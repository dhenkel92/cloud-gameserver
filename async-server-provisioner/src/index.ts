import ServiceLocator from './ServiceLocator';

const serviceLocator = ServiceLocator.getInstance();

(async () => {
  try {
    const service = await serviceLocator.getGameDeploymentService();
    await service.start();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }
})();
