import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CloudAppEventsService, PageInfo, EntityType, CloudAppRestService, FormGroupUtil, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { Bib, BibUtils, Field100 } from './bib-utils';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private pageLoad$: Subscription;
  private bibUtils: BibUtils;
  bib: Bib;
  field100a: Field100;
  form: FormGroup;
  running = false;
  pubTypeCode = [
    { desc: '', value: ' ' },
    { desc: _('i18n.PubTypeCode.a'), value: 'a' },
    { desc: _('i18n.PubTypeCode.b'), value: 'b' },
    { desc: _('i18n.PubTypeCode.c'), value: 'c' },
    { desc: _('i18n.PubTypeCode.d'), value: 'd' },
    { desc: _('i18n.PubTypeCode.e'), value: 'e' },
    { desc: _('i18n.PubTypeCode.f'), value: 'f' },
    { desc: _('i18n.PubTypeCode.g'), value: 'g' },
    { desc: _('i18n.PubTypeCode.h'), value: 'h' },
    { desc: _('i18n.PubTypeCode.i'), value: 'i' },
    { desc: _('i18n.PubTypeCode.j'), value: 'j' },
    { desc: _('i18n.PubTypeCode.u'), value: 'u' }
  ];
  targetAudienceCode = [
    { desc: '', value: ' ' },
    { desc: _('i18n.TargetAudienceCode.a'), value: 'a' },
    { desc: _('i18n.TargetAudienceCode.b'), value: 'b' },
    { desc: _('i18n.TargetAudienceCode.c'), value: 'c' },
    { desc: _('i18n.TargetAudienceCode.d'), value: 'd' },
    { desc: _('i18n.TargetAudienceCode.e'), value: 'e' },
    { desc: _('i18n.TargetAudienceCode.k'), value: 'k' },
    { desc: _('i18n.TargetAudienceCode.m'), value: 'm' },
    { desc: _('i18n.TargetAudienceCode.u'), value: 'u' }
  ]

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private translate: TranslateService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.bibUtils = new BibUtils(this.restService);
    this.eventsService.getInitData().subscribe(data=> {
      console.log(this.translate.currentLang);
      this.translate.use(data.lang);
    });

    this.pageLoad$ = this.eventsService.onPageLoad((pageInfo: PageInfo) => {
      const entities = (pageInfo.entities||[]).filter(e=>[EntityType.BIB_MMS, 'IEP', 'BIB'].includes(e.type));
      if (entities.length > 0) {
        this.bibUtils.getBib(entities[0].id).subscribe(bib=> {
          this.bib = (bib.record_format=='cnmarc') ? bib : null;
          if(this.bib){
            this.field100a = this.bibUtils.getField100a(this.bib);
            this.form = FormGroupUtil.toFormGroup(this.field100a);
          }
        })
      } else {
        this.bib = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  test() {
    console.log(this.form.get("record_date_0_7").value, this.form.get("pub_type_8").value, this.field100a);
/*     if (!confirm(`Add a note to ${this.bib.mms_id}?`)) return;
    this.running = true;
    this.bib = this.bibUtils.addNoteToBib(this.bib);
    this.bibUtils.updateBib(this.bib).pipe(
      switchMap(res => this.eventsService.refreshPage()),
      tap(() => this.alert.success("Note added to Bib")),
      finalize(() => this.running=false)
    )
    .subscribe({
      error: e => this.alert.error(e.message)
    }); */
  }
}