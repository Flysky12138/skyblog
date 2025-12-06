import { toast } from 'sonner'

export class DirectoryHelper {
  #dirHandle: FileSystemDirectoryHandle | null = null

  /**
   * 新建子文件夹
   */
  async createDirectory(dirPath: string) {
    return this.#getDirHandleByPath(dirPath, true)
  }
  /**
   * 删除文件
   */
  async deleteFile(filePath: string) {
    const { dirHandle, name } = await this.#resolveParent(filePath, false)
    await dirHandle.removeEntry(name)
  }

  /**
   * 判断文件是否存在
   */
  async fileExists(filePath: string) {
    try {
      const { dirHandle, name } = await this.#resolveParent(filePath, false)
      await dirHandle.getFileHandle(name)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 获取目录中的文件列表
   */
  async listFiles(dirPath?: string) {
    if (!this.#dirHandle) {
      throw new Error('请先调用 openDirectory()')
    }

    const results: { kind: string; name: string; path: string }[] = []

    const walk = async (dir: FileSystemDirectoryHandle, basePath = '') => {
      for await (const [name, handle] of dir.entries()) {
        const relPath = basePath ? `${basePath}/${name}` : name
        results.push({ kind: handle.kind, name, path: relPath })
        if (handle.kind == 'directory') {
          await walk(handle, relPath)
        }
      }
    }

    const startDir = dirPath ? await this.#getDirHandleByPath(dirPath, false) : this.#dirHandle
    await walk(startDir, dirPath ? dirPath.split('/').filter(Boolean).join('/') : '')

    return results
  }

  /**
   * 打开目录选择器
   */
  async openDirectory(options?: DirectoryPickerOptions) {
    const now = Date.now()
    try {
      this.#dirHandle = await window.showDirectoryPicker(options)
    } catch (error) {
      if (Date.now() - now < 200) {
        toast.warning('当前浏览器不支持选择目录功能', {
          duration: 6 * 1000,
          id: '0199b418-183d-71bd-849a-09f6a9cd8985',
          richColors: true
        })
      }
      throw new Error('已取消文件夹选择操作')
    }
    return this.#dirHandle
  }

  /**
   * 读取文件内容（文本）
   */
  async readFile(filePath: string) {
    const { dirHandle, name } = await this.#resolveParent(filePath, false)
    const fileHandle = await dirHandle.getFileHandle(name)
    const file = await fileHandle.getFile()
    return file.text()
  }

  /**
   * 写入文件（会覆盖）
   */
  async writeFile(filePath: string, content: FileSystemWriteChunkType) {
    const { dirHandle, name } = await this.#resolveParent(filePath, true)
    const fileHandle = await dirHandle.getFileHandle(name, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
  }

  /**
   * 根据路径获取目录 handle
   */
  async #getDirHandleByPath(dirPath: string, create = false) {
    if (!this.#dirHandle) {
      throw new Error('请先调用 openDirectory()')
    }

    const parts = dirPath.split('/').filter(Boolean)

    let handle = this.#dirHandle

    for (const part of parts) {
      handle = await handle.getDirectoryHandle(part, { create })
    }

    return handle
  }

  /**
   * 根据路径解析父目录 handle 和文件名
   */
  async #resolveParent(filePath: string, create = false) {
    if (!this.#dirHandle) {
      throw new Error('请先调用 openDirectory()')
    }

    const parts = filePath.split('/').filter(Boolean)
    const name = parts.pop()

    if (!name) {
      throw new Error('无效的文件路径')
    }

    const dirHandle = parts.length ? await this.#getDirHandleByPath(parts.join('/'), create) : this.#dirHandle

    return { dirHandle, name }
  }
}
