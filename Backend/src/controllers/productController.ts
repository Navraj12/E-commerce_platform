import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import Review from "../database/models/Review";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

class ProductController {
  // One-time demo catalog used to seed a healthy number of products (and
  // used again below to backfill distinct images for any pre-existing rows
  // that share a duplicated/placeholder image).
  productData = [
    { productName: "Wireless Bluetooth Headphones", productDescription: "Over-ear wireless headphones with noise isolation and 20-hour battery life.", productPrice: 59.99, productTotalStockQty: 40, categoryName: "Electronics", isFeatured: true, productImageUrl: "https://images.pexels.com/photos/8553999/pexels-photo-8553999.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Smart Fitness Watch", productDescription: "Touchscreen smartwatch with heart-rate tracking, GPS and 7-day battery.", productPrice: 89.99, productTotalStockQty: 35, categoryName: "Electronics", isFeatured: true, productImageUrl: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Portable Bluetooth Speaker", productDescription: "Compact waterproof speaker with rich bass and 12-hour playtime.", productPrice: 34.99, productTotalStockQty: 60, categoryName: "Electronics", productImageUrl: "https://images.pexels.com/photos/374110/pexels-photo-374110.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "USB-C Fast Charger", productDescription: "30W USB-C wall charger, compatible with most phones and tablets.", productPrice: 19.99, productTotalStockQty: 100, categoryName: "Electronics", productImageUrl: "https://images.pexels.com/photos/3921632/pexels-photo-3921632.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Wireless Computer Mouse", productDescription: "Ergonomic wireless mouse with silent clicks and long battery life.", productPrice: 15.99, productTotalStockQty: 80, categoryName: "Electronics", productImageUrl: "https://images.pexels.com/photos/5931186/pexels-photo-5931186.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "4K Web Camera", productDescription: "Ultra HD webcam with built-in microphone, perfect for calls and streaming.", productPrice: 45.99, productTotalStockQty: 25, categoryName: "Electronics", productImageUrl: "https://images.pexels.com/photos/7172701/pexels-photo-7172701.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Mechanical Gaming Keyboard", productDescription: "RGB backlit mechanical keyboard with tactile switches, built for gaming and typing.", productPrice: 49.99, productTotalStockQty: 30, categoryName: "Electronics", productImageUrl: "https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Portable Power Bank 20000mAh", productDescription: "High-capacity power bank with dual USB ports for fast charging on the go.", productPrice: 29.99, productTotalStockQty: 50, categoryName: "Electronics", productImageUrl: "https://images.pexels.com/photos/6296911/pexels-photo-6296911.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Noise Cancelling Earbuds", productDescription: "True wireless earbuds with active noise cancellation and a compact charging case.", productPrice: 54.99, productTotalStockQty: 45, categoryName: "Electronics", isFeatured: true, productImageUrl: "https://images.pexels.com/photos/3921817/pexels-photo-3921817.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Basmati Rice 5kg", productDescription: "Premium long-grain basmati rice, aged for extra aroma and fluffiness.", productPrice: 12.49, productTotalStockQty: 90, categoryName: "Groceries", isFeatured: true, productImageUrl: "https://images.pexels.com/photos/3737694/pexels-photo-3737694.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Organic Honey Jar", productDescription: "Pure raw organic honey, cold-extracted and unfiltered, 500g jar.", productPrice: 8.99, productTotalStockQty: 70, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/5719608/pexels-photo-5719608.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Whole Wheat Flour 2kg", productDescription: "Stone-ground whole wheat flour, ideal for everyday baking.", productPrice: 5.49, productTotalStockQty: 100, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/1047326/pexels-photo-1047326.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Extra Virgin Olive Oil", productDescription: "Cold-pressed extra virgin olive oil, 1 litre bottle.", productPrice: 11.99, productTotalStockQty: 55, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/7296399/pexels-photo-7296399.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Mixed Dry Fruits Pack", productDescription: "Assorted almonds, cashews and raisins, 500g resealable pack.", productPrice: 14.99, productTotalStockQty: 45, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/6210448/pexels-photo-6210448.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Organic Brown Sugar 1kg", productDescription: "Unrefined organic brown sugar with a rich, natural molasses flavor.", productPrice: 6.99, productTotalStockQty: 65, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/6086210/pexels-photo-6086210.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Extra Virgin Coconut Oil", productDescription: "Cold-pressed virgin coconut oil, ideal for cooking, skin and hair care.", productPrice: 10.49, productTotalStockQty: 60, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/3986706/pexels-photo-3986706.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Peanut Butter Jar", productDescription: "Creamy peanut butter made from roasted peanuts, no added sugar, 500g jar.", productPrice: 7.99, productTotalStockQty: 75, categoryName: "Groceries", productImageUrl: "https://images.pexels.com/photos/7965940/pexels-photo-7965940.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Arabica Coffee Beans", productDescription: "Freshly roasted whole Arabica coffee beans, 250g bag.", productPrice: 9.99, productTotalStockQty: 65, categoryName: "Food/Beverages", isFeatured: true, productImageUrl: "https://images.pexels.com/photos/33015766/pexels-photo-33015766.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Green Tea Bags Box", productDescription: "Antioxidant-rich green tea, box of 50 tea bags.", productPrice: 6.49, productTotalStockQty: 75, categoryName: "Food/Beverages", productImageUrl: "https://images.pexels.com/photos/7565515/pexels-photo-7565515.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Sparkling Orange Juice", productDescription: "Refreshing sparkling orange juice made from real fruit, 1 litre.", productPrice: 4.99, productTotalStockQty: 85, categoryName: "Food/Beverages", productImageUrl: "https://images.pexels.com/photos/8215113/pexels-photo-8215113.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Dark Chocolate Bar", productDescription: "72% cocoa dark chocolate bar, rich and smooth, 100g.", productPrice: 3.99, productTotalStockQty: 120, categoryName: "Food/Beverages", productImageUrl: "https://images.pexels.com/photos/4113345/pexels-photo-4113345.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Herbal Infusion Tea Set", productDescription: "Caffeine-free herbal tea blend with chamomile and mint, 30 bags.", productPrice: 7.49, productTotalStockQty: 60, categoryName: "Food/Beverages", productImageUrl: "https://images.pexels.com/photos/8330353/pexels-photo-8330353.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Instant Espresso Coffee Jar", productDescription: "Smooth instant espresso coffee, perfect for a quick rich brew, 200g jar.", productPrice: 8.49, productTotalStockQty: 55, categoryName: "Food/Beverages", productImageUrl: "https://images.pexels.com/photos/3936163/pexels-photo-3936163.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { productName: "Mixed Berry Fruit Jam", productDescription: "Sweet and tangy mixed berry jam made with real fruit, 350g jar.", productPrice: 5.99, productTotalStockQty: 70, categoryName: "Food/Beverages", productImageUrl: "https://images.pexels.com/photos/9160297/pexels-photo-9160297.jpeg?auto=compress&cs=tinysrgb&w=800" },
  ];

  // Derives a stable, product-specific catalog image so no two products end
  // up sharing the same picture. The keyword comes from the product's own
  // name (falling back to its category), and a numeric seed derived from
  // the product's id is appended so even similarly-named products resolve
  // to different images instead of colliding on the same cached result.
  private getSeedImageUrl(product: { id: string; productName: string; categoryName?: string | null }): string {
    const source = (product.productName || product.categoryName || "product").toLowerCase();
    const keyword =
      source
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((word) => word && !["the", "a", "an", "with", "for"].includes(word))[0] ||
      (product.categoryName ? product.categoryName.toLowerCase() : "product");

    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = (hash * 31 + product.id.charCodeAt(i)) >>> 0;
    }
    return `https://loremflickr.com/400/400/${encodeURIComponent(keyword)}?lock=${hash % 100000}`;
  }

  // Seeds a starter catalog (only when the table is empty) and backfills a
  // distinct image for any existing product whose productImageUrl is empty
  // or is shared/duplicated with another product (i.e. a reused demo
  // placeholder), without touching any image that is uniquely used by a
  // single product (a genuine admin upload).
  async seedProduct(): Promise<void> {
    const admin = await User.findOne({ where: { email: "p22admin@gmail.com" } });
    const existingCount = await Product.count();

    if (admin) {
      const categories = await Category.findAll();
      const categoryIdByName = new Map(categories.map((c: any) => [c.categoryName, c.id]));
      const existingNames = new Set(
        (await Product.findAll({ attributes: ["productName"] })).map((p: any) => p.productName)
      );

      const rows = this.productData
        .filter((p) => categoryIdByName.has(p.categoryName) && !existingNames.has(p.productName))
        .map((p) => ({
          productName: p.productName,
          productDescription: p.productDescription,
          productPrice: p.productPrice,
          productTotalStockQty: p.productTotalStockQty,
          categoryId: categoryIdByName.get(p.categoryName),
          userId: admin.id,
          isFeatured: p.isFeatured ?? false,
        }));

      if (rows.length > 0) {
        const imageByName = new Map(this.productData.map((p) => [p.productName, p.productImageUrl]));
        const created = await Product.bulkCreate(rows as any);
        for (const prod of created) {
          await prod.update({
            productImageUrl:
              imageByName.get(prod.productName) ??
              this.getSeedImageUrl({ id: prod.id, productName: prod.productName }),
          });
        }
        console.log(`Seeded ${created.length} demo products`);
      } else if (existingCount > 0) {
        console.log("Products already seeded");
      }
    }

    // Backfill: replace any product image that is missing, shared with
    // another product (a reused placeholder), or still pointing at the old
    // loremflickr placeholder service, with the curated demo-catalog image
    // (matched by product name) or a distinct generated fallback.
    const imageByName = new Map(this.productData.map((p) => [p.productName, p.productImageUrl]));
    const all = await Product.findAll({ include: [{ model: Category }] });
    const countByUrl = new Map<string, number>();
    all.forEach((p: any) => {
      const url = p.productImageUrl;
      if (!url) return;
      countByUrl.set(url, (countByUrl.get(url) ?? 0) + 1);
    });

    const needsBackfill = all.filter(
      (p: any) =>
        !p.productImageUrl ||
        (countByUrl.get(p.productImageUrl) ?? 0) > 1 ||
        p.productImageUrl.includes("loremflickr.com")
    );
    for (const p of needsBackfill as any[]) {
      await p.update({
        productImageUrl:
          imageByName.get(p.productName) ??
          this.getSeedImageUrl({
            id: p.id,
            productName: p.productName,
            categoryName: p.Category?.categoryName,
          }),
      });
    }
    if (needsBackfill.length > 0) {
      console.log(`Backfilled productImageUrl for ${needsBackfill.length} products`);
    }
  }

  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
      categoryId,
      isFeatured,
      originalPrice,
    } = req.body;

    console.log(new Date(Date.now()).toString());

    console.log(Date.now());

    const fileName =
      req.file?.filename ??
      "https://images.pexels.com/photos/17606024/pexels-photo-17606024.jpeg?cs=srgb&dl=pexels-mark-rz-17606024.jpg&fm=jpg";

    if (
      !productName ||
      !productDescription ||
      !productTotalStockQty ||
      !productPrice ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName, productDescription,productTotalStockQty,productPrice ,categoryId",
      });
      return;
    }
    const parsedOriginalPrice =
      originalPrice !== undefined && originalPrice !== null && originalPrice !== ""
        ? Number(originalPrice)
        : null;

    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImageUrl: fileName,
      userId: userId,
      categoryId: categoryId,
      isFeatured: isFeatured === true || isFeatured === "true",
      originalPrice:
        parsedOriginalPrice !== null && parsedOriginalPrice > Number(productPrice)
          ? parsedOriginalPrice
          : null,
    });
    res.status(200).json({
      message: "Product added successfully",
    });
  }

  async getAllProducts(req: AuthRequest, res: Response): Promise<void> {
    const { search, categoryId, minPrice, maxPrice, sortBy, order, isFeatured } =
      req.query as Record<string, string | undefined>;

    const where: WhereOptions = {};
    if (search) {
      (where as any).productName = { [Op.like]: `%${search}%` };
    }
    if (categoryId) {
      (where as any).categoryId = categoryId;
    }
    if (isFeatured !== undefined) {
      (where as any).isFeatured = isFeatured === "true";
    }
    if (minPrice || maxPrice) {
      (where as any).productPrice = {
        ...(minPrice ? { [Op.gte]: Number(minPrice) } : {}),
        ...(maxPrice ? { [Op.lte]: Number(maxPrice) } : {}),
      };
    }

    let sortColumn: string = "createdAt";
    if (sortBy === "price") sortColumn = "productPrice";
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    const data = await Product.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
        {
          model: Category,
        },
        {
          model: Review,
          attributes: ["rating"],
        },
      ],
      order: sortBy === "rating" ? undefined : [[sortColumn, sortOrder]],
    });

    let result = data.map((product: any) => {
      const reviews = product.Reviews ?? [];
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length
          : 0;
      const plain = product.toJSON();
      const discountPercent =
        plain.originalPrice && plain.originalPrice > plain.productPrice
          ? Math.round(
              ((plain.originalPrice - plain.productPrice) / plain.originalPrice) * 100
            )
          : null;
      return { ...plain, averageRating, reviewCount: reviews.length, discountPercent };
    });

    if (sortBy === "rating") {
      result = result.sort((a, b) =>
        order === "desc"
          ? b.averageRating - a.averageRating
          : a.averageRating - b.averageRating
      );
    }

    res.status(200).json({
      message: "Products fetched successfully",
      data: result,
    });
  }
  async getSingleProduct(req: AuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const data = await Product.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    if (data.length == 0) {
      res.status(404).json({
        message: "No product with that id",
      });
    } else {
      res.status(200).json({
        message: "product fetched successfully",
        data,
      });
    }
  }

  async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
      categoryId,
      isFeatured,
      originalPrice,
    } = req.body;

    const existing = await Product.findByPk(id);
    if (!existing) {
      res.status(404).json({ message: "No product with that id" });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (productName !== undefined) updateData.productName = productName;
    if (productDescription !== undefined)
      updateData.productDescription = productDescription;
    if (productTotalStockQty !== undefined)
      updateData.productTotalStockQty = productTotalStockQty;
    if (productPrice !== undefined) updateData.productPrice = productPrice;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isFeatured !== undefined)
      updateData.isFeatured = isFeatured === true || isFeatured === "true";
    if (originalPrice !== undefined) {
      const parsedOriginalPrice =
        originalPrice !== null && originalPrice !== ""
          ? Number(originalPrice)
          : null;
      const effectivePrice =
        productPrice !== undefined ? Number(productPrice) : existing.productPrice;
      updateData.originalPrice =
        parsedOriginalPrice !== null && parsedOriginalPrice > effectivePrice
          ? parsedOriginalPrice
          : null;
    }
    if (req.file?.filename) updateData.productImageUrl = req.file.filename;

    await Product.update(updateData, { where: { id } });
    res.status(200).json({
      message: "Product updated successfully",
    });
  }

  async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Product.findAll({
      where: {
        id: id,
      },
    });
    if (data.length > 0) {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No product with that id ",
      });
    }
  }
}
export default new ProductController();
