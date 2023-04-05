import React, { useState } from 'react'

import { ActionState } from '..'
import ConfirmRefund from './ConfirmRefund'
import InputRefundAmount from './InputRefundAmount'

export interface RefundBlockProps {
  setAction: React.Dispatch<React.SetStateAction<ActionState>>
  action: ActionState
}

const RefundBlock = ({ setAction, action }: RefundBlockProps): JSX.Element => {
  const [refundAmount, setRefundAmount] = useState<string>('')

  return (
    <div>
      {action === 'Input_Refund_Amount' && (
        <InputRefundAmount
          refundAmount={refundAmount}
          setRefundAmount={setRefundAmount}
          onCancel={() => {
            setAction('Bid_Or_Regret')
          }}
          onConfirm={() => {
            setAction('Confirm_Refund')
          }}
        />
      )}

      {action === 'Confirm_Refund' && (
        <ConfirmRefund
          refundAmount={refundAmount}
          onCancel={() => {
            setAction('Input_Refund_Amount')
          }}
          onRefundPart={() => {
            setAction('Bid_Or_Regret')
          }}
          onRefundAll={() => {
            setAction('To_Confirm_Notice')
          }}
        />
      )}
    </div>
  )
}

export default RefundBlock
