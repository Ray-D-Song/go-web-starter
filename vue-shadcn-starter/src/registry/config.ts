import { BASE_COLORS } from '@/registry/base-colors'
import { STYLES } from '@/registry/styles'
import { THEMES } from '@/registry/themes'

export { BASE_COLORS, STYLES, THEMES }

export type Style = (typeof STYLES)[number]
export type StyleName = Style['name']
export type Theme = (typeof THEMES)[number]
export type ThemeName = Theme['name']
export type BaseColor = (typeof BASE_COLORS)[number]
export type BaseColorName = BaseColor['name']

export interface ThemePreset {
  name: string
  title: string
  style: StyleName
  baseColor: BaseColorName
  theme: ThemeName
  chartColor?: ThemeName
}

export const DEFAULT_CONFIG = {
  style: 'luma',
  baseColor: 'zinc',
  theme: 'sky',
} as const satisfies {
  style: StyleName
  baseColor: BaseColorName
  theme: ThemeName
}

export const PRESETS: ThemePreset[] = [
  {
    name: 'reka-vega',
    title: 'Vega',
    style: 'vega',
    baseColor: 'neutral',
    theme: 'neutral',
    chartColor: 'neutral',
  },
  {
    name: 'reka-nova',
    title: 'Nova',
    style: 'nova',
    baseColor: 'neutral',
    theme: 'neutral',
    chartColor: 'neutral',
  },
  {
    name: 'reka-maia',
    title: 'Maia',
    style: 'maia',
    baseColor: 'neutral',
    theme: 'neutral',
    chartColor: 'neutral',
  },
  {
    name: 'reka-lyra',
    title: 'Lyra',
    style: 'lyra',
    baseColor: 'neutral',
    theme: 'neutral',
    chartColor: 'neutral',
  },
  {
    name: 'reka-mira',
    title: 'Mira',
    style: 'mira',
    baseColor: 'neutral',
    theme: 'neutral',
    chartColor: 'neutral',
  },
  {
    name: 'reka-luma',
    title: 'Luma',
    style: 'luma',
    baseColor: 'neutral',
    theme: 'neutral',
    chartColor: 'neutral',
  },
  {
    name: 'reka-sera',
    title: 'Sera',
    style: 'sera',
    baseColor: 'taupe',
    theme: 'taupe',
    chartColor: 'taupe',
  },
]

export function getThemesForBaseColor(baseColorName: string) {
  const baseColorNames = BASE_COLORS.map(baseColor => baseColor.name)

  return THEMES.filter((theme) => {
    if (theme.name === baseColorName) {
      return true
    }

    return !baseColorNames.includes(theme.name)
  })
}

export function getTheme(name: string) {
  return THEMES.find(theme => theme.name === name)
}
