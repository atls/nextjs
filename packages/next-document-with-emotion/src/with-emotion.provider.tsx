/* eslint-disable @typescript-eslint/naming-convention */

import Document            from 'next/document'
import React               from 'react'
import { extractCritical } from '@emotion/server'

export const withEmotion = () => TargetComponent =>
  class WithEmotion extends TargetComponent {
    static async getInitialProps(context) {
      const props = await super.getInitialProps(context)

      const { css, ids } = extractCritical(props.html)

      props.styles.push(<style key='emotion' dangerouslySetInnerHTML={{ __html: css }} />)

      return { ...props, ids }
    }

    static renderDocument(...args) {
      // @ts-ignore
      return Document.renderDocument(...args)
    }

    constructor(props) {
      super(props)
      const { __NEXT_DATA__, ids } = props

      if (ids) {
        __NEXT_DATA__.ids = ids
      }
    }
  }
