"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { useContent } from "@/context/ContentContext";

const UploadExcel = () => {
  const [fileData, setFileData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingProducts, setExistingProducts] = useState([]);

  const { addProducts, getProducts } = useContent();

  // Load existing products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setExistingProducts(products);
    };
    fetchProducts();
  }, [getProducts]);

  // Utility: Check if product already exists
  const isDuplicate = (productName) =>
    existingProducts.some(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

  // Parse and validate Excel file
  const handleFileUpload = (file) => {
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const validExtensions = ["xlsx", "xls"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (
      !validMimeTypes.includes(file.type) &&
      !validExtensions.includes(ext)
    ) {
      setError("Please upload a valid Excel file (.xlsx or .xls).");
      return;
    }

    if (fileData.length > 0) {
      setError("Please confirm or clear the current file before uploading a new one.");
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const duplicates = data.filter((item) => isDuplicate(item["Product Name"]));
        if (duplicates.length > 0) {
          setError(
            `Warning: These products already exist: ${duplicates
              .map((d) => d["Product Name"])
              .join(", ")}`
          );
        }

        setFileData(data);
      } catch (err) {
        setError("Error reading the file. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Setup dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="min-h-[400px] bg-gray-700 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl text-gray-800">
        <h2 className="text-3xl font-semibold text-center mb-6">Upload Excel File</h2>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="w-full py-8 px-4 mb-6 border-4 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
        >
          <input {...getInputProps()} />
          <p className="text-center text-gray-500 text-lg">
            Drag & drop your Excel file here, or <span className="text-blue-500">click to select</span>.
          </p>
        </div>

        {/* Messages */}
        {loading && <p className="text-center text-blue-500 font-medium mb-4">Loading file...</p>}
        {error && (
          <p className={`text-center font-medium mb-4 ${error.includes("Warning") ? "text-yellow-600" : "text-red-500"}`}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-center text-green-600 font-medium mb-4">Products successfully uploaded!</p>
        )}

        {/* Table of parsed data */}
        {fileData.length > 0 && (
          <>
            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden mt-4">
              <thead className="bg-gray-100">
                <tr>
                  {["Product Name", "Quantity", "Expiry Date", "Sale Price", "Regular Price", "Place at Store", "Status"].map((header) => (
                    <th
                      key={header}
                      className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.map((row, idx) => {
                  const duplicate = isDuplicate(row["Product Name"]);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-3 text-sm text-gray-800">{row["Product Name"]}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{row["Quantity"]}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{row["Expiry Date"]}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{row["Sale Price"]}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{row["Regular Price"]}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{row["Place at Store"]}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={duplicate ? "text-yellow-600" : "text-green-600"}>
                          {duplicate ? "Exists" : "New"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Confirm Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Upload</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to upload this data? Please double-check before continuing.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                  addProducts(fileData);
                  setSuccess(true);
                  setFileData([]);
                  setError(null);
                  setIsModalOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;
