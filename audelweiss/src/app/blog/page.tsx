// src/app/blog/page.tsx
export default function BlogPage() {
    return (
        <div className="container mx-auto px-5">
            <div className="flex items-center mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
                <img src="logo-audelweiss.svg" alt="Logo" className="m-6 w-67" />
                <p className="sm: text-center">Self-updating blog with Sanity Live Content & Next.js</p>
            </div>
            <article>
                <a href="" className="group mb-8 block md:mb-16">
                    <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                        <img src="bonnet.png" alt="image paysage naige" />
                    </div>
                </a>
                <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
                    <div>
                        <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
                            <a className="hover:underline" href="">Quelle laine choisir ? (Guide Complet 2025)</a>
                        </h3>
                        <div className="mb-4 text-lg md:mb-0">
                            <time >2 Avril 2025</time>
                        </div>
                    </div>
                    <div>
                        <p className="text-pretty mb-4 text-lg leading-relaxed">
                            Vous vous demandez quelle laine choisir pour vos projets de tricot ou de crochet ? Ne cherchez pas plus loin ! Dans cet article, nous vous guiderons à travers les différents types de laine disponibles sur le marché.
                        </p>
                        <div className="flex items-center text-xl">
                            <div className="mr-4 h-12 w-12">
                                <img src="photo-auteur.png" alt="photo auteur article" className="h-full rounded-full object-cover" />
                            </div>
                            <div className="text-pretty text-xl font-bold">
                                <p className="vertical-align: inherit;">Kadem Garnier</p>

                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </article>
            <aside>
                <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
                    <p>Plus d'articles</p>
                </h2>
                <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
                    <article>
                        <a href="" className="group mb-5 block">
                            <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                                <img src="image-tokyo.png" alt="" />
                            </div>
                        </a>
                        <h3 className="text-balance mb-3 text-3xl leading-snug">
                            <a href=""  className="hover:underline">
                                <p className="vertical-align: inherit">Comment entretenir son bonnet en laine pour qu’il dure des années ?</p>
                            </a>
                        </h3>
                        <div className="mb-4 text-lg">
                            <time>5 Avril 2025</time>
                        </div>
                        <p className="text-pretty mb-4 text-lg leading-relaxed">Lave, sèche et entretiens ton bonnet en laine sans l’abîmer ! Découvre mes conseils pour éviter le feutrage et prolonger sa durée de vie. 🧼🧶
                        </p>
                        <div className="flex items-center text-xl">
                            <div className="mr-4 h-12 w-12">
                                <img src="photo-auteur.png" alt="photo auteur article" className="h-full rounded-full object-cover" />
                            </div>
                            <div className="text-pretty text-xl font-bold">
                                <p className="vertical-align: inherit;">Kadem Garnier</p>
                            </div>
                        </div>
                    </article>


                    <article>
                        <a href="" className="group mb-5 block">
                            <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                                <img src="image-tokyo.png" alt="" />
                            </div>
                        </a>
                        <h3 className="text-balance mb-3 text-3xl leading-snug">
                            <a href=""  className="hover:underline">
                                <p className="vertical-align: inherit">Comment entretenir son bonnet en laine pour qu’il dure des années ?</p>
                            </a>
                        </h3>
                        <div className="mb-4 text-lg">
                            <time>5 Avril 2025</time>
                        </div>
                        <p className="text-pretty mb-4 text-lg leading-relaxed">Lave, sèche et entretiens ton bonnet en laine sans l’abîmer ! Découvre mes conseils pour éviter le feutrage et prolonger sa durée de vie. 🧼🧶
                        </p>
                        <div className="flex items-center text-xl">
                            <div className="mr-4 h-12 w-12">
                                <img src="photo-auteur.png" alt="photo auteur article" className="h-full rounded-full object-cover" />
                            </div>
                            <div className="text-pretty text-xl font-bold">
                                <p className="vertical-align: inherit;">Kadem Garnier</p>
                            </div>
                        </div>
                    </article>

                    <article>
                        <a href="" className="group mb-5 block">
                            <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                                <img src="image-tokyo.png" alt="" />
                            </div>
                        </a>
                        <h3 className="text-balance mb-3 text-3xl leading-snug">
                            <a href=""  className="hover:underline">
                                <p className="vertical-align: inherit">Comment entretenir son bonnet en laine pour qu’il dure des années ?</p>
                            </a>
                        </h3>
                        <div className="mb-4 text-lg">
                            <time>5 Avril 2025</time>
                        </div>
                        <p className="text-pretty mb-4 text-lg leading-relaxed">Lave, sèche et entretiens ton bonnet en laine sans l’abîmer ! Découvre mes conseils pour éviter le feutrage et prolonger sa durée de vie. 🧼🧶
                        </p>
                        <div className="flex items-center text-xl">
                            <div className="mr-4 h-12 w-12">
                                <img src="photo-auteur.png" alt="photo auteur article" className="h-full rounded-full object-cover" />
                            </div>
                            <div className="text-pretty text-xl font-bold">
                                <p className="vertical-align: inherit;">Kadem Garnier</p>
                            </div>
                        </div>
                    </article>


                    <article>
                        <a href="" className="group mb-5 block">
                            <div className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0">
                                <img src="image-tokyo.png" alt="" />
                            </div>
                        </a>
                        <h3 className="text-balance mb-3 text-3xl leading-snug">
                            <a href=""  className="hover:underline">
                                <p className="vertical-align: inherit">Comment entretenir son bonnet en laine pour qu’il dure des années ?</p>
                            </a>
                        </h3>
                        <div className="mb-4 text-lg">
                            <time>5 Avril 2025</time>
                        </div>
                        <p className="text-pretty mb-4 text-lg leading-relaxed">Lave, sèche et entretiens ton bonnet en laine sans l’abîmer ! Découvre mes conseils pour éviter le feutrage et prolonger sa durée de vie. 🧼🧶
                        </p>
                        <div className="flex items-center text-xl">
                            <div className="mr-4 h-12 w-12">
                                <img src="photo-auteur.png" alt="photo auteur article" className="h-full rounded-full object-cover" />
                            </div>
                            <div className="text-pretty text-xl font-bold">
                                <p className="vertical-align: inherit;">Kadem Garnier</p>
                            </div>
                        </div>
                    </article>
                </div>
            </aside>
        </div>
    )
}

