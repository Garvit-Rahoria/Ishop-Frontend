import CategoryShowcaseCard from './CategoryShowcaseCard'

export default function SectionSix() {

    const data = [
        {
            title: 'AUDIOS & CAMERAS',
            bannerImage: '/banners/audio.png',
            bannerText: 'Best Speaker 2023',
            categories: [
                { name: 'Speaker', items: 12, icon: '/icons/speaker.png' },
                { name: 'DSLR Camera', items: 9, icon: '/icons/dslr.png' },
                { name: 'Earbuds', items: 5, icon: '/icons/earbuds.png' },
                { name: 'Microphone', items: 12, icon: '/icons/microphone.png' },
            ],
        },
        {
            title: 'GAMING',
            bannerImage: '/banners/gaming.png',
            bannerText: 'Wireless RGB Gaming Mouse',
            categories: [
                { name: 'Monitors', items: 28, icon: '/icons/monitor.png' },
                { name: 'Chair', items: 12, icon: '/icons/chair.png' },
                { name: 'Controller', items: 9, icon: '/icons/controller.png' },
                { name: 'Keyboards', items: 30, icon: '/icons/keyboard.png' },
            ],
        },
        {
            title: 'OFFICE EQUIPMENTS',
            bannerImage: '/banners/office.png',
            bannerText: 'Laser Projector',
            categories: [
                { name: 'Printers', items: 9, icon: '/icons/printer.png' },
                { name: 'Network', items: 90, icon: '/icons/router.png' },
                { name: 'Security', items: 12, icon: '/icons/security.png' },
                { name: 'Projectors', items: 12, icon: '/icons/projector.png' },
            ],
        },
    ]

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item, index) => (
                    <CategoryShowcaseCard key={index} {...item} />
                ))}
            </div>
        </section>
    )
}
