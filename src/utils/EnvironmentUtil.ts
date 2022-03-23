export type Env = 'dev' | 'staging' | 'production';

const getEnvironment = (): Env => {
  const { host } = window.location;

  if (host.startsWith('dev')) {
    return 'dev';
  } else if (host.startsWith('staging')) {
    return 'staging';
  }

  return 'production';
};

export const EnvironmentUtil = Object.freeze({
  getEnvironment,
});
