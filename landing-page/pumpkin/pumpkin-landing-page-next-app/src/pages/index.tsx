import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import {
  HeaderDesktopLink, HeaderMobileLink, HeroMainButton, HeroSecondaryButton, HomePage, HomePageProperties
} from 'ui-library';
import LinkTo from '../components/link-to';
import { ROUTE_FEATURES, ROUTE_HOME, ROUTE_PRICING } from '../config/routes';

const homePageProperties: HomePageProperties = {
  headerProps: {
    headerDesktopLink: [
      <LinkTo href={ROUTE_HOME}><HeaderDesktopLink props={{ name: 'Home', current: true }} /></LinkTo>,
      <LinkTo href={ROUTE_FEATURES}><HeaderDesktopLink props={{ name: 'Features', current: false }} /></LinkTo>,
      <LinkTo href={ROUTE_PRICING}><HeaderDesktopLink props={{ name: 'Pricing', current: false }} /></LinkTo>
    ],
    headerMobileLink: [
      <LinkTo href={ROUTE_HOME}><HeaderMobileLink props={{ name: 'Home', current: true }} /></LinkTo>,
      <LinkTo href={ROUTE_FEATURES}><HeaderMobileLink props={{ name: 'Features', current: false }} /></LinkTo>,
      <LinkTo href={ROUTE_PRICING}><HeaderMobileLink props={{ name: 'Pricing', current: false }} /></LinkTo>
    ]
  },
  heroProps: {
    mainButton: <LinkTo href={ROUTE_FEATURES}><HeroMainButton props={{ title: 'Sign up' }} /></LinkTo>,
    secondButton: <LinkTo href={ROUTE_PRICING}><HeroSecondaryButton props={{ title: 'Login' }} /></LinkTo>
  }
};

const Page: NextPage = () => (
  <>
    <NextSeo
      title="SaaS - Best Saas ever"
      description="You can use our software is too good"
    />
    <HomePage props={homePageProperties} />
  </>
);

export default Page;
