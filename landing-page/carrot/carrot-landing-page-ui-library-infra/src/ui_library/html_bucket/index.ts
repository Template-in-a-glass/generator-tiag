#!/usr/bin/env node
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption, ObjectOwnership
} from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class HtmlBucket extends Construct {
  public readonly htmlbucket: Bucket;

  constructor(parent: Stack, name: string) {
    super(parent, name);

    const htmlbucket = new Bucket(this, `${name}-Bucket`, {
      bucketName: name,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      accessControl: BucketAccessControl.PRIVATE,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      encryption: BucketEncryption.S3_MANAGED
    });

    this.htmlbucket = htmlbucket;
  }
}
