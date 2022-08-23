#!/usr/bin/env node
import { Stack, StackProps } from 'aws-cdk-lib';
import {
  BuildSpec, PipelineProject
} from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getDeploySpecContent } from './deploy-spec';

export interface DeployActionProperties extends StackProps {
  buildArtifact: Artifact;
  cloudFrontId: string;
  codepipeline: Pipeline;
  s3Bucket: string;
}

export class DeployStage extends Construct {
  constructor(parent: Stack, name: string, properties: DeployActionProperties) {
    super(parent, name);

    const htmlBucket = Bucket.fromBucketName(this, name, properties.s3Bucket);
    const project = this.createCodeDeployProject(parent.stackName, properties.s3Bucket, properties.cloudFrontId);
    project.role?.addToPrincipalPolicy(new PolicyStatement({
      actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
      resources: [htmlBucket.bucketArn, htmlBucket.arnForObjects('*')]
    }));
    project.role?.addToPrincipalPolicy(new PolicyStatement({
      actions: ['cloudfront:CreateInvalidation', 'cloudfront:GetInvalidation', 'cloudfront:ListInvalidations'],
      resources: ['*']
    }));

    const deployAction = new CodeBuildAction({
      actionName: name,
      input: properties.buildArtifact,
      project
    });

    properties.codepipeline.addStage({
      stageName: name,
      actions: [deployAction]
    });
  }

  readonly createCodeDeployProject = (name: string, s3Bucket: string, cloudFrontId: string): PipelineProject => new PipelineProject(this, `${name}-code-deploy-project`, {
    projectName: `${name}-code-deploy-project`,
    buildSpec: BuildSpec.fromObject(getDeploySpecContent(s3Bucket, cloudFrontId))
  });
}
