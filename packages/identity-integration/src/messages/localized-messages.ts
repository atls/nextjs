import type { LocalizedMessagesProps } from './localized-messages.interfaces.js'

import ruFields                        from '../locales/ru/ru-fields.json'
import ruMessages                      from '../locales/ru/ru-messages.json'
import ruReasons                       from '../locales/ru/ru-reasons.json'

export const localizedMessages: LocalizedMessagesProps = (messages) =>
  messages.map(
    (message) =>
      ruMessages
        .find((mes) => mes.id === message.id)
        ?.ru?.replace(
          '{reason}',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ruReasons.find(
            // @ts-expect-error reason exists in context
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (mes) => message.context?.reason?.includes(mes.en) || message.text.includes(mes.en)
          )?.ru ??
            // @ts-expect-error reason exists in context
            message.context?.reason ??
            message.text ??
            ''
        )
        .replace(
          '{field}',
          // @ts-expect-error property exists in context
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ruFields.find((mes) => mes.en === message.context?.property)?.ru ??
            // @ts-expect-error property exists in context
            message.context?.property ??
            ''
        ) ?? message.text
  ) ?? []
