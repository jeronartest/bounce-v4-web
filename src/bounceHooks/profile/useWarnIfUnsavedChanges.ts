import { useEffect } from 'react'

// Leave Warning
export const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  useEffect(() => {
    if (unsavedChanges) {
      const alertUser = () => {
        if (window.event) {
          window.confirm('The basic profile is not completed. Account with introduction perform 80% greater on Bounce.')
        }
        return
      }
      window.addEventListener('beforeunload', alertUser)

      // const routeChangeStart = () => {
      //   // const ok = confirm('Are you sure you want to leave this page?')
      //   const ok = confirm(
      //     'The basic profile is not completed. Account with introduction perform 80% greater on Bounce.'
      //   )
      //   if (!ok) {
      //     throw 'Abort route change. Please ignore this error.'
      //   }
      // }
      // Router?.events?.on('routeChangeStart', routeChangeStart)

      return () => {
        // Router?.events?.off('routeChangeStart', routeChangeStart)
        window.removeEventListener('beforeunload', alertUser)
      }
    }
    return
  }, [unsavedChanges])
}
