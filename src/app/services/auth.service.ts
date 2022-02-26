import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      console.log(fuser);
    });
  }

  public register(user: string, email: string, password: string): Promise<any> {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((fbUser) => {
        const newUser = new User(fbUser.user.uid, user, email);
        return this.firestore
          .doc(`${fbUser.user.uid}/user`)
          .set({ ...newUser });
      });
  }

  public login(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public signOut() {
    return this.auth.signOut();
  }

  public isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser !== null));
  }
}
