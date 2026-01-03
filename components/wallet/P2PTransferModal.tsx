"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send } from "lucide-react"
import ContactPicker from "./ContactPicker"
import { sendP2PTransfer, type Contact } from "@/app/actions/transfers"
import { motion, AnimatePresence } from "framer-motion"

interface P2PTransferModalProps {
    isOpen: boolean
    onClose: () => void
    currentBalance: number
    onSuccess: () => void
}

export default function P2PTransferModal({
    isOpen,
    onClose,
    currentBalance,
    onSuccess,
}: P2PTransferModalProps) {
    const [step, setStep] = useState<"contacts" | "amount">("contacts")
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [amount, setAmount] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact)
        setStep("amount")
        setError(null)
    }

    const handleBack = () => {
        setStep("contacts")
        setSelectedContact(null)
        setError(null)
    }

    const handleClose = () => {
        setStep("contacts")
        setSelectedContact(null)
        setAmount("")
        setComment("")
        setError(null)
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedContact) return

        const amountValue = parseFloat(amount)
        if (isNaN(amountValue) || amountValue <= 0) {
            setError("Please enter a valid amount")
            return
        }

        if (amountValue > currentBalance) {
            setError("Insufficient balance")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const result = await sendP2PTransfer(selectedContact.id, amountValue, comment)
            if (result.success) {
                onSuccess()
                handleClose()
            } else {
                setError(result.error || "Failed to send transfer")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
                <DialogHeader className="px-4 py-4 border-b border-gray-100 flex-row items-center space-x-2 space-y-0">
                    {step === "amount" && (
                        <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </button>
                    )}
                    <DialogTitle className="text-xl font-bold">
                        {step === "contacts" ? "Send to" : "Send Information"}
                    </DialogTitle>
                </DialogHeader>

                <div className="min-h-[400px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {step === "contacts" ? (
                            <motion.div
                                key="contacts"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex-1"
                            >
                                <ContactPicker onSelect={handleContactSelect} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="amount"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6 space-y-6"
                            >
                                {/* Selected Contact Preview */}
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-3">
                                        {selectedContact?.avatar_url ? (
                                            <img src={selectedContact.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-blue-50" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl border-4 border-blue-50">
                                                {selectedContact?.first_name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {selectedContact?.first_name} {selectedContact?.last_name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">@{selectedContact?.username || 'user'}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-gray-500 font-medium">Amount to send</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">$</span>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="pl-10 h-16 text-3xl font-bold rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex justify-between items-center px-1">
                                                <p className="text-xs text-gray-400">Balance: ${currentBalance.toFixed(2)}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setAmount(currentBalance.toString())}
                                                    className="text-xs text-blue-500 font-bold hover:underline"
                                                >
                                                    Send All
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="comment" className="text-gray-500 font-medium">Comment (optional)</Label>
                                            <Input
                                                id="comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="What is it for?"
                                                className="h-12 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <span>Send Dollars</span>
                                                <Send className="h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}
