import { Routes } from '@angular/router';
import { RoomList } from './components/room-list/room-list';
import { AddRoom } from './components/add-room/add-room';
import { EditRoom } from './components/edit-room/edit-room';
import { TenantList } from './components/tenant-list/tenant-list';
import { AddTenant } from './components/add-tenant/add-tenant';
import { EditTenant } from './components/edit-tenant/edit-tenant';
import { AssignRoom } from './components/assign-room/assign-room';
import { Dashboard } from './components/dashboard/dashboard';
import { AddExpense } from './components/add-expense/add-expense';
import { ExpenseList } from './components/expense-list/expense-list';
import { EditExpense } from './components/edit-expense/edit-expense';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import { AuthGuard } from './guards/auth-guard-guard';
import { LayoutComponent } from './components/layout/layout';
import { TenantChat } from './components/tenant-chat/tenant-chat';
import { UserDashboard } from './components/user-dashboard/user-dashboard';
import { LandingPage } from './components/landing-page/landing-page';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'signup', component: SignUp },
    { path: 'login', component: Login },
    {
        path: '',
        component: LayoutComponent,
        children: [

            { path: 'room-list', component: RoomList, canActivate: [AuthGuard] },
            { path: 'add-room', component: AddRoom, canActivate: [AuthGuard] },
            { path: 'edit-room/:id', component: EditRoom, canActivate: [AuthGuard] },
            { path: 'assign-room/:tenantId', component: AssignRoom, canActivate: [AuthGuard] },

            { path: 'add-tenant', component: AddTenant, canActivate: [AuthGuard] },
            { path: 'tenant-list', component: TenantList, canActivate: [AuthGuard] },
            { path: 'edit-tenant/:id', component: EditTenant, canActivate: [AuthGuard] },

            { path: 'add-expense', component: AddExpense, canActivate: [AuthGuard] },
            { path: 'expense-list', component: ExpenseList, canActivate: [AuthGuard] },
            { path: 'edit-expense/:id', component: EditExpense, canActivate: [AuthGuard] },

            { path: 'user-dashboard', component: UserDashboard, canActivate: [AuthGuard] },

            { path: 'tenant-chat', component: TenantChat, canActivate: [AuthGuard] },

            { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] }
        ]
    },
];
