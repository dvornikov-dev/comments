import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

class TokenService {
  generateToken(payload) {
    const accessToken = sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '15m',
    });
    return {
      accessToken,
    };
  }

  async validateAccessToken(accessToken) {
    try {
      return verify(accessToken, process.env.ACCESS_SECRET_KEY);
    } catch (e) {
      return null;
    }
  }
}

export default TokenService;
