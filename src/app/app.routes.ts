import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  {
    path: 'upload',
    loadComponent: () => import('./upload/upload.page').then(m => m.UploadPage)
  },
  {
    path: 'split-settings',
    loadComponent: () => import('./split-settings/split-settings.page').then(m => m.SplitSettingsPage)
  },
  {
    path: 'preview',
    loadComponent: () => import('./preview/preview.page').then(m => m.PreviewPage)
  },
  {
    path: 'result',
    loadComponent: () => import('./result/result.page').then(m => m.ResultPage)
  },
];
