'use client'

import { Fancybox } from '@fancyapps/ui'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useDebounce, useLocalStorage } from 'react-use'
import { toast } from 'sonner'

import { FileSelect } from '@/components/form/file-select'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Badge } from '@/components/ui/badge'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DirectoryHelper } from '@/lib/file/directory-helper'
import { formatFileSize } from '@/lib/parser/size'

import { compressImageByCanvas, imageCompressionGroup } from './utils'

const defaultQuality = 70

export default function Page() {
  const [files, setFiles] = React.useState<File[]>([])
  const [filesUrl, setFilesUrl] = React.useState<string[]>([])
  const [compressedFile, setCompressedFile] = React.useState<Blob>()
  const [compressedFileUrl, setCompressedFileUrl] = React.useState<string>()

  const compressedFileCache = React.useRef(new WeakMap<File, Blob | undefined>())

  const [activeTab, setActiveTab] = React.useState<'compressed' | 'original' | (string & {})>('compressed')
  const [activeFileIndex, setActiveFileIndex] = React.useState(0)

  const [ext, setExt] = useLocalStorage<string | undefined>('image-compression:ext', undefined)
  const [quality, setQuality] = useLocalStorage('image-compression:quality', [defaultQuality])

  const currentQuality = quality ? quality[0] : defaultQuality

  // 清除缓存
  const handleResetCompressedFileCache = React.useEffectEvent(() => {
    compressedFileCache.current = new WeakMap()
  })
  React.useEffect(() => {
    handleResetCompressedFileCache()
  }, [ext, quality])

  // 当前图片
  const activeFile = React.useMemo(() => {
    if (!files.length) return null
    return files[activeFileIndex]
  }, [activeFileIndex, files])

  // 压缩图片格式
  const selectedItem = React.useMemo(() => {
    if (!ext) return
    return imageCompressionGroup.find(item => item.ext == ext)
  }, [ext])

  // 原图链接
  React.useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file))
    setFilesUrl(urls)

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [files])

  // 压缩图片链接
  React.useEffect(() => {
    if (!compressedFile) return
    const url = URL.createObjectURL(compressedFile)
    setCompressedFileUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [compressedFile])

  // 压缩图片的方法
  const handleCompressImage = React.useEffectEvent(async (file: File | null) => {
    if (!file) return
    if (!selectedItem) return

    return compressImageByCanvas({
      file,
      mimeType: selectedItem.mimeType,
      quality: currentQuality / 100
    })
  })

  // 压缩当前图片
  useDebounce(
    async () => {
      if (!activeFile) return null
      try {
        if (compressedFileCache.current.has(activeFile)) {
          setCompressedFile(compressedFileCache.current.get(activeFile))
        } else {
          const blob = await handleCompressImage(activeFile)
          setCompressedFile(blob)
          compressedFileCache.current.set(activeFile, blob)
        }
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    200,
    [activeFile, ext, currentQuality]
  )

  // 压缩图片并保存
  const handleSave = React.useEffectEvent(async () => {
    if (!selectedItem) return

    const id = '019c8598-4d0b-76be-8b70-b6ad9aecc69b'

    try {
      const helper = new DirectoryHelper()
      await helper.openDirectory({ mode: 'readwrite', startIn: 'desktop' })

      toast.loading('正在保存图片', { id })

      for (const file of files) {
        const blob = await handleCompressImage(file)
        if (!blob) continue
        await helper.writeFile(`${file.name.split('.').slice(0, -1).join('.')}.${selectedItem.ext}`, blob)
      }

      toast.success('保存成功', { id })
    } catch (error) {
      toast.error((error as Error).message, { id })
    }
  })

  // 图片预览
  const handlePreview = React.useEffectEvent(() => {
    switch (activeTab) {
      case 'compressed':
        Fancybox.show(
          [
            { caption: '原图', src: filesUrl[activeFileIndex] },
            { caption: '压缩图', src: compressedFileUrl }
          ],
          {
            startIndex: 1,
            Carousel: {
              transition: 'crossfade',
              Thumbs: {
                showOnStart: false
              }
            }
          }
        )
        break
      case 'original':
        Fancybox.show(
          filesUrl.map(item => ({ src: item })),
          {
            startIndex: activeFileIndex
          }
        )
        break
    }
  })

  if (!activeFile) {
    return <FileSelect multiple accept="image/*" description="选择或拖入需要处理的图片" logo={ImageIcon} title="未选择图片" onChange={setFiles} />
  }

  return (
    <div className="flex min-h-[calc(var(--height-main)-2*var(--py))]">
      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-60 grid-cols-2">
          <TabsTrigger value="original">原图</TabsTrigger>
          <TabsTrigger value="compressed">压缩图</TabsTrigger>
        </TabsList>
        <div className="flex grow gap-5 not-md:flex-col">
          <Card asChild className="relative grow overflow-hidden rounded-md">
            <Button className="h-auto" variant="outline" onClick={handlePreview}>
              <React.Activity mode={activeTab == 'original' ? 'visible' : 'hidden'}>
                <Image fill alt="original-image" className="size-full object-contain" src={filesUrl[activeFileIndex]} />
              </React.Activity>
              <React.Activity mode={activeTab == 'compressed' ? 'visible' : 'hidden'}>
                {compressedFile && compressedFileUrl && (
                  <Image fill alt="compressed-image" className="size-full object-contain" src={compressedFileUrl} />
                )}
              </React.Activity>
              <ButtonGroup className="absolute top-2 right-2">
                <Badge variant="secondary">{formatFileSize(activeFile.size)}</Badge>
                <ButtonGroupSeparator />
                <Badge>{compressedFile ? formatFileSize(compressedFile.size) : '?'}</Badge>
              </ButtonGroup>
            </Button>
          </Card>

          <FieldGroup className="w-full md:w-80 lg:w-96">
            <Field>
              <FieldLabel>目标格式</FieldLabel>
              <Select value={ext} onValueChange={setExt}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择一种导出格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {imageCompressionGroup.map(item => (
                      <SelectItem key={item.name} value={item.ext}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldTitle>图片质量</FieldTitle>
              {selectedItem ? (
                <>
                  <FieldDescription>质量范围为 (1~100)，当前质量 {currentQuality}</FieldDescription>
                  <Slider className="mt-1" max={100} min={1} step={1} value={quality} onValueChange={setQuality} />
                </>
              ) : (
                <Slider disabled className="mt-1" />
              )}
            </Field>
            <Field className="mt-3">
              <ButtonGroup>
                {files.length > 1 && (
                  <ButtonGroup>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCompressedFile(undefined)
                        setActiveFileIndex(i => (i + files.length - 1) % files.length)
                      }}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button className="pointer-events-none" tabIndex={-1} variant="outline">
                      {activeFileIndex + 1} / {files.length}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCompressedFile(undefined)
                        setActiveFileIndex(i => (i + 1) % files.length)
                      }}
                    >
                      <ChevronRight />
                    </Button>
                  </ButtonGroup>
                )}
                <ButtonGroup className="w-full">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setFiles([])
                      setCompressedFile(undefined)
                      setActiveFileIndex(0)
                      handleResetCompressedFileCache()
                    }}
                  >
                    重新选择图片
                  </Button>
                </ButtonGroup>
              </ButtonGroup>
              <Button disabled={!selectedItem} onClick={handleSave}>
                选择文件夹后保存
              </Button>
              <FieldDescription className="text-center text-xs">注意：文件覆盖不会有提示，请谨慎操作</FieldDescription>
            </Field>
          </FieldGroup>
        </div>
      </Tabs>
    </div>
  )
}
