export class SetProfile {
  static readonly type = '[Profile] Profile';
  constructor(readonly payload: Shared.Profile) {}
}
