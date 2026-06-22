import z from "zod";

export const checkoutSchema = z
  .object({
    order_type: z.enum(["delivery", "pickup"]),
    customer_address_id: z
      .number()
      .min(1, "Select a delivery address")
      .optional()
      .nullable(),
    payment_method: z.enum(["cod", "online"]),
  })
  .refine(
    (data) => {
      if (data.order_type === "delivery") {
        return (
          data.customer_address_id !== undefined &&
          data.customer_address_id !== null
        );
      }
      return true;
    },
    {
      message: "Select a delivery address",
      path: ["customer_address_id"],
    },
  );

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
