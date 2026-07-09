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
import { restaurantSchema, type RestaurantFormValues } from "../schemas";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { useCreateRestaurant } from "../hooks/restaurant-hooks";
import type { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { COUNTRY } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const DialogCreateRestaurant = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const createRestaurant = useCreateRestaurant();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { control, reset, handleSubmit, setValue } =
    useForm<RestaurantFormValues>({
      resolver: zodResolver(restaurantSchema) as Resolver<RestaurantFormValues>,
      defaultValues: {
        name: "",
        logo_url: null,
        primary_country: undefined,
      },
    });

  const imageUrlValue = useWatch({
    control: control,
    name: "logo_url",
  });

  const onSubmit = (values: RestaurantFormValues) => {
    createRestaurant.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Restaurant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUpload
              value={imageUrlValue ?? null}
              onChange={(url) => setValue("logo_url", url)}
              setIsUploadingImage={setIsUploadingImage}
            />
          </div>

          <Controller
            control={control}
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
            control={control}
            name="primary_country"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="primary-counrty">
                  Primary Country
                </FieldLabel>
                <Select
                  name={field.name}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    id="primary-counrty"
                    className="w-full"
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select Country"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={COUNTRY.EG}>EG</SelectItem>
                    <SelectItem value={COUNTRY.SA}>SA</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={createRestaurant.isPending || isUploadingImage}
          >
            {createRestaurant.isPending ? "Creating..." : "Create Restaurant"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateRestaurant;
