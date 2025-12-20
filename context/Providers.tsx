"use client"

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TonPriceProvider } from './TonPriceContext'
import { LanguageProvider } from './LanguageContext'
import { UserProvider } from './UserContext'
import { NotificationProvider } from './NotificationContext'
import { LevelProvider } from './LevelProvider'

interface ProvidersProps {
  children: React.ReactNode
}

const manifestUrl = `https://abundance-effect.vercel.app/tonconnect-manifest.json`

export function Providers({ children }: ProvidersProps) {
  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        returnStrategy: 'back',
        twaReturnUrl: 'https://t.me/AbundanceEffectBot/Abundance'
      }}
    >
      <TonPriceProvider>
        <LanguageProvider>
          <UserProvider>
            <NotificationProvider>
              <LevelProvider>
                {children}
              </LevelProvider>
            </NotificationProvider>
          </UserProvider>
        </LanguageProvider>
      </TonPriceProvider>
    </TonConnectUIProvider>
  )
}
