'use client'

import { download } from '@/lib/file/download'
import { Ban, CircleMinus, CirclePlus, Download, Maximize, Minimize, RotateCw } from 'lucide-react'
import React from 'react'
import { PhotoSlider } from 'react-photo-view'
import { IPhotoSliderProps } from 'react-photo-view/dist/PhotoSlider'
import 'react-photo-view/dist/react-photo-view.css'
import { useImmer } from 'use-immer'

interface ImageViewerContextProps {
  openViewer: (payload: Pick<IPhotoSliderProps, 'images' | 'overlayRender' | 'index'>) => void
}

const ImageViewerContext = React.createContext<ImageViewerContextProps>(null!)

export const useImageViewerContext = () => React.useContext(ImageViewerContext)

/**
 * 一款超精致的 React 图片预览组件
 * @see https://github.com/MinJieLiu/react-photo-view
 */
export const ImageViewerProvider = ({ children }: React.PropsWithChildren) => {
  const [data, setData] = useImmer<Pick<IPhotoSliderProps, 'images' | 'overlayRender' | 'visible' | 'index'>>({
    images: [],
    index: 0,
    overlayRender: undefined,
    visible: false
  })

  const [isFullScreen, setIsFullScreen] = React.useState(false)

  const toolbarSvgClassName = 'cursor-pointer p-3 opacity-75 transition-opacity hover:opacity-100'

  return (
    <>
      <ImageViewerContext.Provider
        value={{
          openViewer: ({ images, overlayRender, index }) => {
            setData(state => {
              state.index = index
              state.images = images as []
              state.overlayRender = overlayRender
              state.visible = true
            })
          }
        }}
      >
        {children}
      </ImageViewerContext.Provider>
      <PhotoSlider
        brokenElement={<Ban size={80} />}
        className="pointer-events-auto"
        images={data.images}
        maskClassName="bg-white/50! dark:bg-black/50! backdrop-blur-sm"
        photoWrapClassName="select-none"
        toolbarRender={({ onRotate, onScale, scale, rotate, index, images }) => (
          <section className="flex items-center" role="toolbar">
            <Download
              className={toolbarSvgClassName}
              size={44}
              onClick={async () => {
                const src = images[index].src
                if (!src) return
                const blob = await fetch(src).then(res => res.blob())
                download(blob, decodeURIComponent(src.slice(src.lastIndexOf('/') + 1)))
              }}
            />
            <CirclePlus className={toolbarSvgClassName} size={44} onClick={() => onScale(scale + 1)} />
            <CircleMinus className={toolbarSvgClassName} size={44} onClick={() => onScale(scale - 1)} />
            <RotateCw className={toolbarSvgClassName} size={44} onClick={() => onRotate(rotate + 90)} />
            {isFullScreen ? (
              <Maximize
                className={toolbarSvgClassName}
                size={44}
                onClick={async () => {
                  if (!document.fullscreenElement) return
                  await document.exitFullscreen()
                  setIsFullScreen(false)
                }}
              />
            ) : (
              <Minimize
                className={toolbarSvgClassName}
                size={44}
                onClick={async () => {
                  const el = document.querySelector('.PhotoView-Portal')
                  if (!el) return
                  await el.requestFullscreen()
                  setIsFullScreen(true)
                }}
              />
            )}
          </section>
        )}
        {...(data.overlayRender && {
          overlayRender: props => (
            <div className="absolute inset-x-0 bottom-0 z-50 bg-white/50 p-2 opacity-75 dark:bg-black/50">{data.overlayRender?.(props)}</div>
          )
        })}
        index={data.index}
        visible={data.visible}
        onClose={() => {
          setData(state => {
            state.visible = false
            state.index = 0
            state.images = []
            state.overlayRender = undefined
          })
        }}
        onIndexChange={index => {
          setData(state => {
            state.index = index
          })
        }}
      />
    </>
  )
}
