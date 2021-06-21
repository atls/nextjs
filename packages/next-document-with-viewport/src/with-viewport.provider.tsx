import Document from 'next/document'
import React    from 'react'

const defaultViewport =
  'width=device-width,minimum-scale=1,maximum-scale=1,initial-scale=1,user-scalable=no'

export const withViewport =
  (viewport = defaultViewport) =>
  (TargetComponent) =>
    class WithViewport extends TargetComponent {
      static async getInitialProps(context) {
        const props = await super.getInitialProps(context)

        props.head.push(<meta name='viewport' content={viewport} />)

        return props
      }

      static renderDocument(...args) {
        // @ts-ignore
        return Document.renderDocument(...args)
      }
    }
