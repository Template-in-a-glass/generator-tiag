#!/usr/bin/env node
import {
  Fn, SecretValue, Stack, StackProps
} from 'aws-cdk-lib';
import {
  BuildSpec, ComputeType, LinuxBuildImage, PipelineProject
} from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';

export interface PipelineProperties extends StackProps {
  github: {
    owner: string;
    repository: string;
    token?: string;
  }
}

export class PipelineCiCd extends Construct {
  constructor(parent: Stack, name: string, properties: PipelineProperties) {
    super(parent, name);

    // get from oher stack
    const s3Bucket = Fn.importValue(`${parent.stackName}BucketName`);
    const cloudFrontId = Fn.importValue(`${parent.stackName}CloudFrontDistributionId`);

    // CodePipeline
    const codepipeline = new Pipeline(this, `${parent.stackName}-landing-page-ui-library`, {});

    // ##############################################################################################################

    // Landing Page UI Library Github Source
    const sourceArtifact = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: `${parent.stackName} Landing Page UI Library Github Source`,
      owner: properties.github.owner,
      repo: properties.github.repository,
      oauthToken: new SecretValue(properties.github.token),
      branch: 'main',
      output: sourceArtifact
    });

    codepipeline.addStage({
      stageName: `${parent.stackName} Landing Page UI Library Source`,
      actions: [sourceAction]
    });

    // ##############################################################################################################

    // Build Stage
    const buildArtifact = new Artifact();
    const buildAction = new CodeBuildAction({
      actionName: `${parent.stackName} Build`,
      input: sourceArtifact,
      project: this.createCodeBuildProject(parent.stackName),
      outputs: [buildArtifact]
    });

    codepipeline.addStage({
      stageName: `${parent.stackName} Build`,
      actions: [buildAction]
    });

    // ##############################################################################################################

    // Deploy Stage
    const deployAction = new CodeBuildAction({
      actionName: `${parent.stackName} Deploy`,
      input: buildArtifact,
      project: this.createCodeDeployProject(parent.stackName, s3Bucket, cloudFrontId)
    });

    codepipeline.addStage({
      stageName: `${parent.stackName} Deploy`,
      actions: [deployAction]
    });
  }

  // Helper Functions

  // Creating code build project
  readonly createCodeBuildProject = (stackName: string): PipelineProject => new PipelineProject(this, `${stackName}-code-build-project`, {
    projectName: `${stackName}-code-build-project`,
    environment: {
      buildImage: LinuxBuildImage.AMAZON_LINUX_2_4,
      computeType: ComputeType.SMALL
    },
    buildSpec: BuildSpec.fromObject(PipelineCiCd.getBuildSpecContent())
  });

  // Creating the build spec content.
  static getBuildSpecContent = (): { [key: string]: unknown } => ({
    version: '0.2',
    phases: {
      install: {
        'runtime-versions': {
          nodejs: '16'
        }
      },
      build: {
        commands: [
          'npm ci',
          'npm run build-storybook'
        ]
      }
    },
    artifacts: {
      files: ['**/*'],
      'base-directory': 'storybook-static'
    },
    cache: {
      paths: ['./node_modules/**/*']
    }
  });

  // Creating code build project
  readonly createCodeDeployProject = (stackName: string, s3Bucket: string, cloudFrontId: string): PipelineProject => new PipelineProject(this, `${stackName}-code-deploy-project`, {
    projectName: `${stackName}-code-deploy-project`,
    environment: {
      buildImage: LinuxBuildImage.AMAZON_LINUX_2_4,
      computeType: ComputeType.SMALL
    },
    buildSpec: BuildSpec.fromObject(PipelineCiCd.getDeploySpecContent(s3Bucket, cloudFrontId))
  });

  // Creating the build spec content.
  static getDeploySpecContent = (s3Bucket: string, cloudFrontId: string): { [key: string]: unknown } => ({
    version: '0.2',
    phases: {
      build: {
        commands: [
          `aws s3 sync . s3://${s3Bucket} --delete`,
          `aws cloudfront create-invalidation --distribution-id ${cloudFrontId} --paths "/index.html"`
        ]
      }
    }
  });
}

// codeBuildProject.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
// return codeBuildProject;
// ;
