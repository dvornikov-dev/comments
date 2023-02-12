import { Component } from "react";

class Pagination extends Component {
  state = {
    currentPage: 1,
  };

  onPrev = () => {
    const { count, offset, onSetIsStart, onSetCommentsEnded, onRequest } =
      this.props;
    const { currentPage } = this.state;
    let newOffset = offset - 25;
    let to = currentPage * 25 - 25;
    this.setState(({ currentPage }) => ({ currentPage: currentPage - 1 }));
    if (newOffset <= 0) {
      onSetIsStart(true);
    }
    if (to <= count) {
      onSetCommentsEnded(false);
    }
    console.log(newOffset, to, currentPage);
    onRequest(newOffset);
  };
  onNext = () => {
    const { count, offset, commentsEnded, onSetCommentsEnded, onRequest } =
      this.props;
    const { currentPage } = this.state;
    let newOffset = offset + 25;
    let to = currentPage * 25 + 25;
    if (to >= count) {
      onSetCommentsEnded(true);
    }
    if (!commentsEnded) {
      this.setState(({ currentPage }) => ({ currentPage: currentPage + 1 }));
      onRequest(newOffset);
    }
  };

  render() {
    const { commentsLength, commentsEnded, isStart, count } = this.props;
    const { currentPage } = this.state;
    const from = currentPage * 25 - 25;
    const to =
      currentPage * 25 >= commentsLength ? commentsLength : currentPage * 25;
    return (
      <div className="py-2">
        <div>
          <p className="text-sm text-gray-700">
            Showing
            <span className="font-medium"> {from + 1} </span>
            to
            <span className="font-medium"> {to} </span>
            of
            <span className="font-medium"> {count} </span>
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
