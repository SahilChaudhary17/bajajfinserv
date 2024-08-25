import { useState, useEffect } from "react";
import Select from "react-select";
import Chip from "@mui/material/Chip";
import { TextField } from "@mui/material";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    document.title = "21BAI10209";
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setJsonInput('{"data":["M","1","334","4","B","Z","a"]}');
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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

      if (!apiResponse.is_success) {
        setError("Data is not available or request failed.");
        setResponse(null);
      } else {
        setResponse(apiResponse);
      }
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
    {
      value: "highest_lowercase_alphabet",
      label: "Highest Lowercase Alphabet",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bajaj Finserv</h1>
      <div className="space-y-2">
        <TextField
          id="json-input"
          label="API Input"
          placeholder='{"data":["M","1","334","4","B","Z","a"]}'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          variant="outlined"
          fullWidth
          error={!!error}
          helperText={error}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          Submit
        </button>
        {response && response.is_success && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Multi Filters</h2>
            <Select
              isMulti
              options={filterOptions}
              value={selectedFilters}
              onChange={handleFilterChange}
              className="block w-full"
              placeholder="Select filters"
            />

            {selectedFilters.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap space-x-2">
                  {selectedFilters.map((filter, index) => (
                    <Chip
                      key={index}
                      label={filter.label}
                      sx={{
                        backgroundColor: "#2563EB",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "darkblue",
                        },
                      }}
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
            <h2 className="text-xl font-semibold text-left">Filtered Data</h2>
            <div className="space-y-1">
              {getFilteredData().map((filterData, index) => (
                <div key={index} className="flex items-center ">
                  <h3 className="font-normal">
                    {filterData.filter}: {filterData.data.join(", ")}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
