import { useState } from "react";
import { useProducts, useBranchProducts } from "../hooks/restaurant-hooks";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, PackageOpen } from "lucide-react";
import DialogCreateProduct from "../components/DialogCreateProduct";
import DialogEditProduct from "../components/DialogEditProduct";
import DialogEditBranchProduct from "../components/DialogEditBranchProduct";
import BranchSwitcher from "../components/BranchSwitcher";
import {
  RESTAURANT_ROLES,
  type BranchProductItem,
  type RestaurantProduct,
} from "../types";
import { formatPrice } from "@/lib/format-price";

const RestaurantProductsPage = () => {
  const { data: productsData } = useProducts();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<RestaurantProduct | null>(null);
  const [branchEditOpen, setBranchEditOpen] = useState(false);
  const [selectedBranchProduct, setSelectedBranchProduct] =
    useState<BranchProductItem | null>(null);
  const activeRestaurant = useActiveRestaurantStore((s) => s.activeRestaurant);
  const activeBranch = useActiveRestaurantStore((s) => s.activeBranch);
  const { data: branchProductsData } = useBranchProducts(
    activeBranch?.branchId ?? null,
  );
  console.log(activeRestaurant);
  const products = Array.isArray(productsData) ? productsData : [];

  const branchMenu = Array.isArray(branchProductsData)
    ? branchProductsData
    : [];


  const handleEdit = (product: RestaurantProduct) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleBranchEdit = (product: BranchProductItem) => {
    setSelectedBranchProduct(product);
    setBranchEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        {activeRestaurant?.restaurantRole === RESTAURANT_ROLES.OWNER && (
          <DialogCreateProduct open={open} setOpen={setOpen} />
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="branch">By Branch</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No products yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden flex flex-col justify-between relative group"
                >
                  {activeRestaurant?.restaurantRole ===
                    RESTAURANT_ROLES.OWNER && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 z-10 transition-opacity"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  )}
                  <div>
                    {product?.image_url ? (
                      <div className="aspect-video w-full overflow-hidden border-b bg-muted">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full flex items-center bg-muted text-xs text-muted-foreground justify-center">
                        No Image Available
                      </div>
                    )}

                    <CardHeader className="space-y-2 p-4">
                      {product.category_name && (
                        <div className="flex items-center">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 font-medium"
                          >
                            {product.category_name}
                          </Badge>
                        </div>
                      )}

                      <CardTitle className="text-sm font-semibold">
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                  </div>

                  <CardContent className="text-xs text-muted-foreground p-4 pt-0">
                    {product.description && (
                      <p className="line-clamp-2">{product.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="branch" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <BranchSwitcher />
          </div>

          {!activeBranch ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No branches available
              </CardContent>
            </Card>
          ) : branchMenu.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No products for this branch
              </CardContent>
            </Card>
          ) : (
            branchMenu.map((category) => (
              <div key={category.category_id} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {category.category_name}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {category.products.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden flex flex-col justify-between relative group"
                    >
                      {(activeRestaurant?.restaurantRole ===
                        RESTAURANT_ROLES.OWNER ||
                        activeRestaurant?.restaurantRole ===
                          RESTAURANT_ROLES.BRANCH_MANAGER) && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleBranchEdit(item)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      <div>
                        {item.image_url ? (
                          <div className="aspect-video w-full overflow-hidden border-b bg-muted">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video w-full flex items-center bg-muted text-xs text-muted-foreground justify-center">
                            <PackageOpen className="size-6" />
                          </div>
                        )}

                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-sm font-semibold">
                            {item.name}
                          </CardTitle>
                        </CardHeader>
                      </div>

                      <CardContent className="p-3 pt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium">
                            {item.price != null ? `${formatPrice(item.price)}` : "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Stock</span>
                          <span className="font-medium">
                            {item.stock != null ? item.stock : "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Status</span>
                          <Badge
                            variant={
                              item.is_available ? "default" : "secondary"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {item.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <DialogEditProduct
          open={editOpen}
          setOpen={setEditOpen}
          product={selectedProduct}
        />
      )}

      {selectedBranchProduct && activeBranch && (
        <DialogEditBranchProduct
          open={branchEditOpen}
          setOpen={setBranchEditOpen}
          product={selectedBranchProduct}
          branchId={activeBranch.branchId}
        />
      )}
    </div>
  );
};

export default RestaurantProductsPage;
