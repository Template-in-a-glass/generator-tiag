import Document, {
  DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript
} from 'next/document';

class MyDocument extends Document<DocumentInitialProps & { lang: string }> {
  static async getInitialProps(
    context: DocumentContext
  ): Promise<DocumentInitialProps & { lang: string }> {
    const initialProperties = await Document.getInitialProps(context);
    const { pathname } = context;
    const lang = pathname.startsWith('/fr') ? 'fr' : 'en';
    return { ...initialProperties, lang };
  }

  render(): JSX.Element {
    const { lang } = this.props;
    return (
      <Html lang={lang}>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
