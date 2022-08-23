#!/usr/bin/env node
import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';

export interface GithubSourceActionProperties extends StackProps {
  codepipeline: Pipeline;
  ghBranch: string;
  ghOwner: string;
  ghRepo: string;
  ghToken: string;
}

export class GithubSourceStage extends Construct {
  public readonly sourceArtifact: Artifact;

  constructor(parent: Stack, name: string, properties: GithubSourceActionProperties) {
    super(parent, name);

    const sourceArtifact = new Artifact(`${name.slice(0, 90)}-source`);
    const sourceAction = new GitHubSourceAction({
      actionName: name,
      owner: properties.ghOwner,
      repo: properties.ghRepo,
      oauthToken: new SecretValue(properties.ghToken),
      branch: properties.ghBranch,
      output: sourceArtifact
    });

    properties.codepipeline.addStage({
      stageName: name,
      actions: [sourceAction]
    });

    this.sourceArtifact = sourceArtifact;
  }
}
