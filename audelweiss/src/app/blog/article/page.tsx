// src/app/blog/article/page.tsx
export default function ArticleDetailPage() {
    return (
        <div className="container mx-auto px-5">
            <div className="flex items-center mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
                <img src="/logo-audelweiss.svg" alt="Logo" className="m-6 w-67" />
                <p className="sm: text-center">Self-updating blog with Sanity Live Content & Next.js</p>
            </div>
            <article>
                <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">Comment entretenir son bonnet en laine pour qu’il dure des années ?</h1>
                <div className="hidden md:mb-12 md:block">
                    <div className="flex items-center text-xl">
                        <div className="mr-4 h-12 w-12">
                            <img src="/photo-auteur.png" alt="photo auteur article" className="h-full rounded-full object-cover" />
                        </div>
                        <div className="text-pretty text-xl font-bold">Kadem Garnier</div>
                    </div>

                </div>

                <div className="mb-8 sm:mx-0 md:mb-16">
                    <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                        <img src="/image-tokyo.png" alt="" className="h-auto w-full" />
                    </div>
                </div>
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6 text-lg">
                        <div className="mb-4 text-lg">
                            <time>5 Avril 2025</time>
                        </div>
                    </div>
                </div>
                <div className="prose mx-auto max-w-2xl">
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>
                    <h2 className="mt-12 mb-4 text-2xl font-semibold text-black-600">Les types des bonnets</h2>
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>

                    <h2 className="mt-12 mb-4 text-2xl font-semibold text-black-600">Les couleurs des bonnets</h2>
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>
                    <p className="mb-4 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, voluptatem non dignissimos vero, quo nobis magnam, eius alias assumenda officia libero! Voluptatum voluptatibus exercitationem distinctio eos, quisquam quibusdam natus laboriosam.</p>

                </div>
            </article>
        </div>
    )
}
