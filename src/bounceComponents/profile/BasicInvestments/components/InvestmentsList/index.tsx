import React from 'react'
import { show } from '@ebay/nice-modal-react'
import InvestmentsForm from '../InvestmentsForm'
import { IInvestmentItems } from 'api/profile/type'
import MuiDialog from 'bounceComponents/common/Dialog'
import ProfileInvestmentsList from 'bounceComponents/profile/ProfileInvestmentsList'

export type IInvestmentsListProps = {
  list: IInvestmentItems[]
  onEdit: (data: IInvestmentItems, index: number) => void
  onDelete: (index: number) => void
}

const InvestmentsList: React.FC<IInvestmentsListProps> = ({ list, onEdit, onDelete }) => {
  const handleEdit = v => {
    show(MuiDialog, {
      title: 'Edit the investment',
      fullWidth: true,
      children: <InvestmentsForm editData={v} onEdit={onEdit} onDelete={onDelete} />
    })
  }

  return <ProfileInvestmentsList list={list} showOperation={true} handleEdit={handleEdit} />
}

export default InvestmentsList
