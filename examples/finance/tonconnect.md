# How to integrate a decentralized application (dApp)

export const Aside = ({type = "note", title = "", icon = "", iconType = "regular", children}) => {
  const asideVariants = ["note", "tip", "caution", "danger"];
  const asideComponents = {
    note: {
      outerStyle: "border-sky-500/20 bg-sky-50/50 dark:border-sky-500/30 dark:bg-sky-500/10",
      innerStyle: "text-sky-900 dark:text-sky-200",
      calloutType: "note",
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-500" aria-label="Note">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7 1.3C10.14 1.3 12.7 3.86 12.7 7C12.7 10.14 10.14 12.7 7 12.7C5.48908 12.6974 4.0408 12.096 2.97241 11.0276C1.90403 9.9592 1.30264 8.51092 1.3 7C1.3 3.86 3.86 1.3 7 1.3ZM7 0C3.14 0 0 3.14 0 7C0 10.86 3.14 14 7 14C10.86 14 14 10.86 14 7C14 3.14 10.86 0 7 0ZM8 3H6V8H8V3ZM8 9H6V11H8V9Z"></path>
        </svg>
    },
    tip: {
      outerStyle: "border-emerald-500/20 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/10",
      innerStyle: "text-emerald-900 dark:text-emerald-200",
      calloutType: "tip",
      icon: <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600 dark:text-emerald-400/80 w-3.5 h-auto" aria-label="Tip">
          <path d="M3.12794 12.4232C3.12794 12.5954 3.1776 12.7634 3.27244 12.907L3.74114 13.6095C3.88471 13.8248 4.21067 14 4.46964 14H6.15606C6.41415 14 6.74017 13.825 6.88373 13.6095L7.3508 12.9073C7.43114 12.7859 7.49705 12.569 7.49705 12.4232L7.50055 11.3513H3.12521L3.12794 12.4232ZM5.31288 0C2.52414 0.00875889 0.5 2.26889 0.5 4.78826C0.5 6.00188 0.949566 7.10829 1.69119 7.95492C2.14321 8.47011 2.84901 9.54727 3.11919 10.4557C3.12005 10.4625 3.12175 10.4698 3.12261 10.4771H7.50342C7.50427 10.4698 7.50598 10.463 7.50684 10.4557C7.77688 9.54727 8.48281 8.47011 8.93484 7.95492C9.67728 7.13181 10.1258 6.02703 10.1258 4.78826C10.1258 2.15486 7.9709 0.000106649 5.31288 0ZM7.94902 7.11267C7.52078 7.60079 6.99082 8.37878 6.6077 9.18794H4.02051C3.63739 8.37878 3.10743 7.60079 2.67947 7.11294C2.11997 6.47551 1.8126 5.63599 1.8126 4.78826C1.8126 3.09829 3.12794 1.31944 5.28827 1.3126C7.2435 1.3126 8.81315 2.88226 8.81315 4.78826C8.81315 5.63599 8.50688 6.47551 7.94902 7.11267ZM4.87534 2.18767C3.66939 2.18767 2.68767 3.16939 2.68767 4.37534C2.68767 4.61719 2.88336 4.81288 3.12521 4.81288C3.36705 4.81288 3.56274 4.61599 3.56274 4.37534C3.56274 3.6515 4.1515 3.06274 4.87534 3.06274C5.11719 3.06274 5.31288 2.86727 5.31288 2.62548C5.31288 2.38369 5.11599 2.18767 4.87534 2.18767Z"></path>
        </svg>
    },
    caution: {
      outerStyle: "border-amber-500/20 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/10",
      innerStyle: "text-amber-900 dark:text-amber-200",
      calloutType: "warning",
      icon: <svg className="flex-none w-5 h-5 text-amber-400 dark:text-amber-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-label="Warning">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
    },
    danger: {
      outerStyle: "border-red-500/20 bg-red-50/50 dark:border-red-500/30 dark:bg-red-500/10",
      innerStyle: "text-red-900 dark:text-red-200",
      calloutType: "danger",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="text-red-600 dark:text-red-400/80 w-4 h-4" aria-label="Danger">
          <path d="M17.1 292c-12.9-22.3-12.9-49.7 0-72L105.4 67.1c12.9-22.3 36.6-36 62.4-36l176.6 0c25.7 0 49.5 13.7 62.4 36L494.9 220c12.9 22.3 12.9 49.7 0 72L406.6 444.9c-12.9 22.3-36.6 36-62.4 36l-176.6 0c-25.7 0-49.5-13.7-62.4-36L17.1 292zm41.6-48c-4.3 7.4-4.3 16.6 0 24l88.3 152.9c4.3 7.4 12.2 12 20.8 12l176.6 0c8.6 0 16.5-4.6 20.8-12L453.4 268c4.3-7.4 4.3-16.6 0-24L365.1 91.1c-4.3-7.4-12.2-12-20.8-12l-176.6 0c-8.6 0-16.5 4.6-20.8 12L58.6 244zM256 128c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path>
        </svg>
    }
  };
  let variant = type;
  let gotInvalidVariant = false;
  if (!asideVariants.includes(type)) {
    gotInvalidVariant = true;
    variant = "danger";
  }
  const iconVariants = ["regular", "solid", "light", "thin", "sharp-solid", "duotone", "brands"];
  if (!iconVariants.includes(iconType)) {
    iconType = "regular";
  }
  return <>
      <div className={`callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border ${asideComponents[variant].outerStyle}`} data-callout-type={asideComponents[variant].calloutType}>
        <div className="mt-0.5 w-4" data-component-part="callout-icon">
          {}
          {icon === "" ? asideComponents[variant].icon : <Icon icon={icon} iconType={iconType} size={14} />}
        </div>
        <div className={`text-sm prose min-w-0 w-full ${asideComponents[variant].innerStyle}`} data-component-part="callout-content">
          {gotInvalidVariant ? <p>
              <span className="font-bold">
                Invalid <code>type</code> passed!
              </span>
              <br />
              <span className="font-bold">Received: </span>
              {type}
              <br />
              <span className="font-bold">Expected one of: </span>
              {asideVariants.join(", ")}
            </p> : <>
              {title && <p className="font-bold">{title}</p>}
              {children}
            </>}
        </div>
      </div>
    </>;
};

