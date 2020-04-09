import Helmet               from 'react-helmet'
import React, { Component } from 'react'

type Props = {}

export const withHelmet = () => WrapperComponent =>
  class WithHelmet extends Component<Props> {
    static async getInitialProps(ctx) {
      let props: any = {}

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(ctx)
      }

      return props
    }

    render() {
      return (
        <>
          <Helmet />
          <WrapperComponent {...this.props} />
        </>
      )
    }
  }
