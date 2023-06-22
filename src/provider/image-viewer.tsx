'use client'

import { download } from '@/lib/file/download'
import { AddCircleOutline, BrokenImage, FileDownloadOutlined, Fullscreen, FullscreenExit, Refresh, RemoveCircleOutline } from '@mui/icons-material'
import { Box, CircularProgress } from '@mui/joy'
import { motion } from 'framer-motion'
import React from 'react'
import { PhotoSlider } from 'react-photo-view'
import { IPhotoSliderProps } from 'react-photo-view/dist/PhotoSlider'
import { useImmer } from 'use-immer'

import 'react-photo-view/dist/react-photo-view.css'

interface ImageViewerContextProps {
  openViewer: (payload: Pick<IPhotoSliderProps, 'images' | 'overlayRender' | 'index'>) => void
}

export const ImageViewerContext = React.createContext<ImageViewerContextProps>({
  openViewer: () => null
})

export const ImageViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useImmer<Pick<IPhotoSliderProps, 'images' | 'overlayRender' | 'visible' | 'index'>>({
    images: [],
    index: 0,
    overlayRender: undefined,
    visible: false
  })

  const [isFullScreen, setIsFullScreen] = React.useState(false)

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
        brokenElement={<BrokenImage color="error" fontSize="large" />}
        className="[&_svg]:transition-transform hover:[&_svg]:scale-125"
        images={data.images}
        loadingElement={
          <CircularProgress
            animate={{ opacity: 1 }}
            color="neutral"
            component={motion.span}
            initial={{ opacity: 0 }}
            transition={{ delay: 1 }}
            variant="plain"
          />
        }
        maskClassName="!bg-white/50 dark:!bg-black/50 backdrop-blur"
        maskClosable={false}
        photoWrapClassName="select-none"
        pullClosable={false}
        toolbarRender={({ onRotate, onScale, scale, rotate, index, images }) => (
          <Box
            className="flex items-center"
            sx={{
              svg: {
                cursor: 'pointer',
                height: 44,
                opacity: 0.75,
                padding: 2.5,
                width: 44
              }
            }}
          >
            <FileDownloadOutlined
              className="PhotoView-Slider__toolbarIcon"
              onClick={async () => {
                const src = images[index].src
                if (!src) return
                const blob = await fetch(src).then(res => res.blob())
                download(blob, decodeURIComponent(src.slice(src.lastIndexOf('/') + 1)))
              }}
            />
            <AddCircleOutline className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 1)} />
            <RemoveCircleOutline className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 1)} />
            <Refresh className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)} />
            {isFullScreen ? (
              <FullscreenExit
                className="PhotoView-Slider__toolbarIcon"
                onClick={async () => {
                  if (!document.fullscreenElement) return
                  await document.exitFullscreen()
                  setIsFullScreen(false)
                }}
              />
            ) : (
              <Fullscreen
                className="PhotoView-Slider__toolbarIcon"
                onClick={async () => {
                  const el = document.querySelector('.PhotoView-Portal')
                  if (!el) return
                  await el.requestFullscreen()
                  setIsFullScreen(true)
                }}
              />
            )}
          </Box>
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
