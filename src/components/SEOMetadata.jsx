import React from "react";
import { Helmet } from "react-helmet-async";

const SEOMetadata = ({
  title = "Kuesioner Manfaat Smartphone | Riset Skripsi",
  description = "Ikuti kuesioner singkat ini untuk berbagi pandangan Anda tentang manfaat smartphone. Partisipasi Anda sangat berharga untuk riset skripsi mengenai teknologi & kebiasaan.",
  keywords = "kuesioner, riset, skripsi, smartphone, teknologi, manfaat smartphone, kehidupan sehari-hari",
  imageUrl = "https://res.cloudinary.com/dyhzykjyc/image/upload/v1759575777/i8fzdg0ybix9hqp9appp.png", // Ganti dengan URL gambar utama Anda
  url = "https://kuesioner-putri.web.app", // GANTI DENGAN URL WEBSITE ANDA SETELAH DEPLOY
}) => {
  return (
    <Helmet>
      {/* Tag SEO Utama */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags (untuk Facebook, LinkedIn, dll.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEOMetadata;
