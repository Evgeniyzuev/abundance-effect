"use client"

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TonPriceProvider } from './TonPriceContext'
import { LanguageProvider } from './LanguageContext'
import { UserProvider } from './UserContext'

interface ProvidersProps {
  children: React.ReactNode
}

const manifestUrl = 'https://your-domain.com/tonconnect-manifest.json' // TODO: Create and host manifest

export function Providers({ children }: ProvidersProps) {
  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "telegram-wallet",
            name: "Wallet",
            imageUrl: "https://wallet.tg/images/logo-288.png",
            tondns: "wallet.ton",
            aboutUrl: "https://wallet.tg/",
            universalLink: "https://t.me/wallet?attach=wallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"]
          },
          {
            appName: "tonkeeper",
            name: "Tonkeeper",
            imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
            aboutUrl: "https://tonkeeper.com",
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android", "macos", "windows", "linux"]
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/abundanceeffectbot' // Your Telegram bot URL
      }}
    >
      <TonPriceProvider>
        <LanguageProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </LanguageProvider>
      </TonPriceProvider>
    </TonConnectUIProvider>
  )
}
