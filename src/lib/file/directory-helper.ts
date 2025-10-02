import { toast } from 'sonner'

export class DirectoryHelper {
  #dirHandle: FileSystemDirectoryHandle | null = null

  /**
   * 新建子文件夹
   */
  async createDirectory(dirName: string) {
    if (!this.#dirHandle) throw new Error('请先调用 openDirectory()')
    return this.#dirHandle.getDirectoryHandle(dirName, { create: true })
  }

  /**
   * 删除文件
   */
  async deleteFile(fileName: string) {
    if (!this.#dirHandle) throw new Error('请先调用 openDirectory()')
    await this.#dirHandle.removeEntry(fileName)
  }

  /**
   * 获取目录中的文件列表
   */
  async listFiles() {
    if (!this.#dirHandle) throw new Error('请先调用 openDirectory()')
    const files = []
    for await (const [name, handle] of this.#dirHandle.entries()) {
      files.push({ kind: handle.kind, name })
    }
    return files
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
      throw new Error('当前浏览器不支持选择目录')
    }
    return this.#dirHandle
  }

  /**
   * 读取文件内容（文本）
   */
  async readFile(fileName: string) {
    if (!this.#dirHandle) throw new Error('请先调用 openDirectory()')
    const fileHandle = await this.#dirHandle.getFileHandle(fileName)
    const file = await fileHandle.getFile()
    return file.text()
  }

  /**
   * 写入文件（会覆盖）
   */
  async writeFile(fileName: string, content: FileSystemWriteChunkType) {
    if (!this.#dirHandle) throw new Error('请先调用 openDirectory()')
    const fileHandle = await this.#dirHandle.getFileHandle(fileName, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
  }
}
