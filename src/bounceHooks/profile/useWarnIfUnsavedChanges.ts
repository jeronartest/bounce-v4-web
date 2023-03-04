import { Router } from 'next/router'
import { useEffect } from 'react'

// 填写表单没有保存，离开页面的警告
export const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  useEffect(() => {
    if (unsavedChanges) {
      const alertUser = (e: any) => {
        if (unsavedChanges) {
          e.preventDefault()
          e.returnValue = ''
          return ''
        }
      }
      window.addEventListener('beforeunload', alertUser)

      const routeChangeStart = () => {
        // const ok = confirm('Are you sure you want to leave this page?')
        const ok = confirm(
          'The basic profile is not completed. Account with introduction perform 80% greater on Bounce.',
        )
        if (!ok) {
          throw 'Abort route change. Please ignore this error.'
        }
      }
      Router?.events?.on('routeChangeStart', routeChangeStart)

      return () => {
        Router?.events?.off('routeChangeStart', routeChangeStart)
        window.removeEventListener('beforeunload', alertUser)
      }
    }
  }, [unsavedChanges])
}
