class ApiService {
  _apiBase = "http://localhost:8000/";
  wsUrl = "ws://localhost:8000";
  LIMIT = 25;

  getResource = async (url, options) => {
    let res = await fetch(url, options);
    if (res.status === 500) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getRootComments = async (offset = 0, sortField = "id", sortType = "desc") => {
    //TODO limit config
    const res = await this.getResource(
      `${this._apiBase}comments?limit=${this.LIMIT}&offset=${offset}&sortField=${sortField}&sortType=${sortType}`
    );
    return res;
  };

  getChildComments = async (parentId) => {
    const res = await this.getResource(
      `${this._apiBase}comments/childs?parentId=${parentId}`
    );
    return res;
  };

  sendComment = async (comment) => {
    return this.getResource(`${this._apiBase}comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(comment),
    });
  };

  getUser = async (accessToken) => {
    return this.getResource(`${this._apiBase}users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}

export default ApiService;