This guide helps you integrate your dApp with TON or build one from scratch using [TON Connect](/ecosystem/ton-connect/overview) and auxiliary libraries.

TON Connect is a standard wallet connection protocol in TON. It consists of supplementary SDKs and supervises two major use cases: dApps integrations with TON and custom wallet integrations.

To proceed with a dApp integration, select your framework or environment:

<Columns cols={3}>
  <Card icon="react" title="React" href="#react" />

  <Card icon="square-n" title="Next.js" href="#next-js" />

  <Card icon="js" title="Vanilla JS" href="#vanilla-js" />
</Columns>

## Integration

### React

<Steps>
  <Step title="Install necessary libraries">
    Install the `@tonconnect/ui-react` package:

    ```shell  theme={null}
    npm i @tonconnect/ui-react
    ```

    That is enough for the most basic usage. However, to allow for more complex examples, install the following packages as well:

    ```shell  theme={null}
    npm i @ton-community/assets-sdk @ton/ton @ton/core
    ```
  </Step>

  <Step title="Create a TON Connect manifest">
    [TON Connect manifest](/ecosystem/ton-connect/manifest) is a small JSON file that lets wallets discover information about your dApp. It should be named `tonconnect-manifest.json`, placed at `https://<YOUR_APP_URL>/tonconnect-manifest.json`, and be accessible with a direct GET request.

    <Aside>
      Notice that [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) should be disabled, and there should be no authorization or intermediate proxies like CloudFlare or similar services. The connection also won’t work when using a VPN.
    </Aside>

    Here's an example of such a file:

    ```json title="tonconnect-manifest.json" theme={null}
    {
      "url": "https://tonconnect-sdk-demo-dapp.vercel.app/",
      "name": "Demo Dapp with React UI",
      "iconUrl": "https://tonconnect-sdk-demo-dapp.vercel.app/apple-touch-icon.png",
      "termsOfUseUrl": "https://tonconnect-sdk-demo-dapp.vercel.app/terms-of-use.txt",
      "privacyPolicyUrl": "https://tonconnect-sdk-demo-dapp.vercel.app/privacy-policy.txt"
    }
    ```

    After creating the manifest file, import `TonConnectUIProvider` to the root of your dApp and pass the manifest URL:

    ```tsx  theme={null}
    import { TonConnectUIProvider } from '@tonconnect/ui-react';

    export function App() {
      return (
        <TonConnectUIProvider
          manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json"
        >
          { /* Your app */ }
        </TonConnectUIProvider>
      );
    }
    ```

    See more detailed information here: [TON Connect manifest](/ecosystem/ton-connect/manifest).
  </Step>

  <Step title="Add a button in the UI">
    Users need a clear way of connecting their wallets to your app, so you must give a clear UI element to do so. Usually, that is a <kbd>Connect wallet</kbd> button.

    Some in-wallet browsers automatically open a wallet connection modal when your dApp loads. Still, always provide a button alternative in case the user dismissed the modal window or wants to connect a wallet after doing their research.

    Adding `TonConnectButton` is straightforward:

    ```tsx  theme={null}
    import { TonConnectButton } from '@tonconnect/ui-react';

    export const Header = () => {
      return (
        <header>
          <span>My App with React UI</span>
          <TonConnectButton />
        </header>
      );
    };
    ```

    The `TonConnectButton` is a universal UI component for initializing a connection. After the wallet is connected, it transforms into a wallet menu. Prefer to place the <kbd>Connect wallet</kbd> button in the top right corner of your app.

    You can add the `className` and style props to the button:

    ```jsx  theme={null}
    <TonConnectButton className="my-button-class" style={{ float: "right" }}/>
    ```

    <Aside type="caution">
      You cannot pass a child element to the `TonConnectButton`.
    </Aside>
  </Step>

  <Step title="Utilize TON Connect in your dApp">
    <Card title="Common usage recipes" href="#usage" />
  </Step>
