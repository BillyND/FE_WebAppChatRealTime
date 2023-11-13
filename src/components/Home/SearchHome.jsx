import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

function SearchHome(props) {
  const [optionsSearch, setOptionsSearch] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState("");
  const debounceSearch = useDebounce(inputSearch, 300);

  useEffect(() => {
    if (inputSearch?.trim()) {
      setLoadingSearch(true);
    }
  }, [inputSearch]);

  useEffect(() => {
    handleSearchUser();
  }, [debounceSearch]);

  const handleSearchUser = () => {
    console.log(">>>debounceSearch:", debounceSearch);
    setLoadingSearch(false);
  };

  return (
    <div className="search-home-container">
      <AutoComplete
        style={{ width: "100%" }}
        options={optionsSearch}
        size="large"
      >
        <Search
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className="search-input"
          prefix={<SearchOutlined className="icon-search" />}
          placeholder="Search"
          allowClear
          size="large"
        />
      </AutoComplete>
      {loadingSearch && <LoadingOutlined />}
    </div>
  );
}

export default SearchHome;
