import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {User} from "../entities/user/user";
import {LoginDto} from "../entities/user/login-dto";
import {environment} from "../../../../../ComputerServiceAngular/src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_CONST = 'user';
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.USER_CONST)));
    this.user = this.userSubject.asObservable();
  }

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth`, loginDto)
      .pipe(map(token => {
        const user: User = this.extractUserFromPayload(token.accessToken);

        localStorage.setItem(this.USER_CONST, JSON.stringify(user));
        this.userSubject.next(user);

        return user;
      }));
  }

  extractUserFromPayload(accessToken: string): User {
    try {
      const payload: any = jwt_decode(accessToken);
      const newUser: User = new User();
      newUser.login = payload.sub;
      newUser.role = payload.role;
      newUser.accessToken = accessToken;
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.USER_CONST);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }
}
