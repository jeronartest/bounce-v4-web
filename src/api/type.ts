export const ICodeMaps = {
  200: 'Success'
}

export type IResponse<TData> = {
  code: number
  data: TData
  message: string
}

export type IPager<TData> = {
  list: TData[]
  total: number
}
