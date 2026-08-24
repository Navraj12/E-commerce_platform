import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout.tsx";
import { getProductImageUrl } from "../../globals/utils/image.ts";
import { fetchCategories } from "../../store/categorySlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../store/productSlice.ts";
import type { Product } from "../../globals/types/productTypes.ts";

interface ProductFormState {
  productName: string;
  productDescription: string;
  productPrice: string;
  originalPrice: string;
  productTotalStockQty: string;
  categoryId: string;
  image: File | null;
  isFeatured: boolean;
}

const emptyForm: ProductFormState = {
  productName: "",
  productDescription: "",
  productPrice: "",
  originalPrice: "",
  productTotalStockQty: "",
  categoryId: "",
  image: null,
  isFeatured: false,
};

const AdminProducts = () => {
  const dispatch = useAppDispatch();
  const { product: products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: String(product.productPrice),
      originalPrice:
        product.originalPrice !== undefined && product.originalPrice !== null
          ? String(product.originalPrice)
          : "",
      productTotalStockQty: String(product.productTotalStockQty),
      categoryId: product.categoryId ?? product.Category?.id ?? "",
      image: null,
      isFeatured: Boolean(product.isFeatured),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.productName ||
      !form.productDescription ||
      !form.productPrice ||
      !form.productTotalStockQty ||
      !form.categoryId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (Number(form.productPrice) <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (Number(form.productTotalStockQty) < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }
    if (
      form.originalPrice &&
      Number(form.originalPrice) <= Number(form.productPrice)
    ) {
      toast.error("Original price must be greater than the current price");
      return;
    }
    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productDescription", form.productDescription);
    formData.append("productPrice", form.productPrice);
    if (form.originalPrice) {
      formData.append("originalPrice", form.originalPrice);
    }
    formData.append("productTotalStockQty", form.productTotalStockQty);
    formData.append("categoryId", form.categoryId);
    formData.append("isFeatured", String(form.isFeatured));
    if (form.image) {
      formData.append("productImageUrl", form.image);
    }

    setSubmitting(true);
    const success = editingId
      ? await dispatch(updateProduct(editingId, formData))
      : await dispatch(createProduct(formData));
    setSubmitting(false);

    if (success) {
      toast.success(editingId ? "Product updated" : "Product created");
      setIsModalOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    const success = await dispatch(deleteProduct(id));
    if (success) {
      toast.success("Product deleted");
    } else {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Products
        </h1>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            onClick={openCreateModal}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Top Pick</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  No products found.
                </td>
              </tr>
            )}
            {filteredProducts.map((p) => (
              <tr key={p.id} className="text-slate-700 dark:text-slate-300">
                <td className="px-5 py-3">
                  <img
                    src={getProductImageUrl(p.productImageUrl)}
                    alt={p.productName}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </td>
                <td className="px-5 py-3">{p.productName}</td>
                <td className="px-5 py-3">{p.Category?.categoryName ?? "-"}</td>
                <td className="px-5 py-3">Rs. {p.productPrice}</td>
                <td className="px-5 py-3">{p.productTotalStockQty}</td>
                <td className="px-5 py-3">
                  {p.isFeatured ? (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Featured
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Name
                </label>
                <input
                  value={form.productName}
                  onChange={(e) =>
                    setForm({ ...form, productName: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Description
                </label>
                <textarea
                  value={form.productDescription}
                  onChange={(e) =>
                    setForm({ ...form, productDescription: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.productPrice}
                    onChange={(e) =>
                      setForm({ ...form, productPrice: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    value={form.productTotalStockQty}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        productTotalStockQty: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Original price (optional, for discount)
                </label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) =>
                    setForm({ ...form, originalPrice: e.target.value })
                  }
                  placeholder="e.g. higher than the price above"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Image {editingId && "(leave empty to keep current)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files?.[0] ?? null })
                  }
                  className="w-full text-sm text-slate-600 dark:text-slate-400"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Mark as Top Pick (Featured)
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
