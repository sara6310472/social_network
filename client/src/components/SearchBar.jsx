import PropTypes from "prop-types";
import { MdAdd } from "react-icons/md";

export const SearchBar = (props) => {
  const { filters, setFilters, setIsFormVisible, children } = props;

  return (
    <div className="searchControls">
      <input
        type="text"
        className="formInput"
        placeholder="Search..."
        value={filters.searchTerm}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            searchTerm: e.target.value,
          }))
        }
      />
      <input
        type="text"
        className="formInput"
        placeholder="Search by ID..."
        value={filters.searchById}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            searchById: e.target.value,
          }))
        }
      />
      <select
        className="formSelect"
        value={filters.sortBy}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            sortBy: e.target.value,
          }))
        }
      >
        <option value="id">Sort by ID</option>
        <option value="title">Sort by Title</option>
      </select>

      <button
        className="btnPrimary"
        onClick={() => setIsFormVisible((prev) => !prev)}
      >
        <MdAdd />
      </button>
      {children}
    </div>
  );
};

SearchBar.propTypes = {
  filters: PropTypes.shape({
    searchTerm: PropTypes.string.isRequired,
    searchById: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired,
  }).isRequired,
  setIsFormVisible: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};
