export class KavenegarApi {
  static readonly baseUrl = 'https://api.kavenegar.com';
  static readonly VERIFY = {
    httpMethod: 'POST',
    action: 'verify',
    method: 'lookup',
  };
  static readonly version = 'v1';
  static readonly port = 443;
  static readonly contentTypeHeader =
    'application/x-www-form-urlencoded; charset=UTF-8';

  static verifyRequestPath(
    apiKey: string,
    receptor: string,
    token: string,
    template: string,
  ) {
    return `${this.baseUrl}/${this.version}/${apiKey}/${this.VERIFY.action}/${this.VERIFY.method}.json?receptor=${receptor}&token=${token}&template=${template}`;
  }
}
