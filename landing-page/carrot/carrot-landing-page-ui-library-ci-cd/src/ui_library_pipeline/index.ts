import { App, Stack } from 'aws-cdk-lib';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import 'source-map-support/register';
import { UiLibraryPipelineStackProperties } from '../properties';
import { BuildStage } from './build_stage';
import { DeployStage } from './deploy_stage';
import { GithubSourceStage } from './github_source_stage';

/**
 * This stack relies on getting the domain name from CDK context.
 * You also need to have GH_TOKEN env variable
 * To deploy in staging 'npx -y cdk@latest deploy -c stage=dev'
 * To deploy in staging with domain 'npx -y cdk@latest deploy -c domain=mydomain.com -c stage=dev'
 * To deploy in prod 'npx -y cdk@latest deploy -c domain=mydomain.com'
 * To deploy pipeline 'npx -y cdk@latest deploy -c gh-owner=xxxx -c gh-repo=xxxx -c stage=dev'
* */
export class UiLibraryPipelineStack extends Stack {
  constructor(parent: App, name: string, properties: UiLibraryPipelineStackProperties) {
    super(parent, name, properties);

    const codepipeline = new Pipeline(this, `${name}-pipeline`, {});

    const githubSourceStage = new GithubSourceStage(this, `${name}-GithubSourceStage`, {
      codepipeline,
      ghBranch: properties.github.branch,
      ghOwner: properties.github.owner,
      ghRepo: properties.github.repository,
      ghToken: properties.github.token
    });

    const buildStage = new BuildStage(this, `${name}-BuildStage`, {
      codepipeline,
      sourceArtifact: githubSourceStage.sourceArtifact
    });

    new DeployStage(this, `${name}-DeployStage`, {
      buildArtifact: buildStage.buildArtifact,
      cloudFrontId: properties.cloudFrontId,
      codepipeline,
      s3Bucket: properties.s3Bucket
    });
  }
}
