class ApiService {
  _apiBase = "https://jsonplaceholder.typicode.com/";

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
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
}

export default ApiService;
