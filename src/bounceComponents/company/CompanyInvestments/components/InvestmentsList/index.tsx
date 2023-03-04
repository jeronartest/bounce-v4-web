import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material'
import React from 'react'
import dayjs from 'dayjs'
import { show } from '@ebay/nice-modal-react'
import InvestmentsForm from '../InvestmentsForm'
import { ReactComponent as EditBtnSVG } from '@/assets/imgs/profile/investments/edit-btn.svg'
import { ICompanyInvestmentsListItems } from '@/api/company/type'
import MuiDialog from '@/components/common/Dialog'
import CompanyInvestmentsList from '@/components/company/CompanyInvestmentsList'

export type IInvestmentsListProps = {
  list: ICompanyInvestmentsListItems[]
  onEdit: (data: ICompanyInvestmentsListItems, index: number) => void
  onDelete: (index: number) => void
}

const InvestmentsList: React.FC<IInvestmentsListProps> = ({ list, onEdit, onDelete }) => {
  const handleEdit = (v) => {
    const temp = {
      data: {
        company: v.data.company,
        companyId: v.data.companyId,
        thirdpartId: v.data.thirdpartId,
        investmentDate: v.data.investmentDate,
        investmentType: v.data.investmentType,
        amount: v.data.amount,
      },
      index: v.index,
    }
    show(MuiDialog, {
      title: 'Edit the investment',
      fullWidth: true,
      children: <InvestmentsForm editData={temp} onEdit={onEdit} onDelete={onDelete} />,
    })
  }

  return <CompanyInvestmentsList list={list} showOperation={true} handleEdit={handleEdit} />
}

export default InvestmentsList
