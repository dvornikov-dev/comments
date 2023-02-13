import { Component } from "react";

class SortPanel extends Component {
  render() {
    const {
      toggleSort,
      toggleSortType,
      isSortOpen,
      isSortTypeOpen,
      onSortChange,
      sortField,
      sortType,
    } = this.props;

    const sortFields = {
      username: "Username",
      email: "Email",
      createdAt: "Date",
    };

    return (
      <>
        <div className="float-right mb-6">
          <button
            id="dropdownActionButton"
            data-dropdown-toggle="dropdownAction"
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
            onClick={toggleSortType}
          >
            <span className="sr-only">Type Button</span>
            {sortType ? sortType : "Type"}

            <svg
              className="w-3 h-3 ml-2"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div
            id="dropdownAction"
            className={`z-10 ${
              isSortTypeOpen ? "" : "hidden"
            } absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
          >
            <ul
              className="py-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownActionButton"
              onClick={toggleSortType}
            >
              <li>
                <a
                  href="#t"
                  onClick={(e) => {
                    e.preventDefault();
                    onSortChange(sortField, "asc");
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Asc
                </a>
              </li>
              <li>
                <a
                  href="#t"
                  onClick={(e) => {
                    e.preventDefault();
                    onSortChange(sortField, "desc");
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Desc
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="float-right mb-6 mr-3">
          <button
            id="dropdownActionButton"
            data-dropdown-toggle="dropdownAction"
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
            onClick={toggleSort}
          >
            <span className="sr-only">Sort Button</span>
            {sortField ? sortFields[sortField] : "Sort"}
            <svg
              className="w-3 h-3 ml-2"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div
            id="dropdownAction"
            className={`z-10 ${
              isSortOpen ? "" : "hidden"
            } absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
          >
            <ul
              className="py-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownActionButton"
              onClick={toggleSort}
            >
              <li>
                <a
                  href="#t"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onSortChange("username", sortType);
                  }}
                >
                  Username
                </a>
              </li>
              <li>
                <a
                  href="#t"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onSortChange("email", sortType);
                  }}
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="#t"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onSortChange("createdAt", sortType);
                  }}
                >
                  Date
                </a>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export default SortPanel;
