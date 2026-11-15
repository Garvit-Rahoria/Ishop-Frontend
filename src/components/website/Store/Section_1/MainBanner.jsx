import React from 'react'

export default function MainBanner() {
    return (
        <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Large Banner */}
                    <div className="lg:col-span-2 bg-[#a9adb6] rounded-xl relative overflow-hidden flex items-center">
                        <div className="p-8 max-w-md z-10">
                            <h3 className="text-3xl font-bold text-white leading-tight">
                                Noise Cancelling
                            </h3>
                            <h4 className="text-2xl text-white font-light mb-4">
                                Headphone
                            </h4>

                            <p className="text-white text-sm leading-relaxed">
                                Boso Over-Ear Headphone <br />
                                Wifi, Voice Assistant, <br />
                                Low Latency Game Mode
                            </p>

                            <button className="mt-6 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                                BUY NOW
                            </button>
                        </div>

                        {/* Image */}
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/047/380/773/small/sound-headphones-audio-voice-with-radio-on-black-recording-studio-or-podcasting-banner-photo.jpg"
                            alt="Headphone"
                            className="absolute w-full h-full object-cover"
                        />

                        {/* Slider Indicator */}
                        <div className="absolute bottom-4 right-6 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow border border-white/20">
                            3 / 3
                        </div>
                    </div>

                    {/* Right Small Banner */}
                    <div className="relative rounded-xl overflow-hidden p-6 flex flex-col justify-end h-[280px]">

                        {/* Background Image */}
                        <img
                            src="https://www.gizmochina.com/wp-content/uploads/2026/04/Redmi-Note-17-500x500.png?x10805"
                            alt="Phone"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-purple-950/50 to-transparent"></div>

                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <h3 className="text-xl font-bold leading-tight mb-1 text-white drop-shadow">
                                    Redmi Note 17 <br /> Pro+ 5G
                                </h3>
                                <p className="text-sm text-slate-200 drop-shadow-xs">
                                    Rise to the challenge
                                </p>
                            </div>

                            <button className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm cursor-pointer">
                                SHOP NOW
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
