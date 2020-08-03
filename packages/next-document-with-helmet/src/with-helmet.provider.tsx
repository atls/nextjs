import Document                         from 'next/document'
import React                            from 'react'
import Helmet                           from 'react-helmet'
import { Head, Html, Main, NextScript } from 'next/document'

export const withHelmet = () => TargetComponent =>
  class WithHelmet extends TargetComponent {
    static async getInitialProps(context) {
      const props = await TargetComponent.getInitialProps(context)

      const helmet = Helmet.renderStatic()
      const helmetHead = Object.keys(helmet)
        .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
        .map(el => helmet[el].toComponent())
        .flat()

      props.head = [...props.head, ...helmetHead]

      return { ...props, helmet }
    }

    static renderDocument(...args) {
      // @ts-ignore
      return Document.renderDocument(...args)
    }

    get helmetHtmlAttrComponents() {
      return this.props.helmet.htmlAttributes.toComponent()
    }

    get helmetBodyAttrComponents() {
      return this.props.helmet.bodyAttributes.toComponent()
    }

    render() {
      return (
        <Html {...this.helmetHtmlAttrComponents}>
          <Head>
            <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
            <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
            <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
            <link rel='manifest' href='/site.webmanifest' />
            <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
            <meta name='theme-color' content='#ffffff' />
            <meta name='msapplication-TileColor' content='#da532c' />
          </Head>
          <body {...this.helmetBodyAttrComponents}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
