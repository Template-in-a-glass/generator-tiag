#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { getProperties } from './properties';
import { UiLibraryStack } from './ui_library';

const APP_NAME = 'landing-page-ui-library';

// Build the app
const app = new App();

const stackProperties = getProperties(app, APP_NAME);

new UiLibraryStack(app, stackProperties.stackName, {
  ...stackProperties,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    // Stack must be in us-east-1, because the ACM certificate for a global CloudFront distribution must be requested in us-east-1.
    region: 'us-east-1'
  }
});

app.synth();
