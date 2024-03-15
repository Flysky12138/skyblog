'use client'

import { download } from '@/lib/download'
import { AddCircleOutline, BrokenImage, FileDownloadOutlined, Fullscreen, FullscreenExit, Refresh, RemoveCircleOutline } from '@mui/icons-material'
import { Box, CircularProgress } from '@mui/joy'
import { motion } from 'framer-motion'
import React from 'react'
import { PhotoSlider } from 'react-photo-view'
import { IPhotoSliderProps } from 'react-photo-view/dist/PhotoSlider'

import 'react-photo-view/dist/react-photo-view.css'

export interface ImageViewerProps
  extends Omit<
    IPhotoSliderProps,
    'brokenElement' | 'loadingElement' | 'maskClassName' | 'maskClosable' | 'photoWrapClassName' | 'pullClosable' | 'toolbarRender'
  > {}

export default function ImageViewer({ onClose, ...props }: ImageViewerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)

  return (
    <PhotoSlider
      brokenElement={<BrokenImage color="error" fontSize="large" />}
      loadingElement={<CircularProgress animate={{ opacity: 1 }} component={motion.span} initial={{ opacity: 0 }} transition={{ delay: 1 }} variant="plain" />}
      maskClassName="!bg-white/50 dark:!bg-black/50 backdrop-blur"
      maskClosable={false}
      photoWrapClassName="select-none"
      pullClosable={false}
      toolbarRender={({ onRotate, onScale, scale, rotate, index }) => (
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
            onClick={async () => {
              const src = props.images[index].src
              if (!src) return
              const blob = await fetch(src).then(res => res.blob())
              download(blob, src.slice(0, src.lastIndexOf('.')))
            }}
          />
          <AddCircleOutline onClick={() => onScale(scale + 1)} />
          <RemoveCircleOutline onClick={() => onScale(scale - 1)} />
          <Refresh onClick={() => onRotate(rotate + 90)} />
          {isFullScreen ? (
            <FullscreenExit
              onClick={async () => {
                if (!document.fullscreenElement) return
                await document.exitFullscreen()
                setIsFullScreen(false)
              }}
            />
          ) : (
            <Fullscreen
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
      onClose={() => {
        setIsFullScreen(false)
        onClose()
      }}
      {...props}
    />
  )
}
