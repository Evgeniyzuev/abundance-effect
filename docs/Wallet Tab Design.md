# Wallet Tab Design Specification

## Overview
Redesign of the Wallet Tab to replicate the aesthetics and UX of the Telegram Wallet (Mini App), adapting it to the "Abundance Effect" ecosystem. The design focuses on a clean, premium IOS-style interface ("Clean, Light, Mobile-First") without seasonal decorations.

## Visual Structure

### 1. Header Area
-   **Title**: "Wallet" (centered, possibly with a blue "Verified" badge for trust).
-   **Top Action**: "Close" button (top left) or styled navigation control.
-   **Tabs**: Pill-shaped switcher: `[ Crypto | TON / Cash ]` (Active tab white, inactive transparent).

### 2. Main Balance
-   **Display**: Large, centered text displaying the total wallet equivalent in USD.
-   **Style**: Bold, minimal font (e.g., 40-48px). Currency symbol '$' slightly smaller or distinctive.

### 3. Action Grid (Quick Actions)
Four circular buttons with icons and labels below.
-   **Transfer**:
    -   *Icon*: Paper plane or users exchange icon (Blue/System color).
    -   *Label*: "Transfer".
    -   *Function*: Internal system transfers (User-to-User). *Status: Planned/Placeholder*.
-   **Deposit** (formerly "Top Up"):
    -   *Icon*: Plus `+` sign (Blue/Green).
    -   *Label*: "Deposit".
    -   *Existing Map*: `onTopUp`.
-   **Withdraw** (formerly "Send"):
    -   *Icon*: Arrow Up/Out `↑` (Blue/Teal).
    -   *Label*: "Withdraw".
    -   *Existing Map*: `onSend`.
-   **Exchange**:
    -   *Icon*: Swap arrows `⇄` (Blue/Yellow).
    -   *Label*: "Exchange".
    -   *Function*: Swap assets (e.g. USDT <-> Core Liquid). *Status: Planned/Placeholder*.

### 4. Assets List ("Crypto")
A vertical scrollable list of assets. Each row contains:
-   **Icon**: Asset logo (left).
-   **Name**: Asset Name (e.g., "Toncoin", "Bitcoin", "Gold").
-   **Price**: Visual display of current market price (e.g., "$243.52").
-   **Balance**: User's holding in that asset (e.g., "144.876 TON").
-   **Change**: 24h change percentage (green/red) next to price.

**Asset Inventory**:
1.  **USDT** (Tether)
2.  **TON** (Toncoin)
3.  **BTC** (Bitcoin)
4.  **ETH** (Ethereum)
5.  **GOLD** (XAU)
6.  *Future*: Indices, Stocks?

### 5. Core Integration
The "Core" functionality (Abundance Core) remains crucial but separate from the standard crypto assets.
-   **Display**: Distinct card or button, possibly "sticky" or separated section "Investments" / "Savings".
-   **Function**: Opens Core View (Transfer to Core / View Level).

## Functional Requirements

| UI Element | Action / Logic | Status |
| :--- | :--- | :--- |
| **Deposit Btn** | Triggers `onTopUp` modal | ✅ Ready |
| **Withdraw Btn** | Triggers `onSend` modal | ✅ Ready |
| **Transfer Btn** | Show "Feature coming soon" or open internal transfer placeholder | 📅 Planned |
| **Exchange Btn** | Show "Feature coming soon" or open swap placeholder | 📅 Planned |
| **Core Btn** | Triggers `onTransfer` (to Core) | ✅ Ready |
| **Asset Row** | Click -> Open Asset Details (Chart, Buy/Sell specific) | 📅 Planned |

## Technical Implementation
-   **Icons**: `lucide-react` for UI elements, Custom SVGs/Images for Crypto Assets (TON, BTC, etc.).
-   **Mock Data**: Use a static configuration for asset prices/changes initially until an API (e.g., CoinGecko/Binance) is connected.
-   **Styling**: Tailwind CSS.
    -   Background: `bg-[#F2F2F7]` (System Gray 6).
    -   Surface: `bg-white`.
    -   Text: `text-black` / `text-gray-500`.
