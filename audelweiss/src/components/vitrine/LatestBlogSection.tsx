"use client";
import React, { useEffect, useState } from 'react';
import { fetchLatestArticles } from '@/services/blog';
import { Article } from '@/types/blog';
import Link from 'next/link';
import { getStrapiMedia } from '@/utils/strapi';

const LatestBlogSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchLatestArticles().then(setArticles);
  }, []);

  return (
    <section className="latestBlogSection">
      <h2 className="sectionTitle">DÉCOUVRE LE BLOG <span role="img" aria-label="point d'exclamation">❗</span></h2>
      <div className="blogCardsContainer">
        {articles.map((article) => (
          <Link href={`/blog/${article.slug}`} key={article.id} className="blogCard">
            <div className="blogCardImageWrapper">
              <img
                src={getStrapiMedia(article.mainImage?.url) || '/img/placeholder.png'}
                alt={article.title}
                className="blogCardImage"
              />
              <div className="blogCardOverlay" />
              <span className="blogCardCategory">
                {article.article_category?.name || 'Blog'}
              </span>
            </div>
            <div className="blogCardContent">
              <h3 className="blogCardTitle">{article.title}</h3>
              <div className="blogCardMeta">
                <span className="blogCardDate">
                  <span role="img" aria-label="date">📅</span> {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestBlogSection; 