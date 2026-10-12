/* eslint-disable @next/next/no-document-import-in-page */

import type { DocumentContext, DocumentInitialProps } from 'next/document'
import type { HelmetServerState }                     from '@dr.pogodin/react-helmet'
import type Document                                  from 'next/document'

import { Head }                                       from 'next/document'
import { Html }                                       from 'next/document'
import { Main }                                       from 'next/document'
import { NextScript }                                 from 'next/document'
import React                                          from 'react'

import { HelmetStateContext }                         from './helmet-state.context.js'

export const withHelmet = () => (TargetComponent: typeof Document) =>
  class WithHelmet extends TargetComponent {
    static override async getInitialProps(
      context: DocumentContext
    ): Promise<DocumentInitialProps & { helmet?: HelmetServerState }> {
      let helmet: HelmetServerState | undefined
      const { renderPage } = context

      context.renderPage = async () =>
        renderPage({
          enhanceApp: (App) => (props) => (
            <HelmetStateContext.Provider
              value={(state) => {
                helmet = state
              }}
            >
              <App {...props} />
            </HelmetStateContext.Provider>
          ),
        })

      const props = await super.getInitialProps(context)

      const helmetHead = helmet
        ? (Object.keys(helmet) as Array<keyof HelmetServerState>)
            .filter(
              (key): key is Exclude<keyof HelmetServerState, 'bodyAttributes' | 'htmlAttributes'> =>
                key !== 'htmlAttributes' && key !== 'bodyAttributes'
            )
            .flatMap((key) => React.Children.toArray(helmet?.[key]?.toComponent()))
            .filter(React.isValidElement)
        : []

      props.head = [...(props.head ?? []), ...helmetHead]

      return { ...props, helmet }
    }

    render() {
      const { helmet } = this.props as typeof this.props & { helmet?: HelmetServerState }

      return (
        <Html {...(helmet?.htmlAttributes.toComponent() ?? {})}>
          <Head />
          <body {...(helmet?.bodyAttributes.toComponent() ?? {})}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
