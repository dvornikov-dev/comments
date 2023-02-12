import { Component } from "react";
import CommentList from "../commentList/CommentList";
import CommentForm from "../commentForm/CommentForm";
import SortPanel from "../sortPanel/sortPanel";
import ApiService from "../../services/ApiService";
import Pagination from "../pagination/Pagination";
import { io } from "socket.io-client";
import wsService from "../../services/WsService";
import "./App.css";

class App extends Component {
  state = {
    comments: [],
    count: 0,
    commentsEnded: false,
    isStart: true,
    offset: 0,
    currentPage: 1,
  };

  apiService = new ApiService();

  onRequest = (offset) => {
    this.setState({ offset });
    this.apiService.getRootComments(offset).then(this.onCommentsLoaded); // TODO: error handling
  };

  componentDidMount() {
    this.onRequest(this.state.offset);
    const socket = io("ws://localhost:8000"); //TODO config var
    socket.on("message", (message) =>
      console.log("Message from server: ", message)
    );
    socket.on("update", this.onUpdate);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }

  onUpdate = (message) => {
    console.log("update message");
    this.onRequest(this.state.offset);
  };

  onCommentsLoaded = ({ comments: newCommentsList, count }) => {
    if (this.state.offset !== 0) {
      this.setState({
        isStart: false,
      });
    }
    this.setState({
      comments: newCommentsList,
      count,
      commentsEnded: count > 25 ? false : true,
    });
  };

  onSetIsStart = (isStart) => {
    this.setState({ isStart });
  };

  onSetCommentsEnded = (commentsEnded) => {
    this.setState({ commentsEnded });
  };

  onPrev = () => {
    const { count, offset, currentPage } = this.state;
    let newOffset = offset - 25;
    let to = currentPage * 25 - 25;
    this.setState(({ currentPage }) => ({ currentPage: currentPage - 1 }));
    if (newOffset <= 0) {
      this.setState({ isStart: true });
    }
    if (to <= count) {
      this.setState({ commentsEnded: false });
    }
    console.log(newOffset, to, currentPage);
    this.onRequest(newOffset);
  };
  onNext = () => {
    const { count, commentsEnded, offset, currentPage } = this.state;
    let newOffset = offset + 25;
    let to = currentPage * 25 + 25;
    if (to >= count) {
      this.setState({ commentsEnded: true });
    }
    if (!commentsEnded) {
      this.setState(({ currentPage }) => ({ currentPage: currentPage + 1 }));
      this.onRequest(newOffset);
    }
  };

  render() {
    const { comments, commentsEnded, isStart, count, offset } = this.state;
    return (
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion (20)
            </h2>
          </div>
          <CommentForm />
          <SortPanel />
          <CommentList comments={comments} />
          <Pagination
            commentsLength={comments.length}
            count={count}
            isStart={isStart}
            commentsEnded={commentsEnded}
            offset={offset}
            onSetIsStart={this.onSetIsStart}
            onSetCommentsEnded={this.onSetCommentsEnded}
            onRequest={this.onRequest}
          />
        </div>
      </section>
    );
  }
}

export default App;
