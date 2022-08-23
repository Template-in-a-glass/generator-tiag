export const getBuildSpec = (): { [key: string]: unknown } => ({
  version: '0.2',
  phases: {
    install: {
      'runtime-versions': {
        nodejs: '16'
      },
      commands: [
        'npm ci'
      ]
    },
    build: {
      commands: [
        'npm run build-storybook'
      ]
    }
  },
  artifacts: {
    files: ['**/*'],
    'base-directory': 'storybook-static'
  },
  cache: {
    paths: ['node_modules/**/*']
  }
});
