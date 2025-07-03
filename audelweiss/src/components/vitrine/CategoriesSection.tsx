"use client";

import React, { useEffect, useState } from "react";
import { fetchCategories } from "@/services/categories";
import { Category } from "@/types/category";
import { getStrapiMedia } from "@/utils/strapi";

const leftImages = [
  { src: "/img/0b0bc07c-1615-4152-b893-770a637929dc.webp", alt: "Pelotes de laine" },
  { src: "/img/bandeaufantaisie.jpg.webp", alt: "Bandeau fantaisie" },
];

const placeholder = { src: "/img/placeholder.png", alt: "Catégorie" };

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const selectedCat = categories.find((cat) => (hovered ? cat.slug === hovered : cat === categories[0]));
  let rightImage = placeholder;
  if (selectedCat && selectedCat.image && selectedCat.image !== null) {
    const img = selectedCat.image;
    if (img && img.url) {
      rightImage = { src: getStrapiMedia(img.url) || placeholder.src, alt: selectedCat.name };
    } else if (img.formats && img.formats.medium && img.formats.medium.url) {
      rightImage = { src: getStrapiMedia(img.formats.medium.url) || placeholder.src, alt: selectedCat.name };
    } else if (img.formats && img.formats.small && img.formats.small.url) {
      rightImage = { src: getStrapiMedia(img.formats.small.url) || placeholder.src, alt: selectedCat.name };
    }
  }

  return (
    <section className="categoriesSection">
      <div className="categoriesBanner">
        {Array(8).fill(null).map((_, i) => (
          <span key={i}>LES CATÉGORIES&nbsp;•&nbsp;</span>
        ))}
      </div>
      <div className="categoriesGrid">
        <div className="leftImages">
          <div className="leftImgRounded">
            <img src={leftImages[0].src} alt={leftImages[0].alt} />
          </div>
          <div className="leftImgSquare">
            <img src={leftImages[1].src} alt={leftImages[1].alt} />
          </div>
        </div>
        <div className="categoriesListWrapper">
          <div className="categoriesList">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={
                  "categoryItem" +
                  ((hovered ? hovered === cat.slug : cat === categories[0]) ? " active" : "")
                }
                onMouseEnter={() => setHovered(cat.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                {cat.name}
              </div>
            ))}
          </div>
          <button className="shopBtn">Voir la boutique</button>
        </div>
        <div className="rightImage">
          <img src={rightImage.src} alt={rightImage.alt} />
        </div>
      </div>
    </section>
  );
} 