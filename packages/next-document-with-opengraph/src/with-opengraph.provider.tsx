import Document from 'next/document'
import React    from 'react'

export interface OpenGraphProviderOptinos {
  image?: string
}

export const withOpenGraph =
  ({ image }: OpenGraphProviderOptinos = {}) =>
  (TargetComponent) =>
    class WithOpenGraph extends TargetComponent {
      static async getInitialProps(context) {
        const props = await super.getInitialProps(context)

        if (image) {
          props.head.push(<meta property='og:image' content={image} />)
        }

        return props
      }

      static renderDocument(...args) {
        // @ts-ignore
        return Document.renderDocument(...args)
      }
    }
