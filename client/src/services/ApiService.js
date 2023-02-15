import toBase64 from "../tools/toBase64";
class ApiService {
  _apiBase = "http://134.209.82.213:8000/";
  _apiStatic = "http://134.209.82.213:8001/";

  wsUrl = "ws://134.209.82.213:8000";
  LIMIT = 25;

  getFile = async (fileName, extension) => {
    let res = await fetch(`${this._apiStatic}${fileName}.${extension}`);
    if (res.status !== 200) {
      return false;
    }
    return res;
  };

  getResource = async (url, options) => {
    let res = await fetch(url, options);
    if (res.status === 500) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getCaptcha = async () => {
    const res = await this.getResource(`${this._apiBase}captcha`);
    return res;
  };

  verifyCaptcha = async (id, text) => {
    const res = await this.getResource(
      `${this._apiBase}captcha/verify?id=${id}&text=${text}`
    );
    return res;
  };

  getRootComments = async (offset = 0, sortField = "id", sortType = "desc") => {
    sortField = sortField ? sortField : "id";
    sortType = sortType ? sortType : "desc";
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
    if (comment.file) {
      const fileString = await toBase64(comment.file);
      comment.file = fileString;
    }
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
