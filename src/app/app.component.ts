import { Component, VERSION, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RecaptchaLoaderService, RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  public version = VERSION.full;
  private lang = 'en';

  @ViewChild('regRec') 
  public recComp: RecaptchaComponent;

  constructor(
    @Inject(RecaptchaLoaderService) private loader: RecaptchaLoaderService,
  ) {
    loader.ready.subscribe((v) => {
      if (v) {
        this.recComp.reset();
        this.recComp.widgetId = undefined;
        this.recComp.grecaptchaRender();
      }
    })
  }

  public updateLanguage() {
    this.lang = this.lang === 'en' ? 'ru' : 'en';
    this.recComp.reset();
    this.recComp.widgetId = undefined;
    (this.loader as any).updateLanguage(this.lang);
  }
}
