export const getDeploySpecContent = (s3Bucket: string, cloudFrontId: string): { [key: string]: unknown } => ({
  version: '0.2',
  phases: {
    build: {
      commands: [
        `aws s3 sync . s3://${s3Bucket} --delete --cache-control max-age=31536000,public`,
        `aws s3 cp s3://${s3Bucket}/index.html s3://${s3Bucket}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html`,
        'aws configure set preview.cloudfront true',
        `aws cloudfront create-invalidation --distribution-id ${cloudFrontId} --paths "/*"`
      ]
    }
  }
});
