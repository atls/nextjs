import type { UiNodeInputAttributes } from '@ory/kratos-client'

import type { Flow }                  from './flow.interfaces.js'
import type { Body }                  from './flow.interfaces.js'

import { isUiNodeInputAttributes }    from '@ory/integrations/ui'
import { EventEmitter }               from 'events'

export class ValuesStore extends EventEmitter {
  #values: Body = {} as Body

  constructor() {
    super()

    this.setMaxListeners(50)
  }

  getValue(name: string): string {
    // @ts-expect-error name exists in values
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.#values[name]
  }

  getValues(): Body {
    return this.#values
  }

  setValue(name: string, value: string): void {
    // @ts-expect-error name exists in values
    this.#values[name] = value
    this.emit(name, value)
  }

  setFromFlow(flow: Flow): void {
    flow?.ui?.nodes?.forEach(({ attributes }) => {
      const { name, type, value = '' } = attributes as UiNodeInputAttributes

      if (isUiNodeInputAttributes(attributes)) {
        if (type !== 'button' && type !== 'submit') {
          // @ts-expect-error name exists in values
          if (!this.#values[name]) {
            // @ts-expect-error name exists in values
            this.#values[name] = value
            this.emit(name, value)
          }
        }
      }
    })
  }
}
