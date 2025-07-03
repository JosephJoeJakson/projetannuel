import React from "react";

const features = [
  {
    number: "01",
    title: "ARTISANAT EMBRUNAIS",
    text: "Je vis dans les Hautes-Alpes, un cadre qui m'inspire chaque jour. Toutes mes créations sont réalisées ici, à la main, avec des matériaux choisis avec soin. J'aime l'idée de proposer des pièces qui portent en elles un peu de cette authenticité montagnarde.",
    svg: "/img/montagne.svg",
  },
  {
    number: "02",
    title: "ÉDITIONS LIMITÉES OU SUR-MESURE",
    text: "Je suis une créatrice curieuse, toujours en quête de nouvelles idées. J'aime tester des techniques, des couleurs et des matières différentes. Cette envie d'explorer donne naissance à des pièces variées : certaines sont produites en petites séries, d'autres peuvent être personnalisées selon vos goûts et vos besoins.",
    svg: "/img/reiki.svg",
  },
  {
    number: "03",
    title: "PERSONNALISATION SUR DEMANDE",
    text: (
      <>
        Crochet, gravure ou flocage : je réalise des créations personnalisées pour ta décoration ou des cadeaux ! Certains produits de la boutique sont personnalisables, mais je peux tout à fait personnaliser un objet que tu as déjà en ta possession. <a href="#contact" className="link">Ecris-moi</a> pour en savoir plus ✨
      </>
    ),
    svg: "/img/crochet-1.svg",
  },
];

const FeaturesSection = () => {
  return (
    <section className="featuresSection">
      <div className="featuresGrid">
        {features.map((f, i) => (
          <div className="feature" key={f.number}>
            <img src={f.svg} alt="Décor" className="featureBg" aria-hidden="true" />
            <div className="featureNumber">{f.number}</div>
            <h3 className="featureTitle">{f.title}</h3>
            <div className="featureText">{f.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection; 