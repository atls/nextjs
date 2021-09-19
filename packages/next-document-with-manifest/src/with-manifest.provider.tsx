import React    from 'react'
import Document from 'next/document'

export const withManifest = () => (TargetComponent) =>
  class WithManifest extends TargetComponent {
    static async getInitialProps(context) {
      const props = await super.getInitialProps(context)

      props.head.push(<link rel='manifest' href='/manifest.json' />)

      return props
    }

    static renderDocument(...args) {
      // @ts-ignore
      return Document.renderDocument(...args)
    }
  }
