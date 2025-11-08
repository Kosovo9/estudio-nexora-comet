import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

export async function POST(request: NextRequest) {
  try {
    const { databaseId } = await request.json()

    if (!databaseId) {
      return NextResponse.json({ error: 'Missing databaseId' }, { status: 400 })
    }

    const notionKey = process.env.NOTION_API_KEY
    if (!notionKey) {
      return NextResponse.json(
        { error: 'NOTION_API_KEY not configured' },
        { status: 500 }
      )
    }

    const notion = new Client({ auth: notionKey })

    const response = await notion.databases.query({
      database_id: databaseId,
    })

    // Transform Notion results to CMSContent format
    const results = response.results.map((page: any) => {
      const properties = page.properties || {}
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        content: properties.Content?.rich_text?.[0]?.plain_text || '',
        type: properties.Type?.select?.name || 'page',
        metadata: {
          ...properties,
          url: page.url,
        },
        createdAt: page.created_time,
        updatedAt: page.last_edited_time,
      }
    })

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Notion CMS error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

