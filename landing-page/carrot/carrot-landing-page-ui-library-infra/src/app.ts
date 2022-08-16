#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSite } from './static-site';

/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
 * Or add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *     "subdomain": "www"
 *   }
 * }
* */
class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, properties: cdk.StackProps) {
    super(parent, name, properties);

    new StaticSite(this, 'landing-page-ui-library', {
      domainName: this.node.tryGetContext('domain'),
      siteSubDomain: this.node.tryGetContext('subdomain')
    });
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, 'landing-page-ui-library', {
  stackName: app.node.tryGetContext('stackName'),
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    /**
     * Stack must be in us-east-1, because the ACM certificate for a
     * global CloudFront distribution must be requested in us-east-1.
     */
    region: 'us-east-1'
  }
});

app.synth();
