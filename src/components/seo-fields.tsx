'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOFieldsProps {
    metaTitle: string;
    metaDescription: string;
    slug?: string;
    onMetaTitleChange: (value: string) => void;
    onMetaDescriptionChange: (value: string) => void;
    onSlugChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

export function SEOFields({
    metaTitle,
    metaDescription,
    slug,
    onMetaTitleChange,
    onMetaDescriptionChange,
    onSlugChange,
    className,
    disabled = false,
}: SEOFieldsProps) {
    const titleLength = metaTitle.length;
    const descriptionLength = metaDescription.length;

    const getTitleColor = () => {
        if (titleLength === 0) return 'text-muted-foreground';
        if (titleLength > MAX_TITLE_LENGTH) return 'text-destructive';
        if (titleLength > MAX_TITLE_LENGTH * 0.9) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getDescriptionColor = () => {
        if (descriptionLength === 0) return 'text-muted-foreground';
        if (descriptionLength > MAX_DESCRIPTION_LENGTH) return 'text-destructive';
        if (descriptionLength > MAX_DESCRIPTION_LENGTH * 0.9) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className={cn('space-y-6 p-4 border border-border rounded-lg bg-card', className)}>
            <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Otimização SEO/AEO</h3>
            </div>
            <p className="text-sm text-muted-foreground">
                Configure como seu conteúdo aparecerá em buscas do Google, ChatGPT, Perplexity e outros.
            </p>

            {/* Meta Title */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="meta-title">
                        Meta Título *
                    </Label>
                    <span className={cn('text-xs font-medium', getTitleColor())}>
                        {titleLength}/{MAX_TITLE_LENGTH}
                    </span>
                </div>
                <Input
                    id="meta-title"
                    value={metaTitle}
                    onChange={(e) => onMetaTitleChange(e.target.value)}
                    placeholder="Título otimizado para buscas (50-60 caracteres)"
                    disabled={disabled}
                    required
                    maxLength={MAX_TITLE_LENGTH + 20}
                />
                {titleLength > MAX_TITLE_LENGTH && (
                    <p className="text-xs text-destructive">
                        Título muito longo. Pode ser cortado nos resultados de busca.
                    </p>
                )}
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="meta-description">
                        Meta Descrição *
                    </Label>
                    <span className={cn('text-xs font-medium', getDescriptionColor())}>
                        {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                </div>
                <Textarea
                    id="meta-description"
                    value={metaDescription}
                    onChange={(e) => onMetaDescriptionChange(e.target.value)}
                    placeholder="Descrição clara e atrativa que aparecerá nos resultados de busca (120-160 caracteres)"
                    disabled={disabled}
                    required
                    rows={3}
                    maxLength={MAX_DESCRIPTION_LENGTH + 40}
                />
                {descriptionLength > MAX_DESCRIPTION_LENGTH && (
                    <p className="text-xs text-destructive">
                        Descrição muito longa. Pode ser cortada nos resultados de busca.
                    </p>
                )}
            </div>

            {/* Slug (URL) - opcional */}
            {onSlugChange && slug !== undefined && (
                <div className="space-y-2">
                    <Label htmlFor="slug">
                        URL (Slug)
                        <span className="text-xs text-muted-foreground ml-2">
                            Gerado automaticamente, mas você pode editar
                        </span>
                    </Label>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            /blog/
                        </Badge>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder="url-amigavel-para-seo"
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}

            {/* Preview de como aparecerá no Google */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Preview no Google</Label>
                <div className="p-4 bg-muted rounded-lg border border-border">
                    <div className="space-y-1">
                        <p className="text-sm text-blue-600 hover:underline cursor-default">
                            {metaTitle || 'Título do seu conteúdo'}
                        </p>
                        <p className="text-xs text-green-700">
                            lucianaferraz.com {slug && `› blog › ${slug}`}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {metaDescription || 'Descrição do seu conteúdo que aparecerá nos resultados...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
