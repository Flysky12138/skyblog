import { mapValues, toMerged } from 'es-toolkit'
import React from 'react'

import { Components, ComponentsProps } from '../components/elements'

/**
 * 添加组件默认属性
 */
export const withComponentProps = (components: Components, componentsProps: ComponentsProps = {}) => {
  return mapValues(components, (Component, name) => {
    if (!componentsProps[name]) return Component

    // eslint-disable-next-line react/display-name
    return function (props: any) {
      return <Component {...toMerged(props, componentsProps[name] ?? {})} />
    }
  })
}

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
    if (props?.children) {
      const children = Array.isArray(props.children) ? props.children : [props.children]
      deepTraversalReactElement(children, fn)
    }
  })
}
