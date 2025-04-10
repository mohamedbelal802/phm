import { useState } from "react";

const HomePage = () => {
  const [jsonData, setJsonData] = useState(null);
  const [formData, setFormData] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);

          // Extract the request body from the Postman collection
          let requestBody = {};

          // Check if this is a Postman collection
          if (parsedData.item && parsedData.item.length > 0) {
            // Find the first POST request with a raw JSON body
            const findRequestBody = (items) => {
              for (const item of items) {
                if (item.item && item.item.length > 0) {
                  const found = findRequestBody(item.item);
                  if (found) return found;
                }

                if (
                  item.request &&
                  item.request.body &&
                  item.request.body.mode === "raw" &&
                  item.request.body.options?.raw?.language === "json"
                ) {
                  try {
                    return JSON.parse(item.request.body.raw);
                  } catch (e) {
                    console.error("Error parsing request body:", e);
                  }
                }
              }
              return null;
            };

            requestBody = findRequestBody(parsedData.item) || {};
          } else {
            // If it's not a Postman collection, use the JSON as is
            requestBody = parsedData;
          }

          setJsonData(requestBody);
          setFormData(requestBody);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Invalid JSON file. Please upload a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to determine input type based on value
  const getInputType = (value) => {
    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        return "number";
      }
      return "number";
    }
    if (typeof value === "boolean") {
      return "checkbox";
    }
    // Check if it's a date string (simple check)
    if (typeof value === "string" && value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      return "date";
    }
    return "text";
  };

  // Helper function to format date value for input
  const formatDateValue = (value, type) => {
    if (type === "date" && typeof value === "string") {
      // Convert MM/DD/YYYY to YYYY-MM-DD for HTML date input
      const parts = value.split("/");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
          2,
          "0"
        )}`;
      }
    }
    return value;
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Insurance Data</h2>
        <div className="flex justify-center mb-6">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="border p-2 rounded"
          />
        </div>

        {jsonData && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-4 text-blue-700">
              Insurance Claim Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {Object.entries(jsonData).map(([key, value]) => {
                const inputType = getInputType(value);
                const formattedValue = formatDateValue(
                  formData[key],
                  inputType
                );

                return (
                  <div key={key} className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">
                      {key
                        .replace(/_/g, " ")
                        .replace(/-/g, " ")
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </label>
                    {inputType === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={formData[key] || false}
                        onChange={(e) =>
                          handleInputChange(key, e.target.checked)
                        }
                        className="h-5 w-5"
                      />
                    ) : (
                      <input
                        type={inputType}
                        value={formattedValue || ""}
                        onChange={(e) =>
                          handleInputChange(
                            key,
                            inputType === "number"
                              ? e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                              : e.target.value
                          )
                        }
                        step={
                          inputType === "number" && !Number.isInteger(value)
                            ? "0.01"
                            : "1"
                        }
                        className="border p-2 rounded w-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={() => console.log("Form data:", formData)}
              >
                Submit Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
