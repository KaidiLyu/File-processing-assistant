import { ReactNode } from 'react'

interface FeatureLayoutProps {
  children: ReactNode
  toolbar?: ReactNode
  sidebar?: ReactNode
}

export function FeatureLayout({
  children,
  toolbar,
  sidebar
}: FeatureLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      {toolbar && (
        <div className="border-b">
          {toolbar}
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <div className="w-64 overflow-y-auto border-r bg-sidebar p-4">
            {sidebar}
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

