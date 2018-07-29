import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '../assets/toggleHamburger.js';
import { AppModule } from './app/app.module.js';
import { environment } from './environments/environment.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
