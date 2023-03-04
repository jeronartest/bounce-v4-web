import React, { useState, useCallback, useRef } from 'react'

import { Box, Typography, Dialog, styled } from '@mui/material'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'
import { ReactComponent as CloseIcon } from 'assets/imgs/user/close.svg'
import { ReactComponent as UploadIcon } from 'assets/imgs/profile/bg-upload.svg'
import { uploader } from 'api/upload'
import { updateUserBanner } from 'api/user/index'
export interface ICropperViewProps {
  imgUrl: string | ArrayBuffer
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
}
const CropperView = (props: ICropperViewProps) => {
  const { imgUrl, onCropComplete } = props
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  return (
    <Cropper
      image={imgUrl as string}
      crop={crop}
      zoom={zoom}
      showGrid={false}
      zoomWithScroll={true}
      aspect={944 / 288}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    />
  )
}
export const DialogStyle = styled(Dialog)(() => ({
  '.MuiDialog-paper': {
    position: 'relative',
    borderRadius: '20px'
  },
  '.cancelBtn': {
    width: '140px',
    height: '60px',
    lineHeight: '60px',
    textAlign: 'center',
    border: `1px solid #171717`,
    borderRadius: `36px`,
    background: '#fff',
    cursor: 'pointer',
    marginRight: '10px'
  },
  '.saveBtn': {
    width: '140px',
    height: '60px',
    textAlign: 'center',
    lineHeight: '60px',
    background: '#171717',
    border: `1px solid #171717`,
    borderRadius: `36px`,
    color: '#fff',
    cursor: 'pointer'
  }
}))
export interface ICropParams {
  height: number
  width: number
  x: number
  y: number
}
interface IDialogCropImg {
  setShowBgEditBtn?: (data: boolean) => void
  setShowBgEditDialog?: (data: boolean) => void
  showBgEditCropDialog: boolean
  setShowBgEditCropDialog: (data: boolean) => void
  setProfileBg: (bg: string) => void
}
const DialogCropImg: React.FC<IDialogCropImg> = ({
  setShowBgEditBtn,
  setShowBgEditDialog,
  showBgEditCropDialog,
  setShowBgEditCropDialog,
  setProfileBg
}) => {
  const [profileBgBeforeSave, setProfileBgBeforeSave] = useState<ArrayBuffer | string>('')
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<ICropParams>(null)
  const refFile = useRef<HTMLInputElement>(null)
  const clearBgimg = () => {
    setShowBgEditCropDialog(false)
    setShowBgEditDialog(false)
    setProfileBgBeforeSave('')
    setShowBgEditBtn(false)
  }
  const saveBgImg = () => {
    getBase64(profileBgBeforeSave, async (fileData: File) => {
      if (fileData) {
        try {
          uploader({
            file: fileData
          }).then(res => {
            if (res) {
              const bannerPath = res.data.path
              updateUserBanner({ banner: bannerPath }).then(res => {
                if (res) {
                  setProfileBg(bannerPath)
                  clearBgimg()
                  toast.success('Successfully edited')
                }
              })
            }
          })
        } catch (err) {
          console.error('Uploader error:', err)
        }
      }
    })
  }
  const dataURLtoBlob = dataurl => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  const blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date()
    theBlob.name = fileName
    return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() })
  }
  const getBase64 = (url: any, callback: { (fileData: File) }) => {
    const Img = new Image()
    Img.src = url
    Img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      canvas
        .getContext('2d')
        .drawImage(
          Img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        )
      const dataURL = canvas.toDataURL('image/jpeg')
      const blob = dataURLtoBlob(dataURL)
      const result = blobToFile(blob, 'bounce' + new Date().getTime() + '.jpeg')
      callback && callback(result)
    }
  }
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])
  const handleBgImgChange = async (e: any) => {
    const target = e.target
    const file = target?.files?.[0] || []
    if (!file) return
    file.fid = `${file.name}_${file.size}`
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (result) {
      setProfileBgBeforeSave?.(result.target.result)
      e.target.value = ''
    }
  }
  return (
    <DialogStyle
      onClose={() => setShowBgEditCropDialog(false)}
      open={showBgEditCropDialog}
      fullWidth={true}
      maxWidth={'md'}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: '#fff',
          zIndex: 2
        }}
      >
        <CloseIcon
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            cursor: 'pointer'
          }}
          onClick={() => {
            setProfileBgBeforeSave('')
            setShowBgEditCropDialog(false)
          }}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            marginTop: '0',
            width: '100%',
            height: 'calc(100% - 84px)',
            overflowY: 'auto',
            padding: '44px 40px'
          }}
        >
          {!profileBgBeforeSave && (
            <>
              <input
                ref={refFile}
                accept={['image/jpeg', 'image/png', 'image/webp'].join(',')}
                type="file"
                multiple={false}
                onChange={handleBgImgChange}
                style={{
                  width: 0,
                  height: 0,
                  overflow: 'hidden'
                }}
              />
              <Typography
                variant="body1"
                color="var(--ps-gray-900)"
                sx={{
                  fontFamily: "'Sharp Grotesk DB Cyr Medium 22'",
                  color: '#171717',
                  fontSize: '22px',
                  lineHeight: '28px',
                  marginBottom: '60px'
                }}
              >
                Upload a cover photo
              </Typography>
              <Box
                sx={{
                  border: `1px dashed rgba(0, 0, 0, 0.27)`,
                  borderRadius: `20px`,
                  width: '100%',
                  height: '320px',
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  refFile?.current?.click()
                }}
              >
                <UploadIcon
                  style={{
                    marginBottom: '14px'
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Sharp Grotesk DB Cyr Book 20'",
                    color: '#171717',
                    fontSize: '16px',
                    lineHeight: '20px',
                    marginBottom: '16px',
                    textDecoration: `underline`
                  }}
                >
                  Upload photo
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: '323px',
                    fontFamily: "'Sharp Grotesk DB Cyr Book 20'",
                    color: '#171717',
                    fontSize: '14px',
                    lineHeight: '20px',
                    margin: '0 auto 16px',
                    opacity: 0.5,
                    textAlign: 'center'
                  }}
                >
                  The recommended resolution is 1920 x 640. Format - JPG, WEBP, or PNG.
                </Typography>
              </Box>
            </>
          )}
          {profileBgBeforeSave && (
            <>
              <Typography
                variant="body1"
                color="var(--ps-gray-900)"
                sx={{
                  fontFamily: "'Sharp Grotesk DB Cyr Medium 22'",
                  color: '#171717',
                  fontSize: '22px',
                  lineHeight: '28px',
                  marginBottom: '8px'
                }}
              >
                Edit the cover photo
              </Typography>
              <Typography
                variant="body1"
                color="var(--ps-gray-900)"
                sx={{
                  color: '#171717',
                  fontSize: '16px',
                  lineHeight: '20px',
                  marginBottom: '32px',
                  opacity: 0.5
                }}
              >
                The selected area will be shown on your page.
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '447px',
                  marginBottom: '32px'
                }}
              >
                <CropperView imgUrl={profileBgBeforeSave} onCropComplete={onCropComplete} />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexFlow: 'row nowrap',
                  justifyContent: 'flex-end'
                }}
              >
                <Box className="cancelBtn" onClick={() => clearBgimg()}>
                  Cancel
                </Box>
                <Box className="saveBtn" onClick={() => saveBgImg()}>
                  Save
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </DialogStyle>
  )
}

export default DialogCropImg
