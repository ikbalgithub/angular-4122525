export class Messages{
  static readonly type = '[Messages] SetMessages';
  constructor(readonly payload:Message.M[]) {}
}