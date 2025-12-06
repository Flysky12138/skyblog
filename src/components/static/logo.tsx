import { GradientText } from '@/components/static/gradient-text'

export function Logo() {
  return (
    <GradientText
      animationSpeed={2}
      aria-label="logo"
      className="font-title mx-0 text-lg font-semibold tracking-wider whitespace-nowrap backdrop-blur-none select-none"
      colors={['var(--color-cyan-500)', 'var(--color-blue-500)', 'var(--color-violet-500)']}
    >
      {process.env.NEXT_PUBLIC_TITLE}
    </GradientText>
  )
}
