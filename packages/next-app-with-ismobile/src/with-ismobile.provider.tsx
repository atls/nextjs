/* eslint-disable @typescript-eslint/naming-convention */

import isMobile                   from 'ismobilejs'
import React, { ElementType, FC } from 'react'

declare global {
  interface Window {
    __NEXT_DATA__: any
  }
}

type Props = {
  Component?: ElementType
  isMobileVersion?: boolean
  isTabletVersion?: boolean
}

type State = {}

type ClientContainerProps = {
  Component?: ElementType
}

export const withIsMobile = () => WrapperComponent => {
  const ClientContainer: FC<ClientContainerProps> = ({ Component, ...props }) => (
    <Component {...props} />
  )

  return class withIsMobileWrapper extends React.Component<Props, State> {
    static async getInitialProps(context) {
      let props = {}

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(context)
      }

      if (!(process as any).browser) {
        const {
          ctx: { req },
        } = context
        const userAgent = req.headers['user-agent']
        return {
          ...props,
          isMobileVersion: isMobile(userAgent).any,
          isTabletVersion: isMobile(userAgent).tablet,
        }
      }
      return {
        ...props,
      }
    }

    render() {
      const { Component, isMobileVersion, isTabletVersion } = this.props

      let isMobileDevice = isMobileVersion
      let isTabletDevice = isTabletVersion

      /* eslint-disable */

      if ((process as any).browser) {
        isMobileDevice = window.__NEXT_DATA__.props.isMobileVersion;
        isTabletDevice = window.__NEXT_DATA__.props.isTabletVersion;
      }

      /* eslint-enable */

      return (
        <WrapperComponent
          {...this.props}
          Component={wrapperProps => (
            <ClientContainer
              {...wrapperProps}
              Component={Component}
              isMobile={isMobileDevice}
              isTablet={isTabletDevice}
            />
          )}
        />
      )
    }
  }
}
