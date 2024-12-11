import React from 'react'

/** 递归遍历 react 标签 */
export const deepTraversalReactElement = <T>(root: React.ReactNode, callback: (node: React.ReactElement<T>, index?: number) => void) => {
  React.Children.forEach(root, (child, index) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return
    callback(child as React.ReactElement<T>, index)
    const { props } = child
    if (props && props.children) {
      const children = Array.isArray(props.children) ? props.children : [props.children]
      deepTraversalReactElement(children, callback)
    }
  })
}
