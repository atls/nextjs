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
            <link rel='shortcut icon' href='/favicon.png' />
            <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
          </Head>
          <body {...this.helmetBodyAttrComponents}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
