// CMS Integration - Notion, Sanity, Supabase
// Plug & play content management

export type CMSProvider = 'notion' | 'sanity' | 'supabase'

export interface CMSContent {
  id: string
  title: string
  content: string
  type: 'blog' | 'faq' | 'news' | 'gallery' | 'page'
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

/**
 * Notion CMS Integration
 */
export async function getNotionContent(databaseId: string): Promise<CMSContent[]> {
  try {
    const response = await fetch('/api/cms/notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ databaseId }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Notion content')
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Notion CMS error:', error)
    return []
  }
}

/**
 * Sanity CMS Integration
 */
export async function getSanityContent(query: string): Promise<CMSContent[]> {
  try {
    const response = await fetch('/api/cms/sanity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Sanity content')
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Sanity CMS error:', error)
    return []
  }
}

/**
 * Supabase CMS (using existing tables)
 */
export async function getSupabaseContent(
  table: string,
  filters?: Record<string, any>
): Promise<CMSContent[]> {
  try {
    const response = await fetch('/api/cms/supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, filters }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Supabase content')
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Supabase CMS error:', error)
    return []
  }
}

/**
 * Universal CMS getter (auto-detects provider)
 */
export async function getCMSContent(
  provider: CMSProvider,
  options: {
    databaseId?: string
    query?: string
    table?: string
    filters?: Record<string, any>
  }
): Promise<CMSContent[]> {
  switch (provider) {
    case 'notion':
      if (!options.databaseId) throw new Error('Notion databaseId required')
      return await getNotionContent(options.databaseId)
    case 'sanity':
      if (!options.query) throw new Error('Sanity query required')
      return await getSanityContent(options.query)
    case 'supabase':
      if (!options.table) throw new Error('Supabase table required')
      return await getSupabaseContent(options.table, options.filters)
    default:
      throw new Error(`Unknown CMS provider: ${provider}`)
  }
}

