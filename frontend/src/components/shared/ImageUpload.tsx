import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useUploadImage } from "@/hooks/useUploadImage";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
  oldKey?: string;
  setIsUploadingImage: Dispatch<SetStateAction<boolean>>;
  setIsImageEditing?: Dispatch<SetStateAction<boolean>>;
}

export function ImageUpload({
  value,
  onChange,
  folder = "products",
  className,
  oldKey,
  setIsUploadingImage,
  setIsImageEditing,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  useEffect(() => {
    setPreview(value);
  }, [value]);
  const uploadImage = useUploadImage(folder);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setIsImageEditing) {
      setIsImageEditing(true);
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setIsUploadingImage(true);
      const url = await uploadImage.mutateAsync({ file, oldKey });
      onChange(url);
      const cacheBusterUrl = `${url}?t=${new Date().getTime()}`;
      setPreview(cacheBusterUrl);
    } catch {
      setPreview(value);
    } finally {
      setIsUploadingImage(false);
    }

    URL.revokeObjectURL(objectUrl);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (setIsImageEditing) {
      setIsImageEditing(true);
    }
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadImage.isPending}
          className={cn(
            "w-full h-40 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors cursor-pointer",
            uploadImage.isPending && "opacity-50 cursor-not-allowed",
          )}
        >
          {uploadImage.isPending ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
            </>
          )}
        </button>
      )}

      {uploadImage.isError && (
        <p className="text-sm text-destructive">
          {uploadImage.error?.message || "Failed to upload image"}
        </p>
      )}
    </div>
  );
}
