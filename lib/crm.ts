// CRM Integration - HubSpot, Zoho, Salesforce
// Supports multiple CRM providers with unified interface

export interface CRMContact {
  email: string
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  customFields?: Record<string, any>
}

export interface CRMLead {
  contact: CRMContact
  source?: string
  campaign?: string
  metadata?: Record<string, any>
}

type CRMProvider = 'hubspot' | 'zoho' | 'salesforce'

/**
 * Add a lead/contact to CRM
 */
export async function addLeadToCRM(lead: CRMLead, provider: CRMProvider = 'hubspot'): Promise<boolean> {
  try {
    switch (provider) {
      case 'hubspot':
        return await addToHubSpot(lead)
      case 'zoho':
        return await addToZoho(lead)
      case 'salesforce':
        return await addToSalesforce(lead)
      default:
        console.error(`Unknown CRM provider: ${provider}`)
        return false
    }
  } catch (error) {
    console.error(`Error adding lead to ${provider}:`, error)
    return false
  }
}

/**
 * HubSpot Integration
 */
async function addToHubSpot(lead: CRMLead): Promise<boolean> {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) {
    console.error('HUBSPOT_API_KEY not configured')
    return false
  }

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email: lead.contact.email,
          firstname: lead.contact.firstName || lead.contact.name?.split(' ')[0] || '',
          lastname: lead.contact.lastName || lead.contact.name?.split(' ').slice(1).join(' ') || '',
          phone: lead.contact.phone || '',
          company: lead.contact.company || '',
          lead_source: lead.source || 'Website',
          hs_lead_status: 'NEW',
          ...lead.contact.customFields,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('HubSpot API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('HubSpot integration error:', error)
    return false
  }
}

/**
 * Zoho CRM Integration
 */
async function addToZoho(lead: CRMLead): Promise<boolean> {
  const apiKey = process.env.ZOHO_API_KEY
  const accessToken = process.env.ZOHO_ACCESS_TOKEN
  if (!apiKey || !accessToken) {
    console.error('ZOHO_API_KEY or ZOHO_ACCESS_TOKEN not configured')
    return false
  }

  try {
    const response = await fetch(`https://www.zohoapis.com/crm/v3/Contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            Email: lead.contact.email,
            First_Name: lead.contact.firstName || lead.contact.name?.split(' ')[0] || '',
            Last_Name: lead.contact.lastName || lead.contact.name?.split(' ').slice(1).join(' ') || '',
            Phone: lead.contact.phone || '',
            Account_Name: lead.contact.company || '',
            Lead_Source: lead.source || 'Website',
            ...lead.contact.customFields,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Zoho API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Zoho integration error:', error)
    return false
  }
}

/**
 * Salesforce Integration
 */
async function addToSalesforce(lead: CRMLead): Promise<boolean> {
  const accessToken = process.env.SALESFORCE_ACCESS_TOKEN
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
  if (!accessToken || !instanceUrl) {
    console.error('SALESFORCE_ACCESS_TOKEN or SALESFORCE_INSTANCE_URL not configured')
    return false
  }

  try {
    const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Lead`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: lead.contact.email,
        FirstName: lead.contact.firstName || lead.contact.name?.split(' ')[0] || '',
        LastName: lead.contact.lastName || lead.contact.name?.split(' ').slice(1).join(' ') || '',
        Phone: lead.contact.phone || '',
        Company: lead.contact.company || 'Unknown',
        LeadSource: lead.source || 'Website',
        Status: 'Open - Not Contacted',
        ...lead.contact.customFields,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Salesforce API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Salesforce integration error:', error)
    return false
  }
}

/**
 * Track conversion event in CRM
 */
export async function trackConversionInCRM(
  email: string,
  eventType: 'photo_generated' | 'payment_completed' | 'registration',
  metadata?: Record<string, any>
): Promise<boolean> {
  const provider = (process.env.CRM_PROVIDER || 'hubspot') as CRMProvider
  
  try {
    // Create or update contact with conversion data
    const lead: CRMLead = {
      contact: { email },
      source: 'Website',
      metadata: {
        conversion_type: eventType,
        conversion_date: new Date().toISOString(),
        ...metadata,
      },
    }

    return await addLeadToCRM(lead, provider)
  } catch (error) {
    console.error('Error tracking conversion in CRM:', error)
    return false
  }
}

