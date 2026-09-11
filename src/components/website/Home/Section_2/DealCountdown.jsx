'use client'

import { useEffect, useState } from 'react'

export default function DealCountdown({ hoursFromNow = 18 }) {
    const [remaining, setRemaining] = useState(() => hoursFromNow * 60 * 60)

    useEffect(() => {
        const end = Date.now() + hoursFromNow * 60 * 60 * 1000
        const tick = () => {
            const secs = Math.max(0, Math.floor((end - Date.now()) / 1000))
            setRemaining(secs)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [hoursFromNow])

    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const mins = Math.floor((remaining % 3600) / 60)
    const secs = remaining % 60

    const boxes = [
        { label: 'd', value: days },
        { label: 'h', value: hours },
        { label: 'm', value: mins },
        { label: 's', value: secs },
    ]

    return (
        <div className="flex gap-2">
            {boxes.map((box) => (
                <div
                    key={box.label}
                    className="min-w-14 bg-gray-100 rounded-lg px-3 py-2 text-center"
                >
                    <p className="text-sm font-bold text-gray-800 leading-none">
                        {String(box.value).padStart(2, '0')}
                        <span className="text-gray-500 font-semibold">{box.label}</span>
                    </p>
                </div>
            ))}
        </div>
    )
}
