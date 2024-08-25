import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      setError("");
      setShowDropdown(true);
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

  const handleSelectChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  const getFilteredResponse = () => {
    if (!response) return "";
    let filteredResponse = [];
    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.push(...response.data.filter((item) => isNaN(item)));
    }
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.push(...response.data.filter((item) => !isNaN(item)));
    }
    if (selectedOptions.includes("Highest lowercase alphabet")) {
      const lowerCaseAlphabets = response.data.filter(
        (item) => typeof item === "string" && item === item.toLowerCase()
      );
      if (lowerCaseAlphabets.length > 0) {
        filteredResponse.push(lowerCaseAlphabets.sort().reverse()[0]);
      }
    }
    return filteredResponse.join(",");
  };

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
            placeholder='{"data":["M","1","334","4","B"]}'
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
        {showDropdown && (
          <div>
            <label
              htmlFor="multi-filter"
              className="block font-medium text-gray-700"
            >
              Multi Filter
            </label>
            <select
              id="multi-filter"
              multiple
              value={selectedOptions}
              onChange={handleSelectChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">
                Highest lowercase alphabet
              </option>
            </select>
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">Filtered Response</h2>
          <p>{getFilteredResponse()}</p>
        </div>
      </div>
    </div>
  );
}
