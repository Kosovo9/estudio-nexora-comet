'use client'

interface SchemaOrgProps {
  type?: 'WebSite' | 'Organization' | 'Product' | 'Service'
  name?: string
  url?: string
  description?: string
  image?: string
  searchAction?: boolean
}

export default function SchemaOrg({
  type = 'WebSite',
  name = 'Studio Nexora Comet Global',
  url = 'https://studio-nexora.com',
  description = 'AI Photo Studio, edición imágenes, afiliados, marketplace.',
  image = 'https://studio-nexora.com/og-image.jpg',
  searchAction = true,
}: SchemaOrgProps) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url,
    description,
    image,
  }

  if (type === 'WebSite' && searchAction) {
    ;(baseSchema as any).potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://studio-nexora.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseSchema, null, 2),
      }}
    />
  )
}

