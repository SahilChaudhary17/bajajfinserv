import { useState, useEffect } from "react";
import Select from "react-select";
import Chip from "@mui/material/Chip";  // Updated import for MUI Chip

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    document.title = "21BAI10209";
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      setError("");
      const apiResponse = await fetch("https://bajaj-sahil.vercel.app/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      }).then((res) => res.json());
      setResponse(apiResponse);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions || []);
  };

  const getFilteredData = () => {
    if (!response || selectedFilters.length === 0) return [];
    
    return selectedFilters.reduce((acc, filter) => {
      const filterData = response[filter.value];
      if (Array.isArray(filterData)) {
        acc.push({ filter: filter.label, data: filterData });
      }
      return acc;
    }, []);
  };

  const filterOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bajaj Finserv</h1>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="json-input"
            className="block font-medium text-gray-700"
          >
            API Input
          </label>
          <textarea
            id="json-input"
            placeholder='{"data":["M","1","334","4","B","Z","a"]}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>

        {response && response.is_success && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Available Filters</h2>
            <Select
              isMulti
              options={filterOptions}
              value={selectedFilters}
              onChange={handleFilterChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Select filters"
            />
            {selectedFilters.length > 0 && (
              <div className="mt-2">
                <h2 className="text-xl font-semibold">Selected Filters</h2>
                <div className="flex flex-wrap space-x-2">
                  {selectedFilters.map((filter, index) => (
                    <Chip
                      key={index}
                      label={filter.label}
                      className="mb-2"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedFilters.length > 0 && response?.is_success && (
          <div>
            <h2 className="text-xl font-semibold">Filtered Data</h2>
            {getFilteredData().map((filterData, index) => (
              <div key={index}>
                <h3 className="font-medium">{filterData.filter}:</h3>
                <p>{filterData.data.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
