#!/usr/bin/env node
import { Stack, StackProps } from 'aws-cdk-lib';
import { OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface AccessBucketProperties extends StackProps {
  htmlbucket: Bucket;
  cloudfrontOAI: OriginAccessIdentity;
}

export class AccessBucket extends Construct {
  public readonly htmlbucket: Bucket;

  constructor(parent: Stack, name: string, properties: AccessBucketProperties) {
    super(parent, name);

    properties.htmlbucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [properties.htmlbucket.arnForObjects('*')],
      principals: [new CanonicalUserPrincipal(properties.cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));
  }
}
