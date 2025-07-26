// components/SeoHeader.js
import Head from 'next/head'

export default function SeoHeader({ meta }) {
  // If for some reason meta is missing, render nothing
  if (!meta || !meta.slug) return null

  const {
    slug,
    meta_title,
    meta_description,
    meta_keywords,
 
  } = meta
  const url = `https://xpertbid.com/${slug}`

  return (
    <Head>
      <title>{meta_title}</title>
      <meta name="description" content={meta_description} />
      <meta name="keywords"    content={meta_keywords} />
      <link rel="canonical"     href={url} />

 <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      
    </Head>
  )
}
