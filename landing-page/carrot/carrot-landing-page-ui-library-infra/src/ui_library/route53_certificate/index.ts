#!/usr/bin/env node
import { Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export interface Route53CertificateProperties extends StackProps {
  domain: string;
  subDomain?: string;
}

export class Route53Certificate extends Construct {
  public readonly certificate: DnsValidatedCertificate;

  public readonly zone: IHostedZone;

  constructor(parent: Stack, name: string, properties: Route53CertificateProperties) {
    super(parent, name);

    const zone = HostedZone.fromLookup(this, name, { domainName: properties.domain });
    // TLS certificate
    const certificate = new DnsValidatedCertificate(this, `${name}-DnsValidatedCertificate`, {
      domainName: properties.subDomain ? `${properties.subDomain}.${properties.domain}` : `*.${properties.domain}`,
      subjectAlternativeNames: properties.subDomain ? [properties.domain] : undefined,
      hostedZone: zone,
      // Cloudfront only checks this region for certificates
      region: 'us-east-1'
    });

    this.certificate = certificate;
    this.zone = zone;
  }
}
