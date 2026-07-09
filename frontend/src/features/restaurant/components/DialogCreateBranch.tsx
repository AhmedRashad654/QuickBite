import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AddressInput } from "@/components/ui/address-input";
import { useCreateBranch } from "../hooks/restaurant-hooks";
import { branchSchema, type BranchFormValues } from "../schemas";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { COUNTRY, CURRENCY, type Country } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import CurrentLocationInput from "@/components/ui/current-location-input";

const DialogCreateBranch = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const createBranch = useCreateBranch();
  const [typeLocation, setTypeLoaction] = useState<
    "currentLocation" | "specificLocation"
  >("specificLocation");
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema) as Resolver<BranchFormValues>,
    defaultValues: {
      label: "",
      address_text: "",
      lat: null,
      lng: null,
      delivery_fee: 0,
      country_code: null,
      currency: null,
      opens_at: "09:00",
      closes_at: "22:00",
    },
  });

  const onSubmit = (values: BranchFormValues) => {
    const payload = {
      ...values,
      delivery_fee: Math.round(values.delivery_fee * 100),
    };

    createBranch.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Add Branch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
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

            <Field className="w-full col-span-2">
              <FieldLabel>Type Location</FieldLabel>
              <Select
                value={typeLocation}
                onValueChange={(
                  value: "currentLocation" | "specificLocation",
                ) => {
                  setTypeLoaction(value);
                  form.resetField("address_text");
                  form.resetField("lat");
                  form.resetField("lng");
                  form.resetField("country_code");
                  form.resetField("currency");
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
              <Controller
                control={form.control}
                name="address_text"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <AddressInput
                      value={field.value}
                      onSelect={(result) => {
                        form.setValue("address_text", result.displayName, {
                          shouldValidate: true,
                        });
                        form.setValue("lat", result.lat, {
                          shouldValidate: true,
                        });
                        form.setValue("lng", result.lng, {
                          shouldValidate: true,
                        });
                        form.setValue(
                          "country_code",
                          (result.countryCode?.toLocaleUpperCase() as Country) ||
                            COUNTRY.EG,
                          {
                            shouldValidate: true,
                          },
                        );
                        form.setValue(
                          "currency",
                          result.countryCode?.toLocaleUpperCase() === COUNTRY.SA
                            ? CURRENCY.SAR
                            : CURRENCY.EGP,
                          {
                            shouldValidate: true,
                          },
                        );
                      }}
                      placeholder="Search for an address..."
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            ) : (
              <Field className="col-span-2">
                <FieldLabel>Address</FieldLabel>
                <CurrentLocationInput
                  onSelect={(result) => {
                    form.setValue("address_text", result.displayName, {
                      shouldValidate: true,
                    });
                    form.setValue("lat", result.lat, {
                      shouldValidate: true,
                    });
                    form.setValue("lng", result.lng, {
                      shouldValidate: true,
                    });
                    form.setValue(
                      "country_code",
                      (result.countryCode?.toLocaleUpperCase() as Country) ||
                        COUNTRY.EG,
                      {
                        shouldValidate: true,
                      },
                    );
                    form.setValue(
                      "currency",
                      result.countryCode?.toLocaleUpperCase() === COUNTRY.SA
                        ? CURRENCY.SAR
                        : CURRENCY.EGP,
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />
                {form.formState.errors.address_text ? (
                  <FieldError errors={[form.formState.errors.address_text]} />
                ) : null}
              </Field>
            )}

            <Controller
              control={form.control}
              name="lat"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="latitude"
                    autoComplete="latitude"
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
                  <FieldLabel htmlFor="longitude">longitude</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="longitude"
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

            <Controller
              control={form.control}
              name="country_code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="country_code">
                    Primary Country
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="country_code"
                    placeholder="Country"
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
              name="currency"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="currency">Currency</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="currency"
                    placeholder="Currency"
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
            disabled={createBranch.isPending}
          >
            Create Branch
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateBranch;
