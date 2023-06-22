import React from 'react'

/**
 * 递归遍历 react 标签
 */
export const deepTraversalReactElement = <T extends React.PropsWithChildren>(
  root: React.ReactNode,
  fn: (node: React.ReactElement<T>, index?: number) => void
) => {
  React.Children.forEach(root, (child, index) => {
    if (!React.isValidElement<React.PropsWithChildren>(child)) return
    fn(child as React.ReactElement<T>, index)
    const { props } = child
    if (props && props.children) {
      const children = Array.isArray(props.children) ? props.children : [props.children]
      deepTraversalReactElement(children, fn)
    }
  })
}
