import './polyfills';

import { enableProdMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { AppModule } from './app/app.module';

import { RecaptchaLoaderService, RecaptchaComponent } from 'ng-recaptcha';


RecaptchaLoaderService.prototype.scriptIdCounter = 1;
RecaptchaLoaderService.prototype.updateLanguage = function (newLang) {
  console.log(`updateLanguage(${newLang})`);
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }
  delete window.grecaptcha;

  this.language = newLang;
  RecaptchaLoaderService.ready.next(null);

  this.init();
}

RecaptchaLoaderService.prototype.init = function() {
  console.log(`init`);
    if (RecaptchaLoaderService.ready) {
      if (RecaptchaLoaderService.ready.getValue()) {
        return;
      }
    } else {
      RecaptchaLoaderService.ready = new BehaviorSubject<any>(null);
    }
    
    if (isPlatformBrowser(this.platformId)) {
      window.ng2recaptchaloaded = () => {
  console.log(`ng2recaptchaloaded`);
        RecaptchaLoaderService.ready.next(window.grecaptcha);
      };
      const curScript = document.getElementById(`rec-${this.scriptIdCounter}`);
      if (curScript) {
        curScript.parentElement.removeChild(curScript);
      }
      this.scriptIdCounter++;
      const script = document.createElement('script') as HTMLScriptElement;
      script.id = `rec-${this.scriptIdCounter}`;
      script.innerHTML = '';
      const langParam = this.language ? '&hl=' + this.language : '';
      const baseUrl = this.baseUrl || 'https://www.google.com/recaptcha/api.js';
      script.src = `${baseUrl}?render=explicit&onload=ng2recaptchaloaded${langParam}`;
      if (this.nonce) {
        // tslint:disable-next-line:no-any Remove "any" cast once we upgrade Angular to 7 and TypeScript along with it
        (script as any).nonce = this.nonce;
      }
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
}

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherwise, log the boot error
  // 
}).catch(err => console.error(err));