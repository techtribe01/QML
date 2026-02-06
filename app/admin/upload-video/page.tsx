"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Check, Copy, Film, Loader2 } from "lucide-react"

export default function UploadVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [blobUrl, setBlobUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const data = await res.json()
      setBlobUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(blobUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="p-8 rounded-2xl bg-white border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Film className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Upload Demo Video</h1>
              <p className="text-sm text-muted-foreground">Upload to Vercel Blob for fast playback</p>
            </div>
          </div>

          {!blobUrl ? (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
                role="button"
                tabIndex={0}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div>
                    <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium text-foreground">Click to select video</p>
                    <p className="text-sm text-muted-foreground mt-1">MP4, WebM, or MOV</p>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Video"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Upload Complete</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy this URL and paste it into <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">/lib/video-config.ts</code>
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={blobUrl}
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-border text-xs font-mono text-foreground"
                  />
                  <Button size="sm" variant="outline" onClick={handleCopy} className="bg-transparent shrink-0">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
                <video
                  src={blobUrl}
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
