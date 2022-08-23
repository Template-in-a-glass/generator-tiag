import { App, Stack } from 'aws-cdk-lib';
import { UiLibraryStackProperties } from '../properties';
import { AccessBucket } from './access_bucket';
import { HtmlBucket } from './html_bucket';
import { HtmlCloudfront } from './html_cloudfront';
import { Route53Certificate } from './route53_certificate';

/**
 * This stack relies on getting the domain name from CDK context.
 * To deploy in staging 'npx -y cdk@latest deploy -c stage=dev'
 * To deploy in staging with domain 'npx -y cdk@latest deploy -c domain=mydomain.com -c stage=dev'
 * To deploy in prod 'npx -y cdk@latest deploy -c domain=mydomain.com'
* */
export class UiLibraryStack extends Stack {
  constructor(parent: App, name: string, properties: UiLibraryStackProperties) {
    super(parent, name, properties);

    const htmlBucket = new HtmlBucket(this, `${name}-html-bucket`);

    let route53Certificate;
    if (properties.domain) {
      route53Certificate = new Route53Certificate(this, `${name}-route53-certificate`, {
        domain: properties.domain,
        subDomain: properties.type === 'STAGING' ? properties.stage : undefined
      });
    }

    const htmlCloudfront = new HtmlCloudfront(this, `${name}-html-cloudfront`, {
      certificate: route53Certificate ? route53Certificate.certificate : undefined,
      domain: properties.domain,
      htmlbucket: htmlBucket.htmlbucket,
      subDomain: properties.type === 'STAGING' ? properties.stage : undefined,
      zone: route53Certificate?.zone
    });

    new AccessBucket(this, `${name}-access-bucket`, {
      htmlbucket: htmlBucket.htmlbucket,
      cloudfrontOAI: htmlCloudfront.cloudfrontOAI
    });

    this.exportValue(htmlBucket.htmlbucket.bucketName, { name: `${name}-bucket-name` });
    this.exportValue(htmlCloudfront.htmlCloudfront.distributionId, { name: `${name}-cloudFront-distribution-id` });
    if (htmlCloudfront.siteDomain.length > 0) {
      this.exportValue(`https://${htmlCloudfront.siteDomain[0]}`, { name: `${name}-domain-name` });
    } else {
      this.exportValue(`https://${htmlCloudfront.htmlCloudfront.distributionDomainName}`, { name: `${name}-domain-name` });
    }
  }
}
