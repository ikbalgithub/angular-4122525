export class Authorization {
  static readonly type = '[Home/Register/Login] SetAuthorization';
  constructor(readonly payload: string|null) {}
}
