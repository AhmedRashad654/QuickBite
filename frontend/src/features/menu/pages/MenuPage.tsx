import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useBranchMenu } from "../hooks/useBranchMenu";
import BranchHeader from "../components/BranchHeader";
import CartSheet from "../components/CartSheet";
import CategorySection from "../components/CategorySection";
import Loading from "@/components/shared/Loading";
import { formatPrice } from "@/lib/format-price";

const MenuPage = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { data: branch, isLoading } = useBranchMenu(
    branchId ? Number(branchId) : undefined,
  );
  const [cartOpen, setCartOpen] = useState(false);
  const setBranchInfo = useCartStore((s) => s.setBranchInfo);
  const totalItems = useCartStore((s) => s.getTotalItem());
  const subTotal = useCartStore((s) => s.getSubTotal());

  useEffect(() => {
    if (branch) {
      setBranchInfo(
        branch.branch_id,
        branch.branch_name,
        branch.currency,
        branch.delivery_fee,
      );
    }
  }, [branch, setBranchInfo]);

  if (isLoading) {
    return <Loading text="Loading menu" />;
  }

  function findProductInMenu(productId: number) {
    if (!branch) return null;
    for (const category of branch.menu) {
      const product = category.products.find((p) => p.id === productId);
      if (product) {
        return product;
      }
    }

    return null;
  }

  if (!branch) {
    return (
      <div className="flex min-h-[80dvh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Branch not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <BranchHeader branch={branch} />

        {branch.menu.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            currency={branch.currency}
          />
        ))}
      </div>

      {totalItems > 0 ? (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <Button
            size="lg"
            className="h-12 gap-2 rounded-full px-6 shadow-lg"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag />
            <span>
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
            <Badge variant="secondary" className="ml-1 text-xs tabular-nums">
              {branch.currency === "EGP"
                ? "E£"
                : branch.currency === "SAR"
                  ? "SR"
                  : ""}
              {formatPrice(subTotal, branch.currency)}
            </Badge>
          </Button>
        </div>
      ) : null}

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        currency={branch.currency}
        findProductInMenu={(productId: number) => findProductInMenu(productId)}
      />
    </div>
  );
};

export default MenuPage;
