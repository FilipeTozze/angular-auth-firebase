import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, throwError, Observable, of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<
    User
  > = this.afs.collection('users');

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  register(user: User) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
    ).pipe(
      switchMap((u: firebase.auth.UserCredential) =>
        this.userCollection
          .doc(u.user.uid)
          .set({
            ...user,
            id: u.user.uid,
          })
          .then(() => true)
      ),
      catchError((err) => throwError(err))
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((u: firebase.auth.UserCredential) =>
        this.userCollection.doc<User>(u.user.uid).valueChanges()
      ),
      catchError(() =>
        throwError('Credenciais inválidas ou usuário não regitrado')
      )
    );
  }

  logout() {
    this.afAuth.signOut();
  }

  getUser(): Observable<User> {
    return this.afAuth.authState.pipe(
      switchMap((u) =>
        u ? this.userCollection.doc<User>(u.uid).valueChanges() : of(null)
      )
    );
  }

  authenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map((u) => (u ? true : false)));
  }

  async updateUserDate(user: auth.UserCredential) {
    try {
      const newUser: User = {
        firstName: user.user.displayName,
        lastName: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        mobilePhone: '',
        email: user.user.email,
        id: user.user.uid,
      };

      await this.userCollection
        .doc(user.user.uid)
        .set(newUser)
        .then(() => newUser);
      return newUser;
    } catch (e) {
      throw new Error(e);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new auth.GoogleAuthProvider();
      let credentials: auth.UserCredential = await this.afAuth.signInWithPopup(
        provider
      );
      let user: User = await this.updateUserDate(credentials);
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  loginGoogle(): Observable<User> {
    return from(this.loginWithGoogle());
  }
}
