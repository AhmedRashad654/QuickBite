import { useRestaurant, useUpdateRestaurant } from "../hooks/restaurant-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { restaurantSchema, type RestaurantFormValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { COUNTRY } from "@/types";
import { ImageUpload } from "@/components/shared/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/shared/Loader";

const RestaurantSettingsPage = () => {
  const { data: restaurantData, isLoading } = useRestaurant();
  const updateRestaurant = useUpdateRestaurant();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { handleSubmit, reset, control, setValue } =
    useForm<RestaurantFormValues>({
      resolver: zodResolver(restaurantSchema) as Resolver<RestaurantFormValues>,
      defaultValues: {
        name: restaurantData?.name,
        logo_url: restaurantData?.logo_url,
        primary_country: restaurantData?.primary_country,
      },
    });

  useEffect(() => {
    if (restaurantData) {
      reset({
        name: restaurantData.name,
        logo_url: restaurantData.logo_url,
        primary_country: restaurantData?.primary_country,
      });
    }
  }, [restaurantData, reset, isLoading]);

  const imageUrlValue = useWatch({
    control: control,
    name: "logo_url",
  });

  const onSubmit = (values: RestaurantFormValues) => {
    updateRestaurant.mutate(values);
  };
  if (isLoading) return <Loader viewType="form" />;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-sm">Restaurant Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectValue />
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

            <div className="space-y-2">
              <Label>Logo URL</Label>
              <ImageUpload
                value={imageUrlValue ?? null}
                onChange={(url) => setValue("logo_url", url)}
                setIsUploadingImage={setIsUploadingImage}
              />
            </div>

            <Button
              type="submit"
              disabled={updateRestaurant.isPending || isUploadingImage}
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantSettingsPage;
