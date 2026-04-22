'use client'

import { usePathname } from 'next/navigation'
import { GuideSidebar } from '../guide-nav'

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="guide-layout">
      <GuideSidebar current={pathname} />
      {children}
    </div>
  )
}
