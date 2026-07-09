import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateBranchProduct } from "../hooks/restaurant-hooks";
import type { BranchProductItem } from "../types";
import { branchProductSchema, type BranchProductFormValues } from "../schemas";

const DialogEditBranchProduct = ({
  open,
  setOpen,
  product,
  branchId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: BranchProductItem;
  branchId: number;
}) => {
  const updateBranchProduct = useUpdateBranchProduct();

  const form = useForm<BranchProductFormValues>({
    resolver: zodResolver(
      branchProductSchema,
    ) as Resolver<BranchProductFormValues>,
    defaultValues: {
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      is_available: product.is_available ?? true,
    },
  });

  const onSubmit = (values: BranchProductFormValues) => {
    const payload = {
      ...values,
      price: Math.round(values.price * 100),
    };
    updateBranchProduct.mutate(
      {
        productId: product.id,
        branchId,
        data: payload,
      },
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
          <DialogTitle>Edit Branch Product - {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  {...field}
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
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
            name="stock"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                <Input
                  {...field}
                  id="stock"
                  type="number"
                  step="1"
                  placeholder="0"
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
            name="is_available"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="is_available"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="is_available">Available</Label>
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={updateBranchProduct.isPending}
          >
            {updateBranchProduct.isPending ? "Updating..." : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditBranchProduct;
