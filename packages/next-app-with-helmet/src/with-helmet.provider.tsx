import React         from 'react'
import { Component } from 'react'
import { Helmet }    from 'react-helmet'

type Props = {}

export const withHelmet = () => (WrapperComponent) =>
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
