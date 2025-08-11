export const setupApp = async (createServerCallback: () => void) => {
  try {
    // TODO: add app dependencies here
    createServerCallback();
  } catch (err) {
    console.error('failed to setup app dependencies');
    console.error(err);
  }
};
