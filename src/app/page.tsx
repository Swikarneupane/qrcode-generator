"use client"

import { useState, FormEvent, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"

export default function Home() {
  const [link, setLink] = useState("")
  const qrRef = useRef<HTMLDivElement>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const inputElement = target.elements.namedItem("text") as HTMLInputElement

    if (inputElement) {
      const linkValue = inputElement.value
      setLink(linkValue)
      console.log(linkValue)
    } else {
      console.error('Input element with name "text" not found.')
    }
    setLink("")
  }

  function handleDownload() {
    const svg = qrRef.current?.querySelector("svg")

    if (svg) {
      const canvas = document.createElement("canvas")
      const svgData = new XMLSerializer().serializeToString(svg)
      const img = new Image()
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const url = canvas.toDataURL("image/png")
          const a = document.createElement("a")
          a.href = url
          a.download = "qrcode.png"
          a.click()
        }
      }
    }
  }

  return (
    <main className="fixed w-full flex min-h-screen flex-col items-center  gap-7 pt-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-center w-full">
        <label htmlFor="text" className="text-lg">
          Input:
        </label>
        <div className="flex gap-5">
          <input
            id="text"
            name="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="px-5 py-2 border-2"
            placeholder="Enter text or link"
          />
          <button type="submit" className="border-2 px-6 py-2">
            Reset
          </button>
        </div>
      </form>

      <div
        className="flex flex-col items-center mt-5 p-3 border-3 border-black"
        ref={qrRef}>
        <div
          ref={qrRef}
          className="p-3 border-4 border-black"
          style={{ backgroundColor: "white" }}>
          <QRCodeSVG
            value={link ? link : "https://www.swikarneupane.com.np/"}
            size={128}
            level={"H"}
            includeMargin={false}
          />
        </div>{" "}
        <button onClick={handleDownload} className="border-2 px-4 py-2 mt-2 ">
          Download QR Code
        </button>
      </div>
    </main>
  )
}
