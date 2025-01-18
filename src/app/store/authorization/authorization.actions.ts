export class SetAuthorization {
  static readonly type = '[Authorization] Authhorization Token';
  constructor(readonly payload: string) {}
}
