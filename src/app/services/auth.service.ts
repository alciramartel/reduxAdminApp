import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store$: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fbUser) => {
      if (fbUser) {
        this.userSubscription = this.firestore
          .doc(`${fbUser.uid}/user`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = User.formatUser(firestoreUser);
            this.store$.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userSubscription.unsubscribe();
        this.store$.dispatch(authActions.unsetUser());
      }
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
