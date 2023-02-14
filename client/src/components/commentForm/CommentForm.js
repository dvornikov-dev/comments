import { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, convertFromRaw, EditorState } from "draft-js";
import ApiService from "../../services/ApiService";
import getRandomKey from "../../tools/getRandomKey";
import validateFile from "../../tools/validateFile";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./commentForm.css";

const content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

const emptyEditor = EditorState.createWithContent(convertFromRaw(content));

const toolbar = {
  options: ["inline", "link"],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["bold", "italic", "monospace"],
  },
};

class CommentForm extends Component {
  state = {
    username: "",
    email: "",
    homeUrl: "",
    file: "",
    editorState: emptyEditor,
    loading: false,
    isPreviewing: false,
    error: {
      username: "",
      email: "",
      homeUrl: "",
      message: "",
      file: "",
      form: "",
    },
  };

  apiService = new ApiService();

  componentDidMount() {
    const accessToken = localStorage.getItem("accessToken");
    this.apiService.getUser(accessToken).then(this.onUserLoaded);
  }

  onUserLoaded = (user) => {
    const { username, email, homeUrl } = user;
    this.setState({
      username: username ? username : "",
      email: email ? email : "",
      homeUrl: homeUrl ? homeUrl : "",
    });
  };

  onUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  onEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  onHomeUrlChange = (e) => {
    this.setState({ homeUrl: e.target.value });
  };

  onFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  isEditorEmpty = () => {
    const blocks = this.state.editorState.getCurrentContent().getBlockMap();
    let text = "";
    blocks.forEach((block) => {
      text += block.getText();
    });
    return text.trim().length === 0;
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: {} });
    const { username, email, homeUrl, editorState, file } = this.state;
    const { parentId, setIsReplying, updateChildrens } = this.props;
    if (this.isEditorEmpty()) {
      this.setState({
        error: {
          message: "Message is missing",
        },
      });
      return;
    }
    if (file) {
      const validateResult = validateFile(file);
      if (validateResult.error) {
        this.setState({ error: { file: validateResult.error } });
        return;
      }
    }

    this.setState({ loading: true });

    const comment = {
      username: username,
      email: email,
      homeUrl: homeUrl ? homeUrl : undefined,
      message: convertToRaw(editorState.getCurrentContent()),
      parentId: parentId ? parentId : undefined,
      file,
    };

    const res = await this.apiService.sendComment(comment);
    if (res.message) {
      this.setState({ error: { form: res.message }, loading: false });
    }
    if (res.errors) {
      let errorsState = {};
      res.errors.forEach((error) => {
        errorsState[error.param] = error.msg;
      });
      this.setState({ error: errorsState, loading: false });
    }
    if (res.success) {
      if (res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }
      if (parentId) {
        setIsReplying(false);
        updateChildrens();
      }
      this.setState({
        username: "",
        email: "",
        homeUrl: "",
        editorState: emptyEditor,
        loading: false,
      });
    }
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onPreview = async (e) => {
    e.preventDefault();
    const { username, email, homeUrl, editorState } = this.state;
    const { setComments, comments, parentId } = this.props;
    if (this.isEditorEmpty()) {
      this.setState({
        error: {
          message: "Message is missing",
        },
      });
      return;
    }
    this.setState({ isPreviewing: true });

    const localComment = {
      id: getRandomKey(),
      message: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      createdAt: Date.now(),
      parentId: parentId ? parentId : null,
      local: true,
      user: {
        username: username,
        email: email,
        homeUrl,
      },
    };

    setComments([localComment, ...comments]);
  };

  onCancel = async (e) => {
    e.preventDefault();
    const { setComments, comments } = this.props;
    comments.shift();
    setComments(comments);
    this.setState({ isPreviewing: false });
  };

  render() {
    const { error, editorState, loading, isPreviewing } = this.state;
    return (
      <>
        <form className="mb-6" onSubmit={this.onSubmit}>
          <div className="flex flex-row mb-1">
            <div className="w-1/2">
              <label
                forhtml="username"
                className={`block ${
                  error.username ? "text-red-500" : "text-gray-900"
                } mb-2 text-sm font-medium dark:text-white`}
              >
                {error.username ? error.username : "Username"}
              </label>
              <input
                type="username"
                name="username"
                id="username"
                className={`bg-gray-50 border ${
                  error.username ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="username"
                required
                value={this.state.username}
                onChange={this.onUsernameChange}
              />
            </div>
            <div className="w-1/6"></div>
            <div className="w-1/2">
              <label
                forhtml="email"
                className={`block ${
                  error.email ? "text-red-500" : "text-gray-900"
                } mb-2 text-sm font-medium dark:text-white`}
              >
                {error.email ? error.email : "Email"}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`bg-gray-50 border ${
                  error.email ? "border-red-500" : "border-gray-300"
                } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="name@company.com"
                required
                value={this.state.email}
                onChange={this.onEmailChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label
              forhtml="homeUrl"
              className={`block ${
                error.homeUrl ? "text-red-500" : "text-gray-900"
              } mb-2 text-sm font-medium dark:text-white`}
            >
              {error.homeUrl ? error.homeUrl : "Home URL"}
            </label>
            <input
              type="url"
              name="homeUrl"
              id="homeUrl"
              className={`border ${
                error.homeUrl ? "border-red-500" : "border-gray-300"
              } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="https://example.com"
              value={this.state.homeUrl}
              onChange={this.onHomeUrlChange}
            />
          </div>
          <div className={`text-red-500 ${error.message ? "" : "hidden"}`}>
            {error.message}
          </div>
          <Editor
            editorState={editorState}
            wrapperClassName={`mb-3 ${
              error.message ? "border border-red-500" : ""
            }`}
            editorClassName="editor"
            onEditorStateChange={this.onEditorStateChange}
            toolbar={toolbar}
          />
          <div className="mb-3">
            <label>
              <input
                type="file"
                onChange={this.onFileChange}
                className="text-sm text-grey-500 file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-amber-50 hover:file:text-amber-700"
              />
            </label>
            <p
              className={`mt-1 text-sm ${
                error.file ? "text-red-500" : "text-gray-500"
              } dark:text-gray-300`}
              id="file_input_help"
            >
              {error.file
                ? error.file
                : "PNG, JPG or GIF (MAX. 320x240px). TXT"}
            </p>
          </div>
          <div className={error.form ? `text-red-500` : "hidden"}>
            {error.form}
          </div>
          <button
            type="submit"
            className={`inline-flex ${
              isPreviewing ? "hidden" : ""
            } items-center mr-3 px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800`}
          >
            {!loading ? (
              "Publish post"
            ) : (
              <svg
                aria-hidden="true"
                className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </button>
          <button
            className={`inline-flex ${
              isPreviewing ? "hidden" : ""
            } items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-400`}
            onClick={this.onPreview}
          >
            Preview
          </button>
          <button
            className={`inline-flex ${
              !isPreviewing ? "hidden" : ""
            } items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-400`}
            onClick={this.onCancel}
          >
            Cancel
          </button>{" "}
        </form>
      </>
    );
  }
}

export default CommentForm;
