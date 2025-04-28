"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

export default function MyProducts() {
  const { delProduct, getProducts, selectedMarketId, updateProduct } = useContent();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = async () => {
    if (!selectedMarketId) {
      alert("Please select a market first");
      return;
    }

    try {
      await updateProduct(editingId, editedProduct);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setEditingId(null);
      setEditedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const handleInputChange = (field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = async (id) => {
    if (!selectedMarketId) {
      alert("Please select a market first");
      return;
    }

    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await delProduct(id);
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const generateImagePath = (productName) => {
    const imageName = productName
      .toLowerCase()
      .replace(/[^a-zа-я0-9]/g, "")
      .replace(/\s+/g, "");
    return `/assets/${imageName}.jpeg`;
  };

  if (!selectedMarketId) {
    return <div className="text-center text-gray-600 p-4">Please select a market to view products</div>;
  }

  if (!products) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-6 text-black bg-white shadow-md rounded-lg">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="border border-gray-300 p-3">Image</th>
            <th className="border border-gray-300 p-3">Name</th>
            <th className="border border-gray-300 p-3">Quantity</th>
            <th className="border border-gray-300 p-3">Expire Date</th>
            <th className="border border-gray-300 p-3">Normal Price ($)</th>
            <th className="border border-gray-300 p-3">Sale Price ($)</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-300 p-3 text-center">
                <Image
                  src={generateImagePath(product.name)}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md mx-auto"
                />
              </td>
              <td className="border border-gray-300 p-3">
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  <span className="font-semibold">{product.name}</span>
                )}
              </td>
              <td className="border border-gray-300 p-3 text-center">
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={editedProduct.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  product.quantity
                )}
              </td>
              <td className="border border-gray-300 p-3 text-center">
                {editingId === product.id ? (
                  <input
                    type="date"
                    value={editedProduct.expireDate}
                    onChange={(e) => handleInputChange('expireDate', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  product.expireDate
                )}
              </td>
              <td className="border border-gray-300 p-3 text-center">
                {editingId === product.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editedProduct.normalPrice}
                    onChange={(e) => handleInputChange('normalPrice', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  `$${product.normalPrice.toFixed(2)}`
                )}
              </td>
              <td className="border border-gray-300 p-3 text-center">
                {editingId === product.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editedProduct.salePrice}
                    onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  <span className="text-red-600 font-bold">
                    ${product.salePrice.toFixed(2)}
                  </span>
                )}
              </td>
              <td className="border border-gray-300 p-3 space-x-2 text-center">
                {editingId === product.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
