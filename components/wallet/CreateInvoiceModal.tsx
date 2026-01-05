"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, QrCode, Link as LinkIcon, Sparkles } from "lucide-react"
import { createInvoice } from "@/app/actions/invoices"
import { motion, AnimatePresence } from "framer-motion"

interface CreateInvoiceModalProps {
    isOpen: boolean
    onClose: () => void
}

const ITEMS = [
    { id: 'item_1', title: 'Starter Pack', icon: '🎒' },
    { id: 'item_2', title: 'Global Map', icon: '🗺️' },
    { id: 'item_3', title: 'Golden Compass', icon: '🧭' },
]

export default function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
    const [amount, setAmount] = useState("")
    const [title, setTitle] = useState("")
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createdInvoice, setCreatedInvoice] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await createInvoice({
                amount: parseFloat(amount),
                title: title || (selectedItemId ? ITEMS.find(i => i.id === selectedItemId)?.title || 'Digital Asset' : 'Digital Asset'),
                itemId: selectedItemId || undefined
            })

            if (result.success) {
                setCreatedInvoice(result.data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const copyLink = () => {
        if (!createdInvoice) return
        const url = `${window.location.origin}/pay/${createdInvoice.id}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClose = () => {
        setCreatedInvoice(null)
        setAmount("")
        setTitle("")
        setSelectedItemId(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
                <DialogHeader className="px-6 py-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold">
                        {createdInvoice ? "Invoice Created!" : "Create New Invoice"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {!createdInvoice ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-500">Price (Liquid $)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="pl-10 h-14 text-2xl font-bold rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-500">Attach Item (Optional)</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {ITEMS.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedItemId(selectedItemId === item.id ? null : item.id)
                                                        if (!title) setTitle(item.title)
                                                    }}
                                                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${selectedItemId === item.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-inner'
                                                        : 'border-gray-100 hover:border-blue-200'
                                                        }`}
                                                >
                                                    <span className="text-2xl mb-1">{item.icon}</span>
                                                    <span className="text-[10px] font-bold text-gray-900 truncate w-full text-center">{item.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-500">Internal Note/Title</Label>
                                        <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. For mentorship session"
                                            className="h-12 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !amount}
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20"
                                >
                                    {isSubmitting ? "Generating..." : "Generate Payment Link"}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="p-6 bg-blue-50 rounded-3xl inline-block mx-auto mb-2">
                                    <QrCode className="h-16 w-16 text-blue-600" />
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Invoice amount</p>
                                    <p className="text-3xl font-bold text-gray-900">${createdInvoice.amount}</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={copyLink}
                                        className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <LinkIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-600 truncate">
                                                {`${window.location.origin}/pay/${createdInvoice.id}`}
                                            </span>
                                        </div>
                                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />}
                                    </button>

                                    <p className="text-[10px] text-gray-400 italic">
                                        Send this link to the customer. Once they pay, items will be delivered automatically.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={handleClose} variant="ghost" className="text-blue-600 font-bold">
                                        Create Another
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}
