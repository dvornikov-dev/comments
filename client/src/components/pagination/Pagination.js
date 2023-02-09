import { Component } from "react";

class Pagination extends Component {
  render() {
    const { from, to, total, onPrev, onNext, commentsEnded, isStart } =
      this.props;
    return (
      <div className="py-2">
        <div>
          <p className="text-sm text-gray-700">
            Showing
            <span className="font-medium"> {from} </span>
            to
            <span className="font-medium"> {to} </span>
            of
            <span className="font-medium"> {total} </span>
            results
          </p>
        </div>
        <nav className="block"></nav>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <a
              onClick={() => {
                onPrev();
              }}
              href="#blank"
              className={`relative ${
                isStart ? "hidden" : ""
              } inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
            >
              <span>Previous</span>
            </a>

            <a
              onClick={() => {
                onNext();
              }}
              href="#blank"
              className={`relative ${
                commentsEnded ? "hidden" : ""
              }  inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
            >
              <span>Next</span>
            </a>
          </nav>
        </div>
      </div>
    );
  }
}

export default Pagination;
