import Document            from 'next/document'
import React               from 'react'
import { extractCritical } from '@emotion/server'

export const withEmotion = () => (TargetComponent) =>
  class WithEmotion extends TargetComponent {
    static async getInitialProps(context) {
      const props = await super.getInitialProps(context)

      const { css, ids } = extractCritical(props.html)

      props.styles.push(
        <style
          key='emotion'
          data-emotion-css={ids.join(' ')}
          dangerouslySetInnerHTML={{ __html: css }}
        />
      )

      return props
    }

    static renderDocument(...args) {
      // @ts-ignore
      return Document.renderDocument(...args)
    }
  }
