import { GradientText } from '@/components/ui/gradient-text'

export const Logo = () => {
  return (
    <GradientText
      animationSpeed={2}
      className="font-title mx-0 text-lg font-semibold tracking-wider whitespace-nowrap backdrop-blur-none select-none"
      colors={['var(--color-cyan-500)', 'var(--color-sky-500)', 'var(--color-blue-500)']}
    >
      {process.env.NEXT_PUBLIC_TITLE}
    </GradientText>
  )
}
