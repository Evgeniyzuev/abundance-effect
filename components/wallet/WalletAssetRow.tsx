import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"

interface WalletAssetRowProps {
    name: string
    symbol: string
    balance: number
    price: number
    change24h: number
    color: string
    icon?: React.ReactNode
}

export default function WalletAssetRow({ name, symbol, balance, price, change24h, color, icon }: WalletAssetRowProps) {
    const value = balance * price;
    const isPositive = change24h >= 0;

    return (
        <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-none">
            <div className="flex items-center space-x-3">
                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm`} style={{ backgroundColor: color }}>
                    {icon ? icon : symbol[0]}
                </div>

                {/* Name & Price */}
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 leading-tight">{name}</span>
                    <div className="flex items-center space-x-1">
                        <span className="text-gray-500 text-sm">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className={`text-xs font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{change24h}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Balance & Value */}
            <div className="flex flex-col items-end">
                <span className="font-bold text-gray-900">${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-gray-500 text-sm">
                    {balance.toLocaleString('en-US', { maximumFractionDigits: 6 })} {symbol}
                </span>
            </div>
        </div>
    )
}
