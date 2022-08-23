#!/usr/bin/env node
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods, CachedMethods, CachePolicy,
  Distribution, HeadersReferrerPolicy, HttpVersion, OriginAccessIdentity, PriceClass, ResponseHeadersPolicy, SecurityPolicyProtocol, ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import {
  AaaaRecord, ARecord, IHostedZone, RecordTarget
} from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface HtmlCloudfrontProperties extends StackProps {
  certificate?: DnsValidatedCertificate;
  domain?: string;
  htmlbucket: Bucket;
  subDomain?: string;
  zone?: IHostedZone;
}

export class HtmlCloudfront extends Construct {
  public readonly htmlCloudfront: Distribution;

  public readonly cloudfrontOAI: OriginAccessIdentity;

  public readonly siteDomain: string[];

  constructor(parent: Stack, name: string, properties: HtmlCloudfrontProperties) {
    super(parent, name);

    const cloudfrontOAI = new OriginAccessIdentity(this, `${name}-OriginAccessIdentity`);

    let siteDomain: string[] = [];
    if (properties.domain) {
      siteDomain = properties.subDomain ? [`${properties.subDomain}.${properties.domain}`] : [`www.${properties.domain}`, `${properties.domain}`];
    }
    const responseHeadersPolicy = new ResponseHeadersPolicy(this, `${name}-ResponseHeadersPolicy`, {
      securityHeadersBehavior: {
        strictTransportSecurity: {
          override: true,
          accessControlMaxAge: Duration.days(2 * 365),
          includeSubdomains: true,
          preload: true
        },
        contentTypeOptions: {
          override: true
        },
        referrerPolicy: {
          override: true,
          referrerPolicy: HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN
        },
        xssProtection: {
          override: true,
          protection: true,
          modeBlock: true
        }
      }
    });

    const htmlCloudfront = new Distribution(this, `${name}-Distribution`, {
      certificate: properties.certificate,
      defaultRootObject: 'index.html',
      domainNames: siteDomain,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: PriceClass.PRICE_CLASS_ALL,
      httpVersion: HttpVersion.HTTP2,
      enableIpv6: true,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(0)
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(0)
        }
      ],
      defaultBehavior: {
        origin: new S3Origin(properties.htmlbucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy
      }
    });

    siteDomain.forEach((domain) => {
      if (properties.zone) {
        new ARecord(this, `${name}-${domain}-ARecord`, {
          recordName: domain,
          target: RecordTarget.fromAlias(new CloudFrontTarget(htmlCloudfront)),
          zone: properties.zone
        });
        new AaaaRecord(this, `${name}-${domain}-AaaaRecord`, {
          recordName: domain,
          target: RecordTarget.fromAlias(new CloudFrontTarget(htmlCloudfront)),
          zone: properties.zone
        });
      }
    });

    this.htmlCloudfront = htmlCloudfront;
    this.cloudfrontOAI = cloudfrontOAI;
    this.siteDomain = siteDomain;
  }
}
