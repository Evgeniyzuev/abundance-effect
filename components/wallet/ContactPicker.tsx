"use client"

import { useState, useEffect } from "react"
import { Search, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getTransferContacts, type Contact } from "@/app/actions/transfers"
import { useLanguage } from "@/context/LanguageContext"

interface ContactPickerProps {
    onSelect: (contact: Contact) => void
}

export default function ContactPicker({ onSelect }: ContactPickerProps) {
    const { t } = useLanguage()
    const [contacts, setContacts] = useState<Contact[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchContacts() {
            const result = await getTransferContacts()
            if (result.success && result.data) {
                setContacts(result.data)
            }
            setLoading(false)
        }
        fetchContacts()
    }, [])

    const filteredContacts = contacts.filter(contact => {
        const fullName = `${contact.first_name || ""} ${contact.last_name || ""}`.toLowerCase()
        const username = (contact.username || "").toLowerCase()
        return fullName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase())
    })

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Search Bar */}
            <div className="px-4 py-2 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('contacts.search_placeholder') || "Search contacts..."}
                        className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredContacts.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {filteredContacts.map((contact) => (
                            <motion.button
                                key={contact.id}
                                whileTap={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                                onClick={() => onSelect(contact)}
                                className="w-full px-4 py-3 flex items-center space-x-3 transition-colors text-left"
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    {contact.avatar_url ? (
                                        <img src={contact.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {(contact.first_name?.[0] || contact.username?.[0] || "?").toUpperCase()}
                                        </div>
                                    )}
                                    {/* Online indicator placeholder */}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[16px] font-semibold text-gray-900 truncate">
                                            {contact.first_name} {contact.last_name}
                                        </p>
                                        <span className="text-[12px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                                            Lvl {contact.level}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-gray-500 truncate">
                                        {contact.type === 'lead' ? 'My Lead' : 'Team Member'}
                                    </p>
                                </div>

                                <ChevronRight className="h-5 w-5 text-gray-300" />
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No contacts found</p>
                        <p className="text-sm text-gray-400 mt-1">Try searching by name or username</p>
                    </div>
                )}
            </div>
        </div>
    )
}
