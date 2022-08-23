import { App, Fn } from 'aws-cdk-lib';

export interface UiLibraryPipelineStackProperties {
  cloudFrontId: string;
  github: {
    branch: string;
    owner: string;
    repository: string;
    token: string;
  },
  s3Bucket: string;
  stackName: string;
  stage?: string;
}

export const getProperties = (app: App, cicdName: string, appName: string): UiLibraryPipelineStackProperties => {
  const tryGetContextStage = app.node.tryGetContext('stage');
  const stackName = tryGetContextStage ? `${tryGetContextStage}-${cicdName}` : `www-${cicdName}`;
  const appstackName = tryGetContextStage ? `${tryGetContextStage}-${appName}` : `www-${appName}`;

  const githubToken = process.env.GH_TOKEN;
  if (!githubToken) { throw new Error('Please provide "GH_TOKEN" as environnement variable'); }
  const tryGetContexGithubOwner = app.node.tryGetContext('gh-owner');
  if (!tryGetContexGithubOwner) { throw new Error('Please provide "gh-owner" in context -c gh-owner=xxxx'); }
  const tryGetContexGithubRepo = app.node.tryGetContext('gh-repo');
  if (!tryGetContexGithubRepo) { throw new Error('Please provide "gh-repo" in context -c gh-repo=xxxx'); }
  const tryGetContexGithubBranch = app.node.tryGetContext('gh-branch');

  // get from oher stack
  const s3Bucket = Fn.importValue(`${appstackName}-bucket-name`);
  if (!s3Bucket) { throw new Error(`Cannot get "${appstackName}-bucket-name" from another stack, have you deploy it`); }
  const cloudFrontId = Fn.importValue(`${appstackName}-cloudFront-distribution-id`);
  if (!cloudFrontId) { throw new Error(`Cannot get "${appstackName}-cloudFront-distribution-id" from another stack, have you deploy it`); }

  return {
    cloudFrontId,
    github: {
      branch: tryGetContexGithubBranch || 'main',
      owner: tryGetContexGithubOwner,
      repository: tryGetContexGithubRepo,
      token: githubToken
    },
    s3Bucket,
    stackName,
    stage: tryGetContextStage
  };
};
