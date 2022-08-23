import { AppProps } from 'next/app';
import 'ui-library/dist/style.css';

// eslint-disable-next-line react/jsx-props-no-spreading
const app = ({ Component, pageProps }: AppProps): JSX.Element => <Component {...pageProps} />;

export default app;
