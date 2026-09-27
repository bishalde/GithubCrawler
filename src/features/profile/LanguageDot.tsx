import { languageColor } from '../../lib/languages'

export function LanguageDot({ language, className = 'size-2.5' }: { language: string | null; className?: string }) {
  return <span className={`inline-block shrink-0 rounded-full ${className}`} style={{ backgroundColor: languageColor(language) }} aria-hidden />
}
