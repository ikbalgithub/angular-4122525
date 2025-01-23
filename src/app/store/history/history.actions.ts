export class AddHistory {
  static readonly type = '[Message] AddHistory';
  constructor(readonly payload: Ngxs.History) {}
}

export class EditHistory {
  static readonly type = '[Message] EditHistory';
  constructor(readonly payload: {f:string,m:Message.Last}) {}
}