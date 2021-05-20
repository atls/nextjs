import { createNetworkStatusNotifier } from './network-status-fork'

const notifier = createNetworkStatusNotifier()

export const networkStatusLink = notifier.link

export const useNetworkStatus = notifier.useApolloNetworkStatus
