import { Component } from "react";
import CommentList from "../commentList/CommentList";
import CommentForm from "../commentForm/CommentForm";
import SortPanel from "../sortPanel/sortPanel";
import ApiService from "../../services/ApiService";
import Pagination from "../pagination/Pagination";
import { io } from "socket.io-client";
import "./App.css";

class App extends Component {
  state = {
    comments: [],
    count: 0,
    commentsEnded: false,
    isStart: true,
    offset: 0,
    currentPage: 1,
    isSortOpen: false,
    isSortTypeOpen: false,
    sortField: "",
    sortType: "",
  };

  apiService = new ApiService();

  onRequest = async (offset) => {
    this.setState({ offset });
    const { sortField, sortType } = this.state;
    this.apiService
      .getRootComments(offset, sortField, sortType)
      .then(this.onCommentsLoaded); // TODO: error handling
  };

  componentDidMount() {
    this.onRequest(this.state.offset);
    const socket = io(this.apiService.wsUrl); //TODO config var
    socket.on("update", this.onUpdate);
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }

  onSortChange = (sortField, sortType) => {
    this.setState({ sortField, sortType }, () => {
      this.onRequest(this.state.offset);
    });
  };

  onCurrentPageChange = (currentPage) => {
    this.setState({ currentPage });
  };

  onUpdate = (message) => {
    this.onRequest(this.state.offset);
  };

  onCommentsLoaded = ({ comments: newCommentsList, count }) => {
    if (this.state.offset !== 0) {
      this.setState({
        isStart: false,
      });
    }

    const totalPages = Math.ceil(count / this.apiService.LIMIT);
    const { currentPage } = this.state;

    this.setState({
      comments: newCommentsList,
      count,
      commentsEnded: currentPage === totalPages ? true : false,
    });
  };

  onSetIsStart = (isStart) => {
    this.setState({ isStart });
  };

  onSetCommentsEnded = (commentsEnded) => {
    this.setState({ commentsEnded });
  };

  toggleSort = () => {
    this.setState(({ isSortOpen }) => ({
      isSortOpen: !isSortOpen,
      isSortTypeOpen: false,
    }));
  };

  toggleSortType = () => {
    this.setState(({ isSortTypeOpen }) => ({
      isSortOpen: false,
      isSortTypeOpen: !isSortTypeOpen,
    }));
  };

  setComments = (comments) => {
    this.setState({ comments });
  };

  render() {
    const {
      comments,
      commentsEnded,
      isStart,
      count,
      offset,
      isSortOpen,
      isSortTypeOpen,
      sortField,
      sortType,
      currentPage,
    } = this.state;
    return (
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion (20)
            </h2>
          </div>
          <CommentForm
            comments={comments}
            offset={offset}
            updateComments={this.onRequest}
            setComments={this.setComments}
          />
          <SortPanel
            toggleSort={this.toggleSort}
            toggleSortType={this.toggleSortType}
            isSortOpen={isSortOpen}
            isSortTypeOpen={isSortTypeOpen}
            onSortChange={this.onSortChange}
            sortField={sortField}
            sortType={sortType}
          />
          <CommentList comments={comments} offset={offset} />
          <Pagination
            count={count}
            isStart={isStart}
            commentsEnded={commentsEnded}
            offset={offset}
            LIMIT={this.apiService.LIMIT}
            onSetIsStart={this.onSetIsStart}
            onSetCommentsEnded={this.onSetCommentsEnded}
            onRequest={this.onRequest}
            onCurrentPageChange={this.onCurrentPageChange}
            currentPage={currentPage}
          />
        </div>
      </section>
    );
  }
}

export default App;
