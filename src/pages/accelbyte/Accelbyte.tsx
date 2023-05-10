const SdkWidget = require('@accelbyte/widgets')
import '@accelbyte/widgets/dist/style.css'

const SDK_CONFIG = {
  baseURL: process.env.REACT_APP_ACCELBYTE_BASE_URL || '',
  clientId: process.env.REACT_APP_ACCELBYTE_CLIENT_ID || '',
  namespace: process.env.REACT_APP_ACCELBYTE_NAMESPACE || '',
  redirectURI: process.env.REACT_APP_ACCELBTE_REDIRECT_URI || ''
}

function AccelbyteProvider({ children }: { children: any }) {
  return <SdkWidget.SdkWidget sdkOptions={SDK_CONFIG}>{children}</SdkWidget.SdkWidget>
}

export default function Accelbyte() {
  return (
    <AccelbyteProvider>
      <SdkWidget.LoginWidget onLogout={() => alert('111')} />
    </AccelbyteProvider>
  )
}
