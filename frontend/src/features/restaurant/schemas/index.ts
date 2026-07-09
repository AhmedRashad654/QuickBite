import { COUNTRY, CURRENCY } from "@/types";
import { z } from "zod";

export const restaurantSchema = z.object({
  name: z.string().min(1),
  logo_url:  z.string().nullable().optional(),
  primary_country: z.nativeEnum(COUNTRY),
});

export const branchSchema = z.object({
  label: z.string().min(1),
  address_text: z.string().min(3,{
    message:"must select location for result search or use current location"
  }),
  lat: z.coerce.number().min(-90).max(90).nullable(),
  lng: z.coerce.number().min(-180).max(180).nullable(),
  country_code: z.nativeEnum(COUNTRY).nullable(),
  currency: z.nativeEnum(CURRENCY).nullable(),
  opens_at: z.string().min(1),
  closes_at: z.string().min(1),
  delivery_fee: z.coerce.number().min(0).step(0.1),
});

export const editBranchSchema = z.object({
  label: z.string().min(1),
  opens_at: z.string().min(1),
  closes_at: z.string().min(1),
  delivery_fee: z.coerce.number().min(0).step(0.1),
  accept_orders: z.boolean(),
});

export const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.string().min(1),
  branchIds: z.array(z.number()).optional(),
});

export const editMemberSchema = z.object({
  role: z.string().min(1),
  status: z.string().min(1),
  branchIds: z.array(z.number()),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image_url: z.string().nullable().optional(),
  category_name: z.string().optional(),
});

export const branchProductSchema = z.object({
  price: z.coerce.number().min(0, "Price must be >= 0"),
  stock: z.coerce.number().int().min(0, "Stock must be >= 0"),
  is_available: z.boolean(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
export type BranchFormValues = z.infer<typeof branchSchema>;
export type EditBranchFormValues = z.infer<typeof editBranchSchema>;
export type InviteFormValues = z.infer<typeof inviteSchema>;
export type EditMemberFormValues = z.infer<typeof editMemberSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type BranchProductFormValues = z.infer<typeof branchProductSchema>;
