import React from 'react'

import { cn } from '@/lib/utils'

interface GradientTextProps extends React.ComponentProps<'div'> {
  /**
   * Animation duration in seconds
   * @default 8
   */
  animationSpeed?: number
  /**
   * Array of colors for the gradient
   * @default ["#ffaa40", "#9c40ff", "#ffaa40"]
   */
  colors?: string[]
  /**
   * Show animated border
   * @default false
   */
  showBorder?: boolean
}

export function GradientText({
  animationSpeed = 8,
  children,
  className,
  colors = ['#ffaa40', '#9c40ff', '#ffaa40'],
  showBorder = false,
  ...props
}: GradientTextProps) {
  const gradientStyle = {
    animationDuration: `${animationSpeed}s`,
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`
  }

  return (
    <div
      className={cn(
        'relative mx-auto flex max-w-fit flex-row items-center justify-center',
        'rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500',
        'cursor-pointer overflow-hidden',
        className
      )}
      {...props}
    >
      {showBorder && (
        <div
          className="animate-gradient pointer-events-none absolute inset-0 z-0 bg-cover"
          style={{
            ...gradientStyle,
            backgroundSize: '300% 100%'
          }}
        >
          <div
            className="bg-background absolute inset-0 z-[-1] rounded-[1.25rem]"
            style={{
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100% - 2px)'
            }}
          />
        </div>
      )}
      <div
        className="animate-gradient relative z-2 inline-block bg-cover text-transparent"
        style={{
          ...gradientStyle,
          backgroundClip: 'text',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text'
        }}
      >
        {children}
      </div>
    </div>
  )
}
