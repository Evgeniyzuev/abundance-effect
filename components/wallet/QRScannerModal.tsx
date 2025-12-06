"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Scanner } from "@yudiel/react-qr-scanner"

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (result: string) => void
}

export default function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleScan = (result: any) => {
    if (result?.rawValue) {
      onScan(result.rawValue)
      onClose()
    }
  }

  const handleError = (error: any) => {
    console.error("QR Scanner error:", error)
    setError("Failed to access camera. Please check permissions.")
    setIsScanning(false)
  }

  const handleClose = () => {
    setError(null)
    setIsScanning(true)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Point your camera at a TON address QR code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {isScanning && (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: "environment"
                }}
              />
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null)
                  setIsScanning(true)
                }}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Supports TON addresses starting with UQ...</p>
            <p>• Supports TON Connect deep links</p>
            <p>• Make sure QR code is well-lit and clearly visible</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}