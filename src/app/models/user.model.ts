export class User {
  static formatUser({ uid, name, email }): User {
    const user = new User(uid, name, email);
    return user;
  }
  constructor(public uid: string, public name: string, public email: string) {}
}
