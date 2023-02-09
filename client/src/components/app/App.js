import { Component } from "react";
import CommentList from "../commentList/CommentList";
import CommentForm from "../commentForm/CommentForm";
import SortPanel from "../sortPanel/sortPanel";
import "./App.css";

class App extends Component {
  render() {
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
          <CommentList comments={[1, 2, 3]} />
        </div>
      </section>
    );
  }
}

export default App;
