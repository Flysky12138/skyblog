编辑器

```tsx
import '@repo/rich-text-editor/style.css'
import { Tiptap, useEditor } from '@repo/rich-text-editor'
import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { ToolBar } from '@repo/rich-text-editor/toolbar'

export function App() {
  const editor = useEditor({
    content: {},
    contentType: 'json',
    editable: true,
    emitContentError: true,
    enableContentCheck: false,
    extensions: [ExtensionKit],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: 'textbox',
        spellcheck: 'false'
      }
    }
  })

  if (!editor) return null

  return (
    <Tiptap editor={editor}>
      <ToolBar />
      <Tiptap.Content className="p-5" />
    </Tiptap>
  )
}
```

导出 HTML

```tsx
import { renderJSONContentToHTMLString } from '@repo/rich-text-editor/render'

const json = editor.getJSON()
const html = await renderJSONContentToHTMLString(json, { extensions: editor.extensionManager.baseExtensions })

// 预览
function Preview() {
  return <article dangerouslySetInnerHTML={{ __html: html }} className="tiptap" />
}
```