</Steps>

#### Manual connection initiation

You can always initiate the connection manually using the `useTonConnectUI` hook and [openModal](https://github.com/ton-connect/sdk/tree/main/packages/ui#open-connect-modal) method.

```tsx  theme={null}
import { useTonConnectUI } from '@tonconnect/ui-react';

export const Header = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  return (
    <header>
      <span>My App with React UI</span>
      <button onClick={() => tonConnectUI.openModal()}>
        Connect Wallet
      </button>
    </header>
  );
};
```

To open a modal window for a specific wallet, use the `openSingleWalletModal()` method. It takes the wallet's `app_name` and opens the corresponding wallet modal, returning a promise that resolves once the modal window opens.

To find the correct `app_name` of the target wallet, refer to the [wallets-list.json](https://github.com/ton-blockchain/wallets-list/blob/main/wallets-v2.json) file.

```tsx  theme={null}
<button onClick={() => tonConnectUI.openSingleWalletModal('tonwallet')}>
  Connect Wallet
</button>
```

#### UI customization

To customize the UI of the modal, use the `tonConnectUI` object provided by the `useTonConnectUI()` hook, and then assign designated values as an object to the `uiOptions` property.

```tsx  theme={null}
// Somewhere early in the component:
const [tonConnectUI] = useTonConnectUI();

// ...

// Somewhere later in the same component:
tonConnectUI.uiOptions = {
  language: 'ru', // sets the target language
  uiPreferences: {
    theme: THEME.DARK, // dark theme of the modal
  }
};
```

In the object assigned, you should only pass options that you want to change — they will be merged with the current UI options. UI element will be re-rendered after such assignment.

<Aside type="caution">
  Note that you have to pass an object and never set individual sub-properties under `uiOptions`. That is, **DO NOT** do this:

  ```tsx  theme={null}
  /* WRONG, WILL NOT WORK */
  tonConnectUI.uiOptions.language = 'ru';
  ```
</Aside>

See all available `uiOptions` in the external reference: [`TonConnectUiOptions` Interface](https://ton-connect.github.io/sdk/interfaces/_tonconnect_ui.TonConnectUiOptions.html).

#### Minimal React setup

Putting all the above together, here's a most minimal React dApp integration example.

First, start by creating a new project with React and Vite:

```shell  theme={null}
npm create vite@latest demo-react-dapp -- --template react-ts
```

Then, go into the project and add the `@tonconnect/ui-react` dependency:

```shell  theme={null}
cd demo-react-dapp
npm i @tonconnect/ui-react # this will also install other missing dependencies
```

Edit your `App.tsx` to have the following imports present:

```tsx title="src/App.tsx" theme={null}
import {
  TonConnectUIProvider,
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
  CHAIN,
} from '@tonconnect/ui-react';
```

Finally, in the same `App.tsx` file, replace your `App()` function with the following:

```tsx title="src/App.tsx" expandable theme={null}
function App() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const sendToncoin = async (amount: string) => {
    if (!wallet) return;

    // Once the user has connected,
    // you can prepare and send a message from the wallet:
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        network: CHAIN.TESTNET,
        messages: [{ address: wallet.account.address, amount }],
      });
    }
  };

  return (
    <TonConnectUIProvider
      {/*
        We re-use an existing manifest here. To specify your own while developing locally,
        setup a tunnel and an https domain with the help of ngrok or similar tools.
      */}
      manifestUrl="https://tonconnect-sdk-demo-dapp.vercel.app/tonconnect-manifest.json"
    >
      <TonConnectButton />
      <button
        {/*
          Notice that it's important to specify Toncoin in nanoToncoin format,
          where 1 Toncoin is equal to 10⁹ nanoToncoin:
        */}
        onClick={() => sendToncoin(String(100_000_000))}
      >
        Send 0.1 TON
      </button>
    </TonConnectUIProvider>
  );
}
```

Now, execute `npm run dev` to launch and preview your app in the browser at `http://localhost:5173`. All changes in code will be reflected live.

Connect a wallet and try using the <kbd>Send 0.1 TON</kbd> button. Notice that the exact sum of Toncoin shown in your wallet **will be different**, because there are certain fees required for such a transfer by the blockchain itself.

When building apps, make sure to **always take fees into consideration** and show them to the end-user.

<Aside type="caution">
  This example sends **real TON** from the connected wallet. Try it with a testnet wallet first or send less Toncoin, e.g., 0.001 TON instead of 1 TON, to avoid surprises.
</Aside>

### Next.js

`TonConnectUIProvider` relies on browser APIs and should be rendered only on the client side, i.e., on the frontend. As such, in a Next.js application, you should mark the component that wraps the provider with [`'use client'` directive](https://nextjs.org/docs/app/api-reference/directives/use-client).

Alternatively, dynamically import the provider to disable server-side rendering.

Both approaches ensure that the provider is invoked only in the browser and works correctly there.

Example for the `app` router:

```tsx title="app/providers.tsx" theme={null}
'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json"
    >
      {children}
    </TonConnectUIProvider>
  );
}
```

For the `pages` router, you can dynamically import the provider:

```tsx  theme={null}
import dynamic from 'next/dynamic';

const TonConnectUIProvider = dynamic(
  () => import('@tonconnect/ui-react').then(m => m.TonConnectUIProvider),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json"
    >
      <Component {...pageProps} />
    </TonConnectUIProvider>
  );
}
```

### Vanilla JS

For quick testing, use the following single-file HTML example.

<Aside type="caution">
  This example sends **real Toncoin** from the connected wallet. Try it with a testnet wallet first or send less Toncoin, e.g., 0.001 TON instead of 1, to avoid surprises.
</Aside>

```html title="index.html" expandable theme={null}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>TON Connect sandbox</title>
  <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
</head>
<body>
  <div id="ton-connect"></div>
  <button id="send" disabled>Send 0.1 TON</button>
  <script>
    const ui = new TON_CONNECT_UI.TonConnectUI({
      // Let's re-use the manifest from the demo app
      manifestUrl: 'https://tonconnect-sdk-demo-dapp.vercel.app/tonconnect-manifest.json',
      buttonRootId: 'ton-connect', // anchor id with the element to hook the "Connect wallet" button onto
    });
    ui.onStatusChange(w => document.getElementById('send').disabled = !w);
    document.getElementById('send').onclick = async () => {
      // This will send 0.1 Toncoin from the connected wallet, beware!
      try {
        await ui.sendTransaction({
          validUntil: Math.floor(Date.now()/1000) + 300,
          messages: [{ address: ui.account.address, amount: String(100_000_000) }],
        });
      }
    };
  </script>
</body>
</html>
```

## See also

* [TON Connect overview](/ecosystem/ton-connect/overview)
* [TON Connect manifests](/ecosystem/ton-connect/manifest)
* [Integrate a wallet](/ecosystem/ton-connect/wallet)
* [WalletKit overview](/ecosystem/ton-connect/walletkit/overview)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.ton.org/llms.txt