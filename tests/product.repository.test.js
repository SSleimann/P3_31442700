import { vi, describe, it, beforeEach, expect } from "vitest";
import Product from "../src/models/product.js";
import ProductRepository from "../src/repositories/product.repository.js";
import { v4 as uuidv4 } from "uuid";

vi.mock("../src/models/product.js", () => ({
  default: {
    create: vi.fn(),
    findByPk: vi.fn(),
    findAll: vi.fn(),
  },
}));

describe("ProductRepository", () => {
  let productRepository;

  beforeEach(() => {
    vi.mocked(Product.create).mockReset();
    vi.mocked(Product.findByPk).mockReset();
    vi.mocked(Product.findAll).mockReset();
    productRepository = new ProductRepository();
  });

  it("createProduct should create a new product", async () => {
    const productData = {
      name: "Sample Product",
      price: 9.99,
    };
    const mockProduct = { id: uuidv4(), ...productData };
    Product.create.mockResolvedValue(mockProduct);

    const product = await productRepository.createProduct(productData);
    expect(Product.create).toHaveBeenCalledWith(productData);
    expect(product).toEqual(mockProduct);
  });

  it("getProductById should return a product by ID", async () => {
    const productId = uuidv4();
    const mockProduct = {
      id: productId,
      name: "Get Product",
      price: 5.0,
    };
    Product.findByPk.mockResolvedValue(mockProduct);
    const product = await productRepository.getProductById(productId);
    expect(Product.findByPk).toHaveBeenCalledWith(productId);
    expect(product).toEqual(mockProduct);
  });

  it("updateProduct should update an existing product", async () => {
    const productId = uuidv4();
    const existingProduct = {
      id: productId,
      name: "Old Product",
      price: 1.0,
      update: vi.fn(),
    };

    Product.findByPk.mockResolvedValue(existingProduct);
    const updatedData = {
      name: "Updated Product",
      price: 2.5,
    };

    const product = await productRepository.updateProduct(
      productId,
      updatedData
    );
    expect(Product.findByPk).toHaveBeenCalledWith(productId);
    expect(existingProduct.update).toHaveBeenCalledWith(updatedData);
    expect(product).toEqual(existingProduct);
  });

  it("deleteProduct should delete an existing product", async () => {
    const productId = uuidv4();
    const existingProduct = {
      id: productId,
      name: "To Be Deleted",
      price: 3.0,
      destroy: vi.fn(),
    };
    Product.findByPk.mockResolvedValue(existingProduct);

    const product = await productRepository.deleteProduct(productId);

    expect(Product.findByPk).toHaveBeenCalledWith(productId);
    expect(existingProduct.destroy).toHaveBeenCalled();
    expect(product).toEqual(existingProduct);
  });

  it("filterProducts should return products that match criteria", async () => {
    const criteria = { price: 10 };
    const options = {
      filterFields: ["price"],
    };

    const mockProducts = [
      { id: uuidv4(), name: "P1", price: 10 },
      { id: uuidv4(), name: "P2", price: 10 },
    ];
    Product.findAll.mockResolvedValue(mockProducts);

    const products = await productRepository.filterProducts(criteria, options);
    expect(Product.findAll).toHaveBeenCalledWith({
      where: criteria,
      limit: 10,
      offset: 0,
    });
    expect(products).toEqual(mockProducts);
  });
});
