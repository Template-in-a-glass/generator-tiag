import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, FC, PropsWithChildren } from 'react';

type PropertyTypes = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

/// A unified component for the next/link <Link> and a standard <a> anchor.
/// Will lift href and all other props from Link up to the Link.
/// Will automatically make an <a> tag containing the children and pass it remaining props.
const LinkTo: FC<PropertyTypes> = ({
  children, href, as, replace, scroll, shallow, prefetch, locale, ...anchorProperties
}: PropsWithChildren<PropertyTypes>) => (
  // These props are lifted up to the `Link` element. All others are passed to the `<a>`
  <Link {...{
    as, href, locale, prefetch, replace, scroll, shallow
  }}
  >
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <a {...anchorProperties}>{children}</a>
  </Link>
);

export default LinkTo;
