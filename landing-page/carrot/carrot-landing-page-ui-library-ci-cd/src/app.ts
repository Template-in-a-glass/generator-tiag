#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { getProperties } from './properties';
import { UiLibraryPipelineStack } from './ui_library_pipeline';

const APP_NAME = 'landing-page-ui-library';
const CI_CD_NAME = 'landing-page-ui-library-pipeline';

// Build the app
const app = new App();

const stackProperties = getProperties(app, CI_CD_NAME, APP_NAME);

new UiLibraryPipelineStack(app, stackProperties.stackName, {
  ...stackProperties
});

app.synth();
