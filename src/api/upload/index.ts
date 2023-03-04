import { ApiInstance } from '..'
import { IUploaderBody } from './type'

export const uploader = async (body: IUploaderBody) => {
  const formData = new FormData()
  formData.append('filename', body.file)
  return ApiInstance.post('/com/file/fileupload', formData, {})
}
