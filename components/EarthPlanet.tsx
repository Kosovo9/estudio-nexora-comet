'use client'

import EarthSelector from './EarthSelector'

interface EarthPlanetProps {
  language: string
}

export default function EarthPlanet({ language }: EarthPlanetProps) {
  return <EarthSelector lang={language as 'en' | 'es'} />
}

