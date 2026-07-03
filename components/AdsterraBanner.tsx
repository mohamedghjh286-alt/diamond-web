'use client'
import { useEffect, useRef } from 'react'

export default function AdsterraBanner() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.childNodes.length > 0) return

    // atOptions config
    const optScript = document.createElement('script')
    optScript.text = `
      atOptions = {
        'key' : 'fc81e16a4944e7d285538116a1a35cb9',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `
    ref.current.appendChild(optScript)

    // invoke script
    const invokeScript = document.createElement('script')
    invokeScript.src = 'https://disintegratehesitate.com/fc81e16a4944e7d285538116a1a35cb9/invoke.js'
    invokeScript.async = true
    ref.current.appendChild(invokeScript)
  }, [])

  return (
    <div className="flex justify-center items-center py-2 bg-[#0F1923]">
      <div ref={ref} style={{ width: 320, height: 50, overflow: 'hidden' }} />
    </div>
  )
}
