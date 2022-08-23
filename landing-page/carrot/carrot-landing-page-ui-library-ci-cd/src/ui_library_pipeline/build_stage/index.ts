#!/usr/bin/env node
import { Stack, StackProps } from 'aws-cdk-lib';
import {
  BuildSpec, PipelineProject
} from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';
import { getBuildSpec } from './buid-spec';

export interface BuildActionProperties extends StackProps {
  codepipeline: Pipeline;
  sourceArtifact: Artifact;
}

export class BuildStage extends Construct {
  public readonly buildArtifact: Artifact;

  constructor(parent: Stack, name: string, properties: BuildActionProperties) {
    super(parent, name);

    const buildArtifact = new Artifact(`${name.slice(0, 90)}-build`);
    const buildAction = new CodeBuildAction({
      actionName: name,
      input: properties.sourceArtifact,
      project: this.createCodeBuildProject(name),
      outputs: [buildArtifact]
    });

    properties.codepipeline.addStage({
      stageName: name,
      actions: [buildAction]
    });

    this.buildArtifact = buildArtifact;
  }

  readonly createCodeBuildProject = (name: string): PipelineProject => new PipelineProject(this, `${name}-code-build-project`, {
    projectName: `${name}-code-build-project`,
    buildSpec: BuildSpec.fromObjectToYaml(getBuildSpec())
  });
}
