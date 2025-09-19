import { initializeTypeORM } from './services/typeorm';

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
