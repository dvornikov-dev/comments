import { Component } from "react";

class Pagination extends Component {
  state = {
    currentPage: 1,
  };

  onPrev = () => {
    const {
      count,
      offset,
      onSetIsStart,
      onSetCommentsEnded,
      onRequest,
      onCurrentPageChange,
      currentPage,
    } = this.props;

    const totalPages = Math.ceil(count / 25);

    let newOffset = offset - 25;
    onRequest(newOffset);

    onCurrentPageChange(currentPage - 1);
    if (currentPage - 1 <= totalPages) {
      onSetIsStart(true);
    }
  };
  onNext = () => {
    const {
      count,
      offset,
      onSetCommentsEnded,
      onRequest,
      onCurrentPageChange,
      currentPage,
    } = this.props;

    const totalPages = Math.ceil(count / 25);

    let newOffset = offset + 25;
    onRequest(newOffset);

    onCurrentPageChange(currentPage + 1);

    if (currentPage + 1 >= totalPages) {
      onSetCommentsEnded(true);
    }
  };

  render() {
    const { commentsEnded, isStart, count, currentPage } = this.props;

    const totalPages = Math.ceil(count / 25);

    return (
      <div className="py-2">
        <div>
          <p className="text-sm text-gray-700">
            Page
            <span className="font-medium"> {currentPage} </span>
            of
            <span className="font-medium"> {totalPages} </span>
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
                this.onPrev();
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
                this.onNext();
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
