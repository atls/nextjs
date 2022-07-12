import Document       from 'next/document'
import React          from 'react'
import { Head }       from 'next/document'
import { Html }       from 'next/document'
import { Main }       from 'next/document'
import { NextScript } from 'next/document'
import { Helmet }     from 'react-helmet'

export const withHelmet = () => (TargetComponent) =>
  class WithHelmet extends TargetComponent {
    static async getInitialProps(context) {
      const props = await TargetComponent.getInitialProps(context)

      const helmet = Helmet.renderStatic()
      const helmetHead = Object.keys(helmet)
        .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
        .map((el) => helmet[el].toComponent())
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
          <Head />
          <body {...this.helmetBodyAttrComponents}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
