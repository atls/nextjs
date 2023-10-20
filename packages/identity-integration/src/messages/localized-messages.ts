import ruMessages                 from '../../locales/ru-messages.json'
import ruReasons                  from '../../locales/ru-reasons.json'
import ruFields                   from '../../locales/ru-fields.json'
import { LocalizedMessagesProps } from './localized-messages.interfaces'

export const localizedMessages: LocalizedMessagesProps = (messages) => (
  messages.map((message) =>
    ruMessages.find((mes) => mes.id === message.id)?.ru
      ?.replace(
        '{reason}',
        // @ts-ignore
        ruReasons.find((mes) => message.context?.reason?.includes(mes.en) || message.text.includes(mes.en))?.ru
        // @ts-ignore
        ?? message.context?.reason ?? message.text ?? ''
      )
      .replace(
        '{field}',
        // @ts-ignore
        ruFields.find((mes) => mes.en === message.context?.property)?.ru
        // @ts-ignore
        ?? message.context?.property ?? '') ?? message.text
  ) ?? []
)
