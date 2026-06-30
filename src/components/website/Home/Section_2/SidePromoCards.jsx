import Image from 'next/image'

const promoImages = [
    '/promos/controller.png',
    '/promos/controller.png',
    '/promos/controller.png',
]

export default function SidePromoCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {promoImages.map((image, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-xl bg-gray-100 aspect-video"
                >
                    <Image
                        src={image}
                        alt="Promo"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 25vw"
                    />
                </div>
            ))}
        </div>
    )
}
