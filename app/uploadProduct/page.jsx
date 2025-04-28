import { Suspense } from "react";
import MyProducts from "@/components/MyProducts";
import UploadExcel from "@/components/UploadExel";
import ErrorBoundary from "@/components/ErrorBoundary";

const UploadProduct = () => {
  return (
    <div className="container bg-gray-50 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Management</h1>
      
      <div className="space-y-8">
        <ErrorBoundary fallback={<div className="text-red-500">Error loading upload component</div>}>
          <Suspense fallback={<div className="text-gray-500">Loading upload component...</div>}>
            <UploadExcel />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div className="text-red-500">Error loading products</div>}>
          <Suspense fallback={<div className="text-gray-500">Loading products...</div>}>
            <MyProducts />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default UploadProduct;
