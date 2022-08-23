import { App, StackProps } from 'aws-cdk-lib';

interface UiLibraryStackProductionProperties extends StackProps {
  domain: string;
  stackName: string;
  type: 'PROD';
}
interface UiLibraryStacStagingProperties extends StackProps {
  domain?: string;
  stackName: string;
  stage: string;
  type: 'STAGING';
}

export type UiLibraryStackProperties = UiLibraryStackProductionProperties | UiLibraryStacStagingProperties;

export const getProperties = (app: App, appName: string): UiLibraryStackProperties => {
  const tryGetContextStage = app.node.tryGetContext('stage');
  const stackName = tryGetContextStage ? `${tryGetContextStage}-${appName}` : `www-${appName}`;

  const tryGetContextDomain = app.node.tryGetContext('domain');

  if (tryGetContextStage) {
    return {
      stackName,
      stage: tryGetContextStage,
      domain: tryGetContextDomain,
      type: 'STAGING'
    };
  }

  return {
    stackName,
    domain: tryGetContextDomain,
    type: 'PROD'
  };
};
