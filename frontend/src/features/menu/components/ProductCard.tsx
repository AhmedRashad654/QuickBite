import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { MenuProduct } from "../types";
import { formatPrice } from "@/lib/format-price";

type ProductCardProps = {
  product: MenuProduct;
  currency: string;
};



const ProductCard = ({ product, currency }: ProductCardProps) => {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);

  const cartItem = items.find((i) => i.product_id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4 relative">
      <div className="absolute right-2 top-1 text-xs ">
        {product?.stock > 0 ? (
          <span className="text-blue-400">{product?.stock} in stock</span>
        ) : (
          <span className="text-red-400">stock empty</span>
        )}
      </div>
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-24">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl font-semibold text-muted-foreground/30">
            {product.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{product.name}</h3>
          {product.description ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-semibold">
            {formatPrice(product.price, currency)}
          </span>

          {!product.is_available || product.stock === 0 ? (
            <span className="text-xs text-muted-foreground">Unavailable</span>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => decrementQuantity(product.id)}
              >
                <Minus />
              </Button>
              <span className="flex h-8 w-8 items-center justify-center text-sm font-medium tabular-nums">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => incrementQuantity(product.id, product)}
              >
                <Plus />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() =>
                addItem(
                  {
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                  },
                  product,
                )
              }
            >
              <ShoppingCart />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
