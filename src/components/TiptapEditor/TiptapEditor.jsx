import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Button, Space, Divider, Tooltip, Dropdown, message } from 'antd';
import { uploadAPI } from 'api/upload/uploadAPI';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  UndoOutlined,
  RedoOutlined,
  HighlightOutlined,
  BgColorsOutlined,
  CodeOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import './TiptapEditor.scss';

const TiptapEditor = ({ content, onChange, placeholder = 'Nhập nội dung...', readOnly = false, minHeight = 300, maxHeight = 600 }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptap-image'
        }
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: null,
              parseHTML: (element) => element.getAttribute('style'),
              renderHTML: (attributes) => {
                if (!attributes.style) {
                  return {};
                }
                return { style: attributes.style };
              }
            }
          };
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight.configure({
        multicolor: true
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table'
        }
      }),
      TableRow,
      TableCell,
      TableHeader
    ],
    content: content || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        'data-placeholder': placeholder
      }
    }
  });

  if (!editor) {
    return null;
  }

  // Toolbar actions
  const addLink = () => {
    const url = window.prompt('Nhập URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        message.error('Chỉ được upload file ảnh');
        return;
      }

      try {
        message.loading({ content: 'Đang tải ảnh lên...', key: 'uploadImage' });
        const response = await uploadAPI.uploadImage(file);

        if (response.success && response.data) {
          editor.chain().focus().setImage({ src: response.data }).run();
          message.success({ content: 'Upload ảnh thành công', key: 'uploadImage' });
        } else {
          message.error({ content: 'Upload ảnh thất bại', key: 'uploadImage' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        message.error({ content: 'Đã xảy ra lỗi khi upload ảnh', key: 'uploadImage' });
      }
    };
    input.click();
  };

  const addImageFromUrl = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const resizeImage = () => {
    const { state } = editor;
    const { selection } = state;
    const node = selection.node;

    if (!node || node.type.name !== 'image') {
      message.warning('Vui lòng chọn một hình ảnh trước');
      return;
    }

    const currentWidth = node.attrs.width || 300;

    // Ask for width
    const widthStr = window.prompt(`Nhập chiều rộng ảnh (px)\n(100-800):`, currentWidth.toString());
    if (!widthStr) return;

    const width = parseInt(widthStr);
    if (isNaN(width) || width < 100 || width > 800) {
      message.error('Chiều rộng phải từ 100-800px');
      return;
    }

    // Ask for alignment
    const alignmentOptions = ['left', 'center', 'right'];
    const alignChoice = window.prompt(
      'Chọn căn chỉnh:\n1. Căn trái (left)\n2. Căn giữa (center)\n3. Căn phải (right)\n\nNhập 1, 2 hoặc 3:',
      '2'
    );

    if (!alignChoice) return;

    const alignIndex = parseInt(alignChoice) - 1;
    if (alignIndex < 0 || alignIndex > 2) {
      message.error('Lựa chọn không hợp lệ');
      return;
    }

    const alignment = alignmentOptions[alignIndex];

    // Calculate margins for alignment
    const marginLeft = alignment === 'left' ? '0' : 'auto';
    const marginRight = alignment === 'right' ? '0' : 'auto';

    // Update image attributes
    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        width: width,
        style: `width: ${width}px; display: block; margin-left: ${marginLeft}; margin-right: ${marginRight};`
      })
      .run();

    message.success('Đã điều chỉnh hình ảnh');
  };

  const imageMenuItems = [
    {
      key: 'upload',
      label: 'Tải ảnh từ máy',
      onClick: addImage
    },
    {
      key: 'url',
      label: 'Chèn ảnh từ URL',
      onClick: addImageFromUrl
    },
    {
      type: 'divider'
    },
    {
      key: 'resize',
      label: 'Điều chỉnh hình ảnh',
      onClick: resizeImage
    }
  ];

  const tableMenuItems = [
    {
      key: 'insert',
      label: 'Chèn bảng 3x3',
      onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
    {
      type: 'divider'
    },
    {
      key: 'addColumnBefore',
      label: 'Thêm cột trước',
      onClick: () => editor.chain().focus().addColumnBefore().run(),
      disabled: !editor.can().addColumnBefore()
    },
    {
      key: 'addColumnAfter',
      label: 'Thêm cột sau',
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      disabled: !editor.can().addColumnAfter()
    },
    {
      key: 'deleteColumn',
      label: 'Xóa cột',
      onClick: () => editor.chain().focus().deleteColumn().run(),
      disabled: !editor.can().deleteColumn()
    },
    {
      type: 'divider'
    },
    {
      key: 'addRowBefore',
      label: 'Thêm hàng trước',
      onClick: () => editor.chain().focus().addRowBefore().run(),
      disabled: !editor.can().addRowBefore()
    },
    {
      key: 'addRowAfter',
      label: 'Thêm hàng sau',
      onClick: () => editor.chain().focus().addRowAfter().run(),
      disabled: !editor.can().addRowAfter()
    },
    {
      key: 'deleteRow',
      label: 'Xóa hàng',
      onClick: () => editor.chain().focus().deleteRow().run(),
      disabled: !editor.can().deleteRow()
    },
    {
      type: 'divider'
    },
    {
      key: 'mergeCells',
      label: 'Gộp ô',
      onClick: () => editor.chain().focus().mergeCells().run(),
      disabled: !editor.can().mergeCells()
    },
    {
      key: 'splitCell',
      label: 'Tách ô',
      onClick: () => editor.chain().focus().splitCell().run(),
      disabled: !editor.can().splitCell()
    },
    {
      type: 'divider'
    },
    {
      key: 'toggleHeaderRow',
      label: 'Toggle Header Row',
      onClick: () => editor.chain().focus().toggleHeaderRow().run(),
      disabled: !editor.can().toggleHeaderRow()
    },
    {
      key: 'toggleHeaderColumn',
      label: 'Toggle Header Column',
      onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
      disabled: !editor.can().toggleHeaderColumn()
    },
    {
      key: 'toggleHeaderCell',
      label: 'Toggle Header Cell',
      onClick: () => editor.chain().focus().toggleHeaderCell().run(),
      disabled: !editor.can().toggleHeaderCell()
    },
    {
      type: 'divider'
    },
    {
      key: 'deleteTable',
      label: 'Xóa bảng',
      danger: true,
      onClick: () => editor.chain().focus().deleteTable().run(),
      disabled: !editor.can().deleteTable()
    }
  ];

  const textColorItems = [
    {
      key: '#000000',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: '#000000', border: '1px solid #d9d9d9' }} /> Đen
        </div>
      ),
      onClick: () => editor.chain().focus().setColor('#000000').run()
    },
    {
      key: '#ff0000',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: '#ff0000' }} /> Đỏ
        </div>
      ),
      onClick: () => editor.chain().focus().setColor('#ff0000').run()
    },
    {
      key: '#00ff00',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: '#00ff00' }} /> Xanh lá
        </div>
      ),
      onClick: () => editor.chain().focus().setColor('#00ff00').run()
    },
    {
      key: '#0000ff',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: '#0000ff' }} /> Xanh dương
        </div>
      ),
      onClick: () => editor.chain().focus().setColor('#0000ff').run()
    },
    {
      key: '#ffff00',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 16, height: 16, backgroundColor: '#ffff00' }} /> Vàng
        </div>
      ),
      onClick: () => editor.chain().focus().setColor('#ffff00').run()
    }
  ];

  return (
    <div className="tiptap-editor" style={{ opacity: readOnly ? 0.7 : 1, pointerEvents: readOnly ? 'none' : 'auto' }}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="tiptap-toolbar">
          <Space split={<Divider type="vertical" />} wrap>
            {/* Text Formatting */}
            <Space.Compact>
              <Tooltip title="Bold (Ctrl+B)">
                <Button
                  size="small"
                  icon={<BoldOutlined />}
                  type={editor.isActive('bold') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                />
              </Tooltip>
              <Tooltip title="Italic (Ctrl+I)">
                <Button
                  size="small"
                  icon={<ItalicOutlined />}
                  type={editor.isActive('italic') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                />
              </Tooltip>
              <Tooltip title="Underline (Ctrl+U)">
                <Button
                  size="small"
                  icon={<UnderlineOutlined />}
                  type={editor.isActive('underline') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
              </Tooltip>
              <Tooltip title="Strike">
                <Button
                  size="small"
                  icon={<StrikethroughOutlined />}
                  type={editor.isActive('strike') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                />
              </Tooltip>
            </Space.Compact>

            {/* Headings */}
            <Space.Compact>
              {[1, 2, 3].map((level) => (
                <Tooltip key={level} title={`Heading ${level}`}>
                  <Button
                    size="small"
                    type={editor.isActive('heading', { level }) ? 'primary' : 'default'}
                    onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                  >
                    H{level}
                  </Button>
                </Tooltip>
              ))}
            </Space.Compact>

            {/* Lists */}
            <Space.Compact>
              <Tooltip title="Bullet List">
                <Button
                  size="small"
                  icon={<UnorderedListOutlined />}
                  type={editor.isActive('bulletList') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
              </Tooltip>
              <Tooltip title="Ordered List">
                <Button
                  size="small"
                  icon={<OrderedListOutlined />}
                  type={editor.isActive('orderedList') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
              </Tooltip>
            </Space.Compact>

            {/* Alignment */}
            <Space.Compact>
              <Tooltip title="Align Left">
                <Button
                  size="small"
                  icon={<AlignLeftOutlined />}
                  type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                />
              </Tooltip>
              <Tooltip title="Align Center">
                <Button
                  size="small"
                  icon={<AlignCenterOutlined />}
                  type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                />
              </Tooltip>
              <Tooltip title="Align Right">
                <Button
                  size="small"
                  icon={<AlignRightOutlined />}
                  type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                />
              </Tooltip>
            </Space.Compact>

            {/* Colors & Highlight */}
            <Space.Compact>
              <Dropdown menu={{ items: textColorItems }} trigger={['click']}>
                <Tooltip title="Text Color">
                  <Button size="small" icon={<BgColorsOutlined />} />
                </Tooltip>
              </Dropdown>
              <Tooltip title="Highlight">
                <Button
                  size="small"
                  icon={<HighlightOutlined />}
                  type={editor.isActive('highlight') ? 'primary' : 'default'}
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                />
              </Tooltip>
            </Space.Compact>

            {/* Insert */}
            <Space.Compact>
              <Tooltip title="Insert Link">
                <Button size="small" icon={<LinkOutlined />} onClick={addLink} />
              </Tooltip>
              <Dropdown menu={{ items: imageMenuItems }} trigger={['click']}>
                <Tooltip title="Insert Image">
                  <Button size="small" icon={<PictureOutlined />} />
                </Tooltip>
              </Dropdown>
              <Dropdown menu={{ items: tableMenuItems }} trigger={['click']}>
                <Tooltip title="Table Operations">
                  <Button size="small" icon={<TableOutlined />} />
                </Tooltip>
              </Dropdown>
            </Space.Compact>

            {/* Undo/Redo */}
            <Space.Compact>
              <Tooltip title="Undo (Ctrl+Z)">
                <Button
                  size="small"
                  icon={<UndoOutlined />}
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                />
              </Tooltip>
              <Tooltip title="Redo (Ctrl+Y)">
                <Button
                  size="small"
                  icon={<RedoOutlined />}
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                />
              </Tooltip>
            </Space.Compact>
          </Space>
        </div>
      )}

      {/* Editor Content */}
      <div style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

TiptapEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number
};

export default TiptapEditor;
