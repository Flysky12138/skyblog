import { cn } from '../lib/utils'

export function NoiseTexture({ className, ...props }: React.ComponentProps<'figure'>) {
  return (
    <figure
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-50 opacity-10 mix-blend-screen filter-[url('#noise-bg-fx')]", className)}
      {...props}
    >
      <svg>
        <filter id="noise-bg-fx">
          <feTurbulence baseFrequency="0.8" />
        </filter>
      </svg>
    </figure>
  )
}
