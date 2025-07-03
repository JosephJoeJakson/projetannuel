"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const WORDS = [
  "uniques",
  "faites-main",
  "douces",
  "colorées",
  "sur mesure",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-section__overlay">
        <div className="hero-section__content">
          <h1 className="hero-section__headline">
            <span className="hero-section__static">Des créations </span>
            <span className="hero-section__words-wrapper">
              {WORDS.map((word, idx) => (
                <b
                  key={word}
                  className={`hero-section__word hero-section__highlight dnxt-text-animation${idx === current ? " is-visible" : " is-hidden"}`}
                >
                  {word}
                </b>
              ))}
            </span>
            <span className="hero-section__static"> crochetées et gravées</span>
          </h1>
          <p className="hero-section__subtitle">
            Chaque pièce est soigneusement confectionnée à la main dans les Hautes-Alpes. Offre-toi (ou à tes proches) un savoir-faire inspiré de la montagne, alliant douceur et originalité.
          </p>
          <Link href="/products" className="hero-section__cta">
            Découvrir la boutique
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 