import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleTranslateService {
  constructor() { }

  public languages = [
    {
      img: '/assets/flags/british-flag-small.gif',
      code: 'en',
      name: 'United Kingdom',
      search: 'GB',
    },
    
    {
      img: '/assets/flags/brazilian-flag-small.gif',
      code: 'pt',
      name: 'Brazil',
      search: 'BR',
    },
    {
      img: '/assets/flags/south-african-flag-small.gif',
      code: 'af',
      name: 'South Africa',
      search: 'ZA',
    },
    {
      img: '/assets/flags/vietnamese-flag-small.gif',
      code: 'vi',
      name: 'Vietnam',
      search: 'VN',
    },
    {
      img: '/assets/flags/thai-flag-small.gif',
      code: 'th',
      name: 'Thailand',
      search: 'TH',
    },
    {
      img: '/assets/flags/singaporean-flag-small.gif',
      code: 'ms',
      name: 'Singapore',
      search: 'SG',
    },
    {
      img: '/assets/flags/kenyan-flag-small.gif',
      code: 'sw',
      name: 'Kenya',
      search: 'KE',
    },
    {
      img: '/assets/flags/nigerian-flag-small.gif',
      code: 'en',
      name: 'Nigeria',
      search: 'NG',
    },
    {
      img: '/assets/flags/pakistani-flag-small.gif',
      code: 'ur',
      name: 'Pakistan',
      search: 'PK',
    },
    {
      img: '/assets/flags/filipino-flag-small.gif',
      code: 'tl',
      name: 'Philippines',
      search: 'PH',
    },
    {
      img: '/assets/flags/french-flag-small.gif',
      code: 'fr',
      name: 'France',
      search: 'FR',
    },
    {
      img: '/assets/flags/argentinian-flag-small.gif',
      code: 'es',
      name: 'Argentina',
      search: 'AR',
    },
    {
      img: '/assets/flags/turkish-flag-small.gif',
      code: 'tr',
      name: 'Turkey',
      search: 'TR',
    },
    {
      img: '/assets/flags/moroccan-flag-small.gif',
      code: 'ar',
      name: 'Morocco',
      search: 'MA',
    },
    {
      img: '/assets/flags/colombian-flag-small.gif',
      code: 'es',
      name: 'Colombia',
      search: 'CO',
    },
    {
      img: '/assets/flags/indonesian-flag-small.gif',
      code: 'id',
      name: 'Indonesia',
      search: 'ID',
    },
  ];

  loadGoogleTranslate() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }

  initGoogleTranslate() {
    let pageLanguages: Array<string> = [];
    this.languages.forEach((language) => {
      pageLanguages.push(language.code);
    });
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: pageLanguages[0],
        includedLanguages: pageLanguages.join(','),
        autoDisplay: false,
        layout: (window as any).google.translate.TranslateElement.InlineLayout
          .HORIZONTAL,
      },
      'google_translate_element'
    );
    this.setBodyStyle();
  }

  selectLanguage(language: string) {
    const selectElement: any = document.querySelector(`.goog-te-combo`);
    if (selectElement) {
      selectElement.value = language;
      const event = new Event('change');
      selectElement.dispatchEvent(event);
    }
    this.setBodyStyle();
  }

  setBodyStyle() {
    var bodyElement = document.getElementById('body');
    if (bodyElement) {
      bodyElement.removeAttribute('style');
    }
  }
}
