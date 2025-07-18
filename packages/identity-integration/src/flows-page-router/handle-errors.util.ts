/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
/* eslint-disable default-case */

import type { AxiosError }     from 'axios'
import type { NextRouter }     from 'next/router.js'
import type { Dispatch }       from 'react'
import type { SetStateAction } from 'react'

export const handleFlowError = <S>(
    router: NextRouter,
    flowType: 'login' | 'recovery' | 'registration' | 'settings' | 'verification',
    onResetFlow: Dispatch<SetStateAction<S | undefined>>,
    onErrorRedirectUrl: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
  ) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: AxiosError<any>): Promise<void> => {
    const redirectToSettings = onErrorRedirectUrl

    switch (error.response?.data.error?.id) {
      case 'session_aal2_required':
        window.location.href = error.response?.data.redirect_browser_to

        return
      case 'session_already_available':
        if (error.response?.data?.redirect_browser_to) {
          window.location.href = error.response.data.redirect_browser_to
        } else {
          await router.push(redirectToSettings)
        }

        return
      case 'session_refresh_required':
        window.location.href = error.response?.data.redirect_browser_to

        return
      case 'self_service_flow_return_to_forbidden':
        if (onError) {
          onError(error.response.data.error)
        }

        onResetFlow(undefined)

        await router.push(flowType === 'settings' ? redirectToSettings : '/auth/' + flowType)

        return
      case 'self_service_flow_expired':
        if (onError) {
          onError(error.response.data.error)
        }

        onResetFlow(undefined)

        await router.push(flowType === 'settings' ? redirectToSettings : '/auth/' + flowType)

        return
      case 'security_csrf_violation':
        if (onError) {
          onError(error.response.data.error)
        }

        onResetFlow(undefined)

        await router.push(flowType === 'settings' ? redirectToSettings : '/auth/' + flowType)

        return
      case 'security_identity_mismatch':
        onResetFlow(undefined)

        await router.push(flowType === 'settings' ? redirectToSettings : '/auth/' + flowType)

        return
      case 'browser_location_change_required':
        window.location.href = error.response.data.redirect_browser_to

        return
    }

    switch (error.response?.status) {
      case 410:
        onResetFlow(undefined)

        await router.push(flowType === 'settings' ? redirectToSettings : '/auth/' + flowType)

        return
    }

    return Promise.reject(error)
  }
