import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const projectId = process.env.SANITY_PROJECT_ID
    const dataset = process.env.SANITY_DATASET || 'production'
    const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01'
    const token = process.env.SANITY_API_TOKEN

    if (!projectId) {
      return NextResponse.json(
        { error: 'SANITY_PROJECT_ID not configured' },
        { status: 500 }
      )
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })

    const results = await client.fetch(query)

    // Transform Sanity results to CMSContent format
    const transformed = Array.isArray(results)
      ? results.map((item: any) => ({
          id: item._id,
          title: item.title || item.name || 'Untitled',
          content: item.content || item.body || '',
          type: item._type || 'page',
          metadata: item,
          createdAt: item._createdAt,
          updatedAt: item._updatedAt,
        }))
      : []

    return NextResponse.json({ results: transformed })
  } catch (error: any) {
    console.error('Sanity CMS error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

