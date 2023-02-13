import { Component } from "react";
import Comment from "../comment/Comment";
import "./commentList.css";

class CommentList extends Component {
  render() {
    const { comments, offset } = this.props;
    return comments.map((comment) => (
      <Comment {...comment} key={comment.id} offset={offset} />
    ));
  }
}

export default CommentList;
