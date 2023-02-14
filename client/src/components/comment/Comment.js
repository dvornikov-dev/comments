import { Component } from "react";
import avatar from "../../resources/blank.png";
import draftToHtml from "draftjs-to-html";
import ApiService from "../../services/ApiService";
import CommentList from "../commentList/CommentList";
import CommentForm from "../commentForm/CommentForm";
import LightBox from "./LightBox";
import "./comment.css";

class Comment extends Component {
  state = {
    childComments: [],
    isReplying: false,
    childrenHidden: true,
    fileUrl: "",
  };

  apiService = new ApiService();

  componentDidMount() {
    const { id, local } = this.props;
    if (local) return;
    this.apiService.getChildComments(id).then(this.onCommentsLoaded);
  }

  onBoxToggle = (e) => {
    this.setState(({ toggler }) => ({ toggler: !toggler }));
  };

  onCommentsLoaded = ({ comments }) => {
    this.setState({ childComments: comments });
  };

  setIsReplying = (isReplying) => this.setState({ isReplying });

  setChildrenHidden = (childrenHidden) => this.setState({ childrenHidden });

  updateChildrens = () => {
    const { id } = this.props;
    this.apiService.getChildComments(id).then(this.onCommentsLoaded);
  };

  setChildComments = (childComments) => {
    this.setState({ childComments });
  };

  render() {
    const { id, message, user, createdAt, file } = this.props;
    const { childComments, isReplying, childrenHidden } = this.state;
    const date = new Date(createdAt);

    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", options);

    const messageHtml = draftToHtml(JSON.parse(message));

    const txt = file?.extension === "txt" ? true : false;

    return (
      <>
        <article className="p-6 pb-1 pl-0 ml-3 text-base bg-white rounded-lg dark:bg-gray-900">
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img
                  className="mr-2 w-6 h-6 rounded-full"
                  src={avatar}
                  alt="Michael Gough"
                />
                {user.homeUrl ? (
                  <a
                    href={user.homeUrl}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    {user.username}
                  </a>
                ) : (
                  user.username
                )}
                &nbsp;&nbsp;
                <a
                  href={`mailto:${user.email}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  {user.email}
                </a>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <time pubdate="true" dateTime={createdAt} title={formattedDate}>
                  {formattedDate}
                </time>
              </p>
            </div>
          </footer>
          <div
            className="break-all"
            dangerouslySetInnerHTML={{ __html: messageHtml }}
          ></div>
          <button onClick={this.onBoxToggle}>asd</button>
          {!txt && file && (
            <LightBox
              images={[
                `${this.apiService._apiStatic}${file.fileName}.${file.extension}`,
              ]}
            />
          )}

          {txt && (
            <>
              <br />
              <a
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href={`${this.apiService._apiStatic}${file.fileName}.${file.extension}`}
              >
                {`${file.fileName}.${file.extension}`}
              </a>
            </>
          )}

          <div className="flex items-center mt-4 space-x-4">
            <button
              type="button"
              className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
              onClick={() => this.setIsReplying(!isReplying)}
            >
              <svg
                aria-hidden="true"
                className="mr-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              {isReplying ? "Cancel Reply" : "Reply"}
            </button>
          </div>
          {isReplying && (
            <div className="mt-1 ml-3">
              <CommentForm
                autoFocus
                parentId={id}
                setIsReplying={this.setIsReplying}
                updateChildrens={this.updateChildrens}
                comments={childComments}
                setComments={this.setChildComments}
              />
            </div>
          )}
          {childComments?.length > 0 && (
            <>
              <button
                className={`flex items-center ${
                  childrenHidden ? "hidden" : ""
                } mx-auto text-sm text-gray-500 hover:underline dark:text-gray-400`}
                onClick={() => this.setChildrenHidden(true)}
              >
                Hide Replies
              </button>
              <div
                className={`transition-opacity duration-300 ease-in-out ${
                  !childrenHidden || isReplying ? "" : "hidden"
                }`}
                id="nested-comments"
              >
                <CommentList comments={childComments} />
              </div>
              <button
                onClick={() => this.setChildrenHidden(false)}
                className={`flex ${
                  !childrenHidden ? "hidden" : ""
                } items-center mx-auto text-sm text-gray-500 hover:underline dark:text-gray-400`}
              >
                Show Replies
              </button>
            </>
          )}
        </article>
      </>
    );
  }
}

export default Comment;
