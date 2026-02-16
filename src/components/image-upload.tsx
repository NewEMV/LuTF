'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import imageCompression from 'browser-image-compression';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value?: string; // URL da imagem atual
    onChange: (url: string, alt: string) => void;
    onRemove?: () => void;
    storagePath: string; // ex: 'posts', 'eventos', 'videos'
    altText?: string;
    onAltTextChange?: (alt: string) => void;
    maxSizeMB?: number;
    className?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    storagePath,
    altText = '',
    onAltTextChange,
    maxSizeMB = 5,
    className,
    disabled = false,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [localAltText, setLocalAltText] = useState(altText);
    const [error, setError] = useState<string | null>(null);

    const compressAndUpload = useCallback(
        async (file: File) => {
            try {
                setUploading(true);
                setProgress(10);
                setError(null);

                // Comprimir imagem
                const options = {
                    maxSizeMB,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                setProgress(30);
                const compressedFile = await imageCompression(file, options);

                setProgress(50);

                // Upload para Firebase Storage
                const fileName = `${Date.now()}-${file.name}`;
                const storageRef = ref(storage, `${storagePath}/${fileName}`);

                await uploadBytes(storageRef, compressedFile);
                setProgress(80);

                const downloadURL = await getDownloadURL(storageRef);
                setProgress(100);

                setPreview(downloadURL);
                onChange(downloadURL, localAltText);
            } catch (err) {
                console.error('Erro ao fazer upload:', err);
                setError('Erro ao fazer upload da imagem. Tente novamente.');
            } finally {
                setUploading(false);
                setProgress(0);
            }
        },
        [maxSizeMB, storagePath, onChange, localAltText]
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                compressAndUpload(file);
            }
        },
        [compressAndUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
        },
        maxFiles: 1,
        disabled: disabled || uploading,
    });

    const handleRemove = async () => {
        if (value && onRemove) {
            try {
                // Tentar deletar do storage (se for URL do Firebase)
                if (value.includes('firebasestorage.googleapis.com')) {
                    const imageRef = ref(storage, value);
                    await deleteObject(imageRef);
                }
            } catch (err) {
                console.error('Erro ao deletar imagem:', err);
            }

            setPreview(null);
            setLocalAltText('');
            onRemove();
        }
    };

    const handleAltTextChange = (newAlt: string) => {
        setLocalAltText(newAlt);
        if (onAltTextChange) {
            onAltTextChange(newAlt);
        }
        if (value) {
            onChange(value, newAlt);
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Preview ou Upload Area */}
            {preview ? (
                <div className="relative rounded-lg border border-border overflow-hidden bg-card">
                    <img
                        src={preview}
                        alt={localAltText || 'Preview'}
                        className="w-full h-64 object-cover"
                    />
                    {!disabled && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                        isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                            <>
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="text-sm text-muted-foreground">Fazendo upload...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                    {isDragActive
                                        ? 'Solte a imagem aqui'
                                        : 'Arraste uma imagem ou clique para selecionar'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, GIF até {maxSizeMB}MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {uploading && progress > 0 && (
                <Progress value={progress} className="h-2" />
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Alt Text Input */}
            {preview && (
                <div className="space-y-2">
                    <Label htmlFor="alt-text">
                        Texto Alternativo (Alt Text) *
                        <span className="text-xs text-muted-foreground ml-2">
                            Importante para SEO e acessibilidade
                        </span>
                    </Label>
                    <Input
                        id="alt-text"
                        value={localAltText}
                        onChange={(e) => handleAltTextChange(e.target.value)}
                        placeholder="Descreva a imagem para SEO e acessibilidade"
                        disabled={disabled}
                        required
                    />
                </div>
            )}
        </div>
    );
}
