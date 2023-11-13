import React, { useEffect, useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete } from "antd";
import { useDebounce } from "../../hooks/useDebounce";
import Search from "antd/es/input/Search";

function SearchHome(props) {
  const [optionsSearch, setOptionsSearch] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const debounceSearch = useDebounce(inputSearch, 300);

  useEffect(() => {
    if (inputSearch.trim()) {
      setLoadingSearch(true);
    }
  }, [inputSearch]);

  useEffect(() => {
    handleSearchUser();
  }, [debounceSearch]);

  const handleSearchUser = () => {
    setLoadingSearch(false);
    // Add logic for search functionality here
  };

  return (
    <div className="search-home-container">
      <AutoComplete style={{ width: "100%" }} options={optionsSearch}>
        <Search
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className="search-input"
          prefix={<SearchOutlined className="icon-search" />}
          placeholder="Search"
          allowClear
        />
      </AutoComplete>
      {loadingSearch && <LoadingOutlined />}
    </div>
  );
}

export default SearchHome;
