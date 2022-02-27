import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading: boolean;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store$: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store$.select('ui').subscribe((ui) => {
      this.isLoading = ui.loading;
      console.log('isLoad', this.isLoading);
    });
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.store$.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Loading...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { username, email, password } = this.registerForm.value;
    this.authService
      .register(username, email, password)
      .then((credentials) => {
        // Swal.close();
        this.store$.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store$.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
}
