import { Component } from "react";
import Comment from "../comment/Comment";
import "./commentList.css";

class CommentList extends Component {
  render() {
    const { comments } = this.props;
    const commentsList = comments.map((comment) => <Comment />);
    return <div className="mt-10">{commentsList}</div>;
  }
}

export default CommentList;
