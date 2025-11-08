'use client'

import { type Language } from '@/lib/i18n'

interface TeamChecklistProps {
  items: string[]
  lang?: Language
  title?: string
}

const defaultTitle = {
  en: 'Team QA Checklist',
  es: 'Checklist QA equipo',
}

export default function TeamChecklist({
  items,
  lang = 'es',
  title,
}: TeamChecklistProps) {
  const displayTitle = title || defaultTitle[lang]

  return (
    <div
      style={{
        padding: '17px 23px',
        background: '#e5e7f1',
        borderRadius: 10,
        marginTop: 16,
      }}
    >
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
        {displayTitle}
      </h4>
      <ul style={{ margin: 0, paddingLeft: 20, listStyle: 'none' }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              margin: '2px 0',
              color: '#137d48',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            ✔ {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

