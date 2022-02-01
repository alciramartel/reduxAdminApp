import { Routes } from '@angular/router';
import { DetailsComponent } from '../income-expenses/details/details.component';
import { StatisticsComponent } from '../income-expenses/statistics/statistics.component';
import { IncomeExpensesComponent } from '../income-expenses/income-expenses.component';

export const dashboardRoutes: Routes = [
  { path: '', component: StatisticsComponent },
  { path: 'income-expenses', component: IncomeExpensesComponent },
  { path: 'details', component: DetailsComponent },
];
