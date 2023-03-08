import React, { useRef, useEffect } from 'react'
import { useInViewport } from 'ahooks'

export type IInViewportProps = {
  children?: React.ReactNode
  onChange: (visible: boolean) => void
}
const InViewport: React.FC<IInViewportProps> = ({ children, onChange }) => {
  const ref = useRef(null)
  const [inViewport] = useInViewport(ref)
  useEffect(() => {
    onChange(inViewport || false)
  }, [inViewport, onChange])
  return <div ref={ref}>{children}</div>
}

export default InViewport
