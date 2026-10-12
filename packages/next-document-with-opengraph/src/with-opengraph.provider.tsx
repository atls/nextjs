/* eslint-disable @next/next/no-document-import-in-page */

import type { DocumentContext, DocumentInitialProps } from 'next/document'

import type Document                                  from 'next/document'

import React                                          from 'react'

export interface OpenGraphProviderOptinos {
  image?: string
}

export const withOpenGraph = ({ image }: OpenGraphProviderOptinos = {}) =>
  (TargetComponent: typeof Document) =>
    class WithOpenGraph extends TargetComponent {
      static override async getInitialProps(
        context: DocumentContext
      ): Promise<DocumentInitialProps> {
        const props = await super.getInitialProps(context)

        if (image) {
          props.head ??= []
          props.head.push(<meta property='og:image' content={image} />)
        }

        return props
      }
    }
