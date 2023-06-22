import React from 'react'

export const traverseReactElement = (root: React.ReactNode, callback: (node: React.ReactNode) => void) => {
  React.Children.forEach(root, child => {
    if (!React.isValidElement(child)) return
    callback(child)
    const { props } = child
    if (props && props.children) {
      const children = Array.isArray(props.children) ? props.children : [props.children]
      traverseReactElement(children, callback)
    }
  })
}
