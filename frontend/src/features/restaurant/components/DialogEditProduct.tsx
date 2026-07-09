import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { productSchema, type ProductFormValues } from "../schemas";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import {
  useCategories,
  useUpdateRestaurantProduct,
} from "../hooks/restaurant-hooks";
import type { RestaurantProduct } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const extractS3Key = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname.slice(1);
  } catch {
    return undefined;
  }
};

const DialogEditProduct = ({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: RestaurantProduct;
}) => {
  const updateProduct = useUpdateRestaurantProduct();
  const { data: categoriesData } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const [catOpen, setCatOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: product.name,
      description: product.description || "",
      image_url: product.image_url || "",
      category_name: product.category_name || "",
    },
  });

  const categoryValue = useWatch({
    control: form.control,
    name: "category_name",
  });

  const imageUrlValue = useWatch({
    control: form.control,
    name: "image_url",
  });

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes((categoryValue ?? "").toLowerCase()),
  );

  const isNewCategory =
    categoryValue?.trim() &&
    !categories?.some(
      (c) => c.name.toLowerCase() === categoryValue.toLowerCase(),
    );

  const onSubmit = (values: ProductFormValues) => {
    const newDate = isImageEditing
      ? values
      : {
          name: values.name,
          description: values.description,
          category_name: values.category_name,
        };
    updateProduct.mutate(
      { productId: product.id, data: newDate },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  autoComplete="name"
                  placeholder="Name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  {...field}
                  id="description"
                  autoComplete="description"
                  placeholder="Description"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={imageUrlValue ?? null}
              onChange={(url) => form.setValue("image_url", url)}
              oldKey={
                product.image_url ? extractS3Key(product.image_url) : undefined
              }
              setIsUploadingImage={setIsUploadingImage}
              setIsImageEditing={setIsImageEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Popover open={catOpen} onOpenChange={setCatOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={catOpen}
                  className="w-full justify-between"
                >
                  {categoryValue || "Select category"}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search category..."
                    value={categoryValue}
                    onValueChange={(val) => form.setValue("category_name", val)}
                  />
                  <CommandList>
                    {isNewCategory && (
                      <CommandGroup heading="New Category">
                        <CommandItem
                          value={categoryValue}
                          onSelect={() => {
                            form.setValue("category_name", categoryValue);
                            setCatOpen(false);
                          }}
                          className="text-primary font-medium cursor-pointer"
                        >
                          Create &quot;{categoryValue}&quot;
                        </CommandItem>
                      </CommandGroup>
                    )}
                    <CommandGroup>
                      {filteredCategories?.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.name}
                          onSelect={() => {
                            form.setValue("category_name", cat.name);
                            setCatOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              categoryValue === cat.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {cat.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={updateProduct.isPending || isUploadingImage}
          >
            {updateProduct.isPending ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditProduct;
