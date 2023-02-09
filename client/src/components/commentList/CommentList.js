import { Component } from "react";
import Comment from "../comment/Comment";
import Pagination from "../pagination/Pagination";
import ApiService from "../../services/ApiService";
import "./commentList.css";

class CommentList extends Component {
  state = {
    comments: [],
    total: 0,
    commentsEnded: false,
    isStart: true,
    offset: 0,
    currentPage: 1,
  };

  apiService = new ApiService();

  onRequest = (offset) => {
    this.setState({ offset });
    this.apiService.getAllComments(offset).then(this.onCommentsLoaded); // TODO: error handling
  };

  componentDidMount() {
    this.onRequest(this.state.offset);
  }

  onCommentsLoaded = ({ comments: newCommentsList, total }) => {
    if (this.state.offset !== 0) {
      this.setState({
        isStart: false,
      });
    }
    this.setState({
      comments: newCommentsList,
      total,
    });
  };

  onPrev = () => {
    const { total, offset, currentPage } = this.state;
    let newOffset = offset - 25;
    let to = currentPage * 25 - 25;
    this.setState(({ currentPage }) => ({ currentPage: currentPage - 1 }));
    if (newOffset <= 0) {
      this.setState({ isStart: true });
    }
    if (to <= total) {
      this.setState({ commentsEnded: false });
    }
    console.log(newOffset, to, currentPage);
    this.onRequest(newOffset);
  };
  onNext = () => {
    const { total, commentsEnded, offset, currentPage } = this.state;
    let newOffset = offset + 25;
    let to = currentPage * 25 + 25;
    if (to >= total) this.setState({ commentsEnded: true });
    if (!commentsEnded) {
      this.setState(({ currentPage }) => ({ currentPage: currentPage + 1 }));
    }
    console.log(newOffset, to, currentPage);

    this.onRequest(newOffset);
  };

  render() {
    const { comments, commentsEnded, isStart, total, currentPage } = this.state;
    console.log(comments);
    const commentsList = comments.map((comment) => (
      <Comment {...comment} key={comment.id} />
    ));
    const from = currentPage * 25 - 25;
    const to = currentPage * 25;
    return (
      <div className="mt-10">
        {commentsList}
        <Pagination
          from={from}
          to={to}
          total={total}
          isStart={isStart}
          commentsEnded={commentsEnded}
          onPrev={this.onPrev}
          onNext={this.onNext}
        />
      </div>
    );
  }
}

export default CommentList;
