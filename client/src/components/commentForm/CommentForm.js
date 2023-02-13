import { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, convertFromRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import ApiService from "../../services/ApiService";
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
    editorState: emptyEditor,
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

  onUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  onEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  onHomeUrlChange = (e) => {
    this.setState({ homeUrl: e.target.value });
  };

  onMessageChange = (e) => {
    this.setState({ message: e.target.value });
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
    if (this.isEditorEmpty()) {
      this.setState({
        error: {
          message: "Message is missing",
        },
      });
      return;
    }
    const { editorState } = this.state;

    const { parentId } = this.props;

    const comment = {
      username: this.state.username,
      email: this.state.email,
      homeUrl: this.state.homeUrl ? this.state.homeUrl : undefined,
      message: convertToRaw(editorState.getCurrentContent()),
      parentId: parentId ? parentId : undefined,
    };
    const res = await this.apiService.sendComment(comment);

    if (!res) {
      this.setState({ error: { form: "Unexpected error" } });
    }
    if (res.errors) {
      let errorsState = {};
      res.errors.forEach((error) => {
        errorsState[error.param] = error.msg;
      });
      console.log(errorsState);
      this.setState({ error: errorsState });
    }
    if (res.success) {
      this.setState({
        username: "",
        email: "",
        homeUrl: "",
        editorState: emptyEditor,
      });
    }
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { error, editorState } = this.state;
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
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish post
          </button>
        </form>
      </>
    );
  }
}

export default CommentForm;
