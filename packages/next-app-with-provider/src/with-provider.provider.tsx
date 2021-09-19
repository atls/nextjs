/* eslint-disable react/prefer-stateless-function */
import React         from 'react'
import { Component } from 'react'

type Props = {}

export const withProvider =
  (Provider, defaults = {}) =>
  (WrapperComponent) =>
    class WithProvider extends Component<Props> {
      render() {
        return (
          <Provider {...defaults} {...this.props}>
            <WrapperComponent {...defaults} {...this.props} />
          </Provider>
        )
      }
    }
