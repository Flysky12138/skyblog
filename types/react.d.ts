declare module 'react' {
  interface InputHTMLAttributes {
    webkitdirectory?: 'true'
  }

  /**
   * @see https://ui.shadcn.com/docs/components/base/button#with-icon
   *
   * @template
   * ```tsx
   * <Button variant="outline">
   *     <IconGitBranch data-icon="inline-start" /> New Branch
   * </Button>
   * ```
   */
  interface SVGAttributes {
    'data-icon'?: 'inline-end' | 'inline-start'
  }
}

export {}
