import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save } from "lucide-react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressInput } from "@/components/ui/address-input";
import CurrentLocationInput from "@/components/ui/current-location-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addressFormSchema, type AddressFormValues } from "../schemas";
import {
  useCreateAddress,
  useUpdateAddress,
} from "../hooks/customer-address-hooks";
import { ADDRESS_TYPE, type CustomerAddress } from "../types";
import { COUNTRY, type Country } from "@/types";

type AddressFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  address?: CustomerAddress;
};

const DEFAULT_VALUES: AddressFormValues = {
  label: "",
  country: null,
  city: "",
  street: "",
  building: "",
  apartment_number: "",
  type: ADDRESS_TYPE.HOME,
  lat: null,
  lng: null,
  is_default: false,
};

export const AddressFormDialog = ({
  open,
  onOpenChange,
  mode,
  address,
}: AddressFormDialogProps) => {
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const isEdit = mode === "edit";

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema) as Resolver<AddressFormValues>,
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit && address
          ? {
              label: address.label ?? "",
              country: address.country ?? COUNTRY.EG,
              city: address.city ?? "",
              street: address.street ?? "",
              building: address.building ?? "",
              apartment_number: address.apartment_number ?? "",
              type: address.type ?? ADDRESS_TYPE.HOME,
              lat: address.lat ?? null,
              lng: address.lng ?? null,
              is_default: address.is_default ?? false,
            }
          : DEFAULT_VALUES,
      );
    }
  }, [open, isEdit, address, form]);

  const onSubmit = (values: AddressFormValues) => {
    if (!values.lat || !values.lng) {
      form.setError("lat", {
        message: "Please select a location using Current Location or search",
      });
      form.setError("lng", {
        message: "Please select a location using Current Location or search",
      });
      form.setError("country", {
        message: "Please select a location using Current Location or search",
      });
      return;
    }

    if (isEdit && address) {
      updateMutation.mutate(
        { ...values, addressId: address.id },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const [typeLocation, setTypeLoaction] = useState<
    "currentLocation" | "specificLocation"
  >("specificLocation");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit address" : "Add address"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="label"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="addr-label">Label</FieldLabel>
                  <Input
                    {...field}
                    id="addr-label"
                    placeholder="e.g. Home, Work"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Field className="col-span-2">
              <FieldLabel>Type Location</FieldLabel>
              <Select
                value={typeLocation}
                onValueChange={(
                  value: "currentLocation" | "specificLocation",
                ) => {
                  setTypeLoaction(value);
                  form.resetField("lat");
                  form.resetField("lng");
                  form.resetField("country");
                  form.resetField("city");
                  form.resetField("street");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"currentLocation"}>
                    Current Location
                  </SelectItem>
                  <SelectItem value={"specificLocation"}>
                    Specific Location
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {typeLocation === "specificLocation" ? (
              <Field className="col-span-2">
                <FieldLabel htmlFor="addr-search">Find address</FieldLabel>
                <AddressInput
                  value=""
                  onSelect={(result) => {
                    form.setValue("lat", result.lat, {
                      shouldValidate: true,
                    });
                    form.setValue("lng", result.lng, {
                      shouldValidate: true,
                    });
                    form.setValue(
                      "country",
                      (result.countryCode?.toLocaleUpperCase() as Country) ||
                        COUNTRY.EG,
                      {
                        shouldValidate: true,
                      },
                    );
                    if (result.city) {
                      form.setValue("city", result.city, {
                        shouldValidate: true,
                      });
                    }
                    if (result.street) {
                      form.setValue("street", result.street, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  placeholder="Search for your address..."
                />
              </Field>
            ) : (
              <Field className="col-span-2">
                <FieldLabel>Address</FieldLabel>
                <CurrentLocationInput
                  onSelect={(result) => {
                    form.setValue("lat", result.lat, {
                      shouldValidate: true,
                    });
                    form.setValue("lng", result.lng, {
                      shouldValidate: true,
                    });
                    form.setValue(
                      "country",
                      (result.countryCode?.toLocaleUpperCase() as Country) ||
                        COUNTRY.EG,
                      {
                        shouldValidate: true,
                      },
                    );
                    if (result.city) {
                      form.setValue("city", result.city, {
                        shouldValidate: true,
                      });
                    }
                    if (result.street) {
                      form.setValue("street", result.street, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </Field>
            )}

            <Controller
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor="addr-city">City</FieldLabel>
                  <Input
                    {...field}
                    placeholder="City"
                    id="addr-city"
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
              name="street"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="addr-street">Street</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Street"
                    id="addr-street"
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
              name="country"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor="addr-country">Country</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="addr-country"
                    aria-invalid={fieldState.invalid}
                    placeholder="Country"
                    readOnly
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="lat"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="addr-lat">Latitude</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="addr-lat"
                      placeholder="Latitude"
                      aria-invalid={fieldState.invalid}
                      readOnly
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="lng"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="addr-lng">Longitude</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="addr-lng"
                      placeholder="Longitude"
                      aria-invalid={fieldState.invalid}
                      readOnly
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="building"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="addr-building">Building</FieldLabel>
                    <Input
                      {...field}
                      id="addr-building"
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
                name="apartment_number"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="addr-apartment">Apartment</FieldLabel>
                    <Input
                      {...field}
                      id="addr-apartment"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="addr-type">Type</FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        id="addr-type"
                        className="w-full"
                        onBlur={field.onBlur}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ADDRESS_TYPE.HOME}>Home</SelectItem>
                        <SelectItem value={ADDRESS_TYPE.OFFICE}>
                          Office
                        </SelectItem>
                        <SelectItem value={ADDRESS_TYPE.PUBLIC_PLACE}>
                          Public Place
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="is_default"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="addr-default">
                      Set as default
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={(val) => field.onChange(val === "true")}
                      value={String(field.value ?? false)}
                    >
                      <SelectTrigger
                        id="addr-default"
                        className="w-full"
                        onBlur={field.onBlur}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <Button className="mt-4 w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : isEdit ? (
                <Save />
              ) : (
                <Plus />
              )}
              {isEdit ? "Save changes" : "Add address"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};
