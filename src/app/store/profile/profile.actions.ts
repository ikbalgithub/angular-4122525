export class Profile {
  static readonly type = '[Home/Register/Login] SetProfile';
  constructor(readonly payload: Shared.Profile|null) {}
}
