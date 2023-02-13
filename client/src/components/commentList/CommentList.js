import { Component } from "react";
import Comment from "../comment/Comment";
import "./commentList.css";

class CommentList extends Component {
  render() {
    const { comments } = this.props;
    return comments.map((comment) => <Comment {...comment} key={comment.id} />);
  }
}

export default CommentList;
