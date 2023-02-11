class ApiService {
  _apiBase = "https://jsonplaceholder.typicode.com/";

  getResource = async (url, options) => {
    let res = await fetch(url, options);
    if (res.status === 500) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllComments = async (offset = 0) => {
    const res = await this.getResource(
      `${this._apiBase}comments?_limit=25&_start=${offset}`
    );
    return { comments: res, total: 500 };
  };

  sendComment = async (comment) => {
    // TODO: config
    return this.getResource(`http://localhost:8000/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(comment),
    });
  };
}

export default ApiService;
