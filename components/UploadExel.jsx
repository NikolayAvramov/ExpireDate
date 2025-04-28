"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { useContent } from "@/context/ContentContext";

const UploadExcel = () => {
  const [fileData, setFileData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingProducts, setExistingProducts] = useState([]);
  const { addProducts, getProducts } = useContent();

  // Fetch existing products when component mounts
  useEffect(() => {
    const fetchExistingProducts = async () => {
      const products = await getProducts();
      setExistingProducts(products);
    };
    fetchExistingProducts();
  }, [getProducts]);

  // Function to check if product already exists
  const checkExistingProducts = (newProducts) => {
    return newProducts.filter(product => {
      return existingProducts.some(existing => 
        existing.name.toLowerCase() === product["Product Name"].toLowerCase()
      );
    });
  };

  // Function to handle file upload and parsing
  const handleFileUpload = (file) => {
    // List of valid MIME types and file extensions
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const validExtensions = ["xlsx", "xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Validate file type and extension
    if (
      !validMimeTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      setError("Please upload a valid Excel file (.xlsx or .xls).");
      return;
    }

    setError(null); // Clear any previous errors

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        
        // Check for existing products
        const duplicates = checkExistingProducts(data);
        if (duplicates.length > 0) {
          setError(`Warning: The following products already exist: ${duplicates.map(p => p["Product Name"]).join(", ")}`);
        }
        
        setFileData(data); // Store parsed data
      } catch (error) {
        setError("Error reading the file. Please try again.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
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
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Upload Excel File
        </h2>

        {/* Drag and Drop Zone */}
        <div
          {...getRootProps()}
          className="w-full text-gray-800 py-8 px-4 mb-6 border-4 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-300"
        >
          <input {...getInputProps()} />
          <p className="text-center text-gray-500 text-lg">
            Drag & Drop your Excel file here, or{" "}
            <span className="text-blue-500">click to select one</span>.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className={`text-center font-medium mb-6 ${error.includes("Warning") ? "text-yellow-600" : "text-red-500"}`}>
            {error}
          </p>
        )}

        {/* Display Parsed Data */}
        {fileData.length > 0 && (
          <>
            <table className="min-w-full table-auto border-collapse mt-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Product Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Expiry Date
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Sale Price
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Regular Price
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Place at Store
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {fileData.map((row, index) => {
                  const isDuplicate = existingProducts.some(
                    existing => existing.name.toLowerCase() === row["Product Name"].toLowerCase()
                  );
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {row["Product Name"]}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {row["Quantity"]}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {row["Expiry Date"]}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {row["Sale Price"]}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {row["Regular Price"]}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {row["Place at Store"]}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium">
                        {isDuplicate ? (
                          <span className="text-yellow-600">Exists</span>
                        ) : (
                          <span className="text-green-600">New</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Data Upload
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to upload this data? Please double-check the
              information before proceeding.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                onClick={() => {
                  addProducts(fileData);
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
