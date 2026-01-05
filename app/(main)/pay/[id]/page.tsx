"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Wallet, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react"
import { getInvoice, payInvoiceInternal } from "@/app/actions/invoices"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/UserContext"

export default function PayPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user, isLoading: userLoading } = useUser()
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (id) {
            loadInvoice()
        }
    }, [id])

    async function loadInvoice() {
        const result = await getInvoice(id as string)
        if (result.success) {
            setInvoice(result.data)
        } else {
            setError(result.error || "Failed to load invoice")
        }
        setLoading(false)
    }

    const handlePayInternal = async () => {
        if (!user) {
            router.push(`/login?returnUrl=/pay/${id}`)
            return
        }

        setSubmitting(true)
        setError(null)
        try {
            const result = await payInvoiceInternal(id as string)
            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || "Payment failed")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || userLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error && !invoice) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-gray-900 mb-2">Error</h1>
                <p className="text-gray-500 text-center">{error}</p>
                <Button onClick={() => router.push('/wallet')} className="mt-6" variant="outline">
                    Return to Wallet
                </Button>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6"
                >
                    <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    {invoice?.payload?.itemId
                        ? `Your order for "${invoice.title}" has been processed. The item has been added to your inventory.`
                        : `Payment for "${invoice.title}" completed successfully.`}
                </p>
                <div className="space-y-3 w-full max-w-xs">
                    <Button onClick={() => router.push('/wallet')} className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold">
                        Go to Wallet
                    </Button>
                    <Button onClick={() => router.push('/')} variant="ghost" className="w-full text-gray-500">
                        Home
                    </Button>
                </div>
            </div>
        )
    }

    if (invoice.status === 'paid') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-xl font-bold text-gray-900 mb-2">Invoice Already Paid</h1>
                <p className="text-gray-500 text-center">This invoice has already been completed.</p>
                <Button onClick={() => router.push('/wallet')} className="mt-6">
                    Back to Wallet
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F2F2F7] pb-24">
            {/* Header */}
            <div className="bg-white px-6 py-8 text-center border-b border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{invoice.title}</h1>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">{invoice.description || 'Secure payment via Abundance Protocol'}</p>
            </div>

            <div className="px-4 -mt-6">
                {/* Main Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
                >
                    <div className="text-center mb-8">
                        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Amount to Pay</span>
                        <div className="flex items-center justify-center mt-1">
                            <span className="text-3xl font-bold text-gray-400 mr-1">$</span>
                            <span className="text-5xl font-bold text-gray-900">
                                {Number(invoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between py-3 border-b border-gray-50">
                            <span className="text-gray-500">Seller</span>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">
                                    {invoice.seller?.first_name
                                        ? `${invoice.seller.first_name} ${invoice.seller.last_name || ''}`
                                        : invoice.seller?.username || 'System'}
                                </span>
                                {invoice.seller?.avatar_url ? (
                                    <img src={invoice.seller.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                                        {invoice.seller?.username?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                )}
                            </div>
                        </div>
                        {invoice.payload?.itemId && (
                            <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                <span className="text-gray-500">Product Includes</span>
                                <span className="text-blue-600 font-medium">Digital Item (Auto-fulfillment)</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between py-3 border-b border-gray-50 text-xs">
                            <span className="text-gray-400">Order ID</span>
                            <span className="text-gray-400 font-mono">#{invoice.id.slice(0, 8)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handlePayInternal}
                            disabled={submitting}
                            className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Wallet className="h-5 w-5" />
                                    <span>Pay from Balance</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </Button>

                        {!user && (
                            <p className="text-center text-xs text-amber-600 font-medium bg-amber-50 py-2 rounded-lg">
                                You need to login to use your internal balance
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* External Options */}
                <div className="mt-8 space-y-4">
                    <h3 className="px-2 text-sm font-bold text-gray-500 uppercase tracking-widest">Other Payment Methods</h3>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#0098EA] flex items-center justify-center text-white">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900">Direct TON Transfer</p>
                                <p className="text-xs text-gray-500">Pay with external wallet</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400">Low fees</p>
                            <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
                        </div>
                    </motion.button>
                </div>

                {error && (
                    <div className="mt-6 bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center px-6">
                <p className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Secure Payment secured by Abundance Effect</span>
                </p>
            </div>
        </div>
    )
}
