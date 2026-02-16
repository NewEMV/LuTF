'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Code,
    Undo,
    Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = 'Escreva seu conteúdo aqui...',
    className,
    disabled = false,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4',
                    disabled && 'opacity-50 cursor-not-allowed'
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editable: !disabled,
    });

    if (!editor) {
        return null;
    }

    const MenuButton = ({
        onClick,
        active,
        disabled,
        icon: Icon,
        label,
    }: {
        onClick: () => void;
        active?: boolean;
        disabled?: boolean;
        icon: any;
        label: string;
    }) => (
        <Button
            type="button"
            variant={active ? 'default' : 'ghost'}
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn('h-8 w-8 p-0', active && 'bg-primary text-primary-foreground')}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <div className={cn('border border-border rounded-lg overflow-hidden bg-card', className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50 flex-wrap">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    icon={Bold}
                    label="Negrito"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    icon={Italic}
                    label="Itálico"
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    label="Título 1"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    label="Título 2"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    icon={Heading3}
                    label="Título 3"
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    icon={List}
                    label="Lista"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    label="Lista Numerada"
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    icon={Quote}
                    label="Citação"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                    icon={Code}
                    label="Bloco de Código"
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    icon={Undo}
                    label="Desfazer"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    icon={Redo}
                    label="Refazer"
                />
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="bg-background" />

            {/* Character count (opcional) */}
            <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
                {editor.storage.characterCount?.characters() || 0} caracteres
            </div>
        </div>
    );
}
