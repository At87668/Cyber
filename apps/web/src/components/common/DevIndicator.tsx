'use client'

import { API_URL } from '~/constants/env'
import { isDev } from '~/lib/env'

import { FloatPopover } from '../ui/float-popover'

export const DevIndicator = () => (
  <>
    {isDev && (
      <FloatPopover
        type="tooltip"
        triggerElement={
          <div className="fixed bottom-0 right-0 rounded bg-accent px-1 py-0.5 text-xs text-white">
            DEV
          </div>
        }
      >
        {API_URL}
      </FloatPopover>
    )}
  </>
)
