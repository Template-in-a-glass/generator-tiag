import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';

const Page: NextPage = () => (
  <>
    <NextSeo
      title="SaaS - Best Saas ever"
      description="Best Picture"
    />
    <Image
      src="../data/img/vKDUmKO6F9bSKKyHhg7YGbgcEeF.jpg"
      alt="Moon Knight"
      objectFit="cover"
      layout="fill"
      sizes="(min-width: 768px) 320px, 100vw"
      placeholder="blur"
    />
  </>
);

export default Page;
