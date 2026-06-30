import React from 'react'

export default function MainBanner() {
    return (
        <div>
            <div className="bg-white rounded-xl p-6">
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
                        <div className="absolute bottom-4 right-6 bg-white text-xs px-3 py-1 rounded-full shadow">
                            3 / 3
                        </div>
                    </div>

                    {/* Right Small Banner */}
                    {/* <div className="rounded-xl overflow-hidden bg-linear-to-b from-[#dcdff1] to-[#f3d7a6] p-6 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-xl font-semibold leading-tight mb-2">
                                    redmi note 12 <br /> Pro+ 5g
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Rise to the challenge
                                </p>
                            </div>
                            <button className="bg-black max-w-50 max-h-10 text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition">
                                SHOP NOW
                            </button>
                        </div>


                        <div className=" flex justify-between items-end mt-4">
                            <img
                                src="https://www.gizmochina.com/wp-content/uploads/2026/04/Redmi-Note-17-500x500.png?x10805"
                                alt="Phone"
                                className=" w-full object-contain"
                            />


                        </div>

                    </div> */}

                    {/* <div className="relative rounded-xl overflow-hidden p-6 flex flex-col justify-between bg-linear-to-b from-[#dcdff1] to-[#f3d7a6]">

                       
                        <img
                            src="https://www.gizmochina.com/wp-content/uploads/2026/04/Redmi-Note-17-500x500.png?x10805"
                            alt="Phone"
                            className="absolute inset-0 w-full border object-cover"
                        />

                       
                        <div className="relative z-10 flex justify-between">
                            <div>
                                <h3 className="text-xl font-semibold leading-tight mb-2">
                                    redmi note 12 <br /> Pro+ 5g
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Rise to the challenge
                                </p>
                            </div>

                            <button className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition">
                                SHOP NOW
                            </button>
                        </div>

                    </div> */}

                    <div className="relative rounded-xl overflow-hidden p-6 flex flex-col justify-end h-[280px]">

                        {/* Background Image */}
                        <img
                            src="https://www.gizmochina.com/wp-content/uploads/2026/04/Redmi-Note-17-500x500.png?x10805"
                            alt="Phone"
                            className="absolute inset-0 w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-purple-600/20"></div>

                       
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <h3 className="text-xl font-semibold leading-tight mb-1 text-black">
                                    Redmi Note 17 <br /> Pro+ 5G
                                </h3>
                                <p className="text-sm text-black">
                                    Rise to the challenge
                                </p>
                            </div>

                            <button className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition">
                                SHOP NOW
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
