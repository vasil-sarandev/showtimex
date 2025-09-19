import { initializeTypeORM } from './lib/typeorm/typeorm.index';

export const setupApp = async (createServerCallback: () => void) => {
  try {
    // TODO: add app dependencies here
    await Promise.all([initializeTypeORM()]);
    createServerCallback();
  } catch (err) {
    console.error('failed to setup app dependencies');
    throw err;
  }
};
