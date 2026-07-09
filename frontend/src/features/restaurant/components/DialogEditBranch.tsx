import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateBranch } from "../hooks/restaurant-hooks";
import { editBranchSchema, type EditBranchFormValues } from "../schemas";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { Branch } from "../types";

type DialogEditBranchProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  branch: Branch;
};

const DialogEditBranch = ({ open, setOpen, branch }: DialogEditBranchProps) => {
  const updateBranch = useUpdateBranch();

  const form = useForm<EditBranchFormValues>({
    resolver: zodResolver(editBranchSchema) as Resolver<EditBranchFormValues>,
    defaultValues: {
      label: branch.label,
      delivery_fee: branch.delivery_fee / 100,
      opens_at: branch.opens_at,
      closes_at: branch.closes_at,
      accept_orders: branch.accept_orders,
    },
  });

  const onSubmit = (values: EditBranchFormValues) => {
    const payload = {
      ...values,
      delivery_fee: Math.round(values.delivery_fee * 100),
    };

    updateBranch.mutate(
      { branchId: branch.id, data: payload },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="label"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="label">Label</FieldLabel>
                <Input
                  {...field}
                  id="label"
                  autoComplete="label"
                  placeholder="Branch label"
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
            name="opens_at"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="opens">Opens at</FieldLabel>
                <Input
                  {...field}
                  type="time"
                  id="opens"
                  autoComplete="opens"
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
            name="closes_at"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="closes">Closes at</FieldLabel>
                <Input
                  {...field}
                  type="time"
                  id="closes"
                  autoComplete="closes"
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
            name="delivery_fee"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="delivery_fee">Delivery Fee</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  step="0.1"
                  min="0"
                  id="delivery_fee"
                  autoComplete="delivery_fee"
                  placeholder="Delivery fee"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={updateBranch.isPending}
          >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditBranch;
