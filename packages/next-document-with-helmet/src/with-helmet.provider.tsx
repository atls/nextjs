/* eslint-disable @next/next/no-document-import-in-page */

import type { DocumentContext, DocumentInitialProps } from 'next/document'
import type { HelmetData }                            from 'react-helmet'
import type Document                                  from 'next/document'

import { Head }                                       from 'next/document'
import { Html }                                       from 'next/document'
import { Main }                                       from 'next/document'
import { NextScript }                                 from 'next/document'
import { Helmet }                                     from 'react-helmet'
import React                                          from 'react'

export const withHelmet = () => (TargetComponent: typeof Document) =>
  class WithHelmet extends TargetComponent {
    static override async getInitialProps(
      context: DocumentContext
    ): Promise<DocumentInitialProps & { helmet: HelmetData }> {
      const props = await super.getInitialProps(context)

      const helmet = Helmet.renderStatic()
      const helmetHead = (Object.keys(helmet) as Array<keyof HelmetData>)
        .filter(
          (key): key is Exclude<keyof HelmetData, 'bodyAttributes' | 'htmlAttributes'> =>
            key !== 'htmlAttributes' && key !== 'bodyAttributes'
        )
        .map((key) => helmet[key].toComponent())

      props.head = [...(props.head ?? []), ...helmetHead]

      return { ...props, helmet }
    }

    render() {
      const { helmet } = this.props as typeof this.props & { helmet: HelmetData }

      return (
        <Html {...helmet.htmlAttributes.toComponent()}>
          <Head />
          <body {...helmet.bodyAttributes.toComponent()}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
