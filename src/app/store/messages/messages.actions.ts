export class Messages{
  static readonly type = '[Messages] SetMessages';
  constructor(readonly payload:Message.M) {}
}

export class SelectX{
  static readonly type = '[Messages] SetMessages';
  constructor(readonly payload:string) {}
}