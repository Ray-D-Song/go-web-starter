import { computed, ref, watch } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import {
  BASE_COLORS,
  DEFAULT_CONFIG,
  getTheme,
  getThemesForBaseColor,
  PRESETS,
  STYLES,
} from '@/registry/config'
import type { BaseColorName, StyleName, ThemeName } from '@/registry/config'

const STORAGE_KEY = 'vue-shadcn-starter:theme'

interface ThemeSettings {
  style: StyleName
  baseColor: BaseColorName
  theme: ThemeName
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function isStyleName(value: unknown): value is StyleName {
  return typeof value === 'string' && STYLES.some(style => style.name === value)
}

function isBaseColorName(value: unknown): value is BaseColorName {
  return typeof value === 'string' && BASE_COLORS.some(baseColor => baseColor.name === value)
}

function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && Boolean(getTheme(value))
}

function normalizeSettings(value: Partial<ThemeSettings> = {}): ThemeSettings {
  const baseColor = isBaseColorName(value.baseColor) ? value.baseColor : DEFAULT_CONFIG.baseColor
  const availableThemes = getThemesForBaseColor(baseColor)
  const theme = isThemeName(value.theme) && availableThemes.some(item => item.name === value.theme)
    ? value.theme
    : availableThemes[0]?.name ?? DEFAULT_CONFIG.theme

  return {
    style: isStyleName(value.style) ? value.style : DEFAULT_CONFIG.style,
    baseColor,
    theme,
  }
}

function loadSettings(): ThemeSettings {
  if (!isBrowser()) {
    return normalizeSettings()
  }

  try {
    return normalizeSettings(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}'))
  }
  catch {
    return normalizeSettings()
  }
}

function saveSettings(settings: ThemeSettings) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function applyCssVars(themeName: ThemeName) {
  if (!isBrowser()) {
    return
  }

  const theme = getTheme(themeName)
  const mode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')
    ? 'dark'
    : 'light'
  const cssVars = theme?.cssVars?.[mode] ?? theme?.cssVars?.light

  if (!cssVars) {
    return
  }

  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, String(value))
  })
}

function applyAttributes(settings: ThemeSettings) {
  if (!isBrowser()) {
    return
  }

  document.documentElement.dataset.style = settings.style
  document.documentElement.dataset.baseColor = settings.baseColor
  document.documentElement.dataset.theme = settings.theme
}

export const useTheme = createSharedComposable(() => {
  const settings = ref<ThemeSettings>(loadSettings())

  const availableThemes = computed(() => getThemesForBaseColor(settings.value.baseColor))

  const style = computed({
    get: () => settings.value.style,
    set: (value: StyleName) => {
      const preset = PRESETS.find(item => item.style === value)

      settings.value = normalizeSettings({
        ...settings.value,
        style: value,
        baseColor: preset?.baseColor ?? settings.value.baseColor,
        theme: preset?.chartColor ?? preset?.theme ?? settings.value.theme,
      })
    },
  })

  const baseColor = computed({
    get: () => settings.value.baseColor,
    set: (value: BaseColorName) => {
      settings.value = normalizeSettings({
        ...settings.value,
        baseColor: value,
      })
    },
  })

  const theme = computed({
    get: () => settings.value.theme,
    set: (value: ThemeName) => {
      settings.value = normalizeSettings({
        ...settings.value,
        theme: value,
      })
    },
  })

  watch(
    settings,
    (value) => {
      saveSettings(value)
      applyAttributes(value)
      applyCssVars(value.theme)
    },
    { deep: true, immediate: true },
  )

  if (isBrowser()) {
    const observer = new MutationObserver(() => applyCssVars(settings.value.theme))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  }

  return {
    style,
    baseColor,
    theme,
    availableThemes,
    styles: STYLES,
    baseColors: BASE_COLORS,
  }
})
