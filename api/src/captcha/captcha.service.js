import CaptchaRepository from './captcha.repository.js';
import * as svgCaptcha from 'svg-captcha';

export default class CaptchaService {
  constructor() {
    this.captchaRepository = new CaptchaRepository();
  }

  async getCaptcha() {
    const captcha = svgCaptcha.create({ ignoreChars: '0o1i' });
    const res = await this.captchaRepository.save(captcha);
    captcha.id = res.id;
    return { id: res.id, data: captcha.data };
  }

  async verifyCaptcha(id, text) {
    const captcha = await this.captchaRepository.findById(Number(id));
    if (captcha.text === text) {
      return { success: true };
    }
    return { success: false };
  }
}
