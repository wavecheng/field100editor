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
  ];
  GovPubCode = [
    { desc: '', value: ' ' },
    { desc: _('i18n.GovPubCode.a'), value: 'a' },
    { desc: _('i18n.GovPubCode.b'), value: 'b' },
    { desc: _('i18n.GovPubCode.c'), value: 'c' },
    { desc: _('i18n.GovPubCode.d'), value: 'd' },
    { desc: _('i18n.GovPubCode.e'), value: 'e' },
    { desc: _('i18n.GovPubCode.f'), value: 'f' },
    { desc: _('i18n.GovPubCode.g'), value: 'g' },
    { desc: _('i18n.GovPubCode.h'), value: 'h' },
    { desc: _('i18n.GovPubCode.u'), value: 'u' },
    { desc: _('i18n.GovPubCode.y'), value: 'y' },
    { desc: _('i18n.GovPubCode.z'), value: 'z' }     
  ]
  ModifiedCode = [
    { desc: '', value: ' ' },
    { desc: _('i18n.ModifiedCode.zero'), value: '0' },
    { desc: _('i18n.ModifiedCode.one'), value: '1' }, 
  ];

  TransliterationCode = [
    { desc: '', value: ' ' },
    { desc: _('i18n.TransliterationCode.a'), value: 'a' },
    { desc: _('i18n.TransliterationCode.b'), value: 'b' },
    { desc: _('i18n.TransliterationCode.c'), value: 'c' },
    { desc: _('i18n.TransliterationCode.y'), value: 'y' },
  ];

  CharacterSet = [
    { desc: '', value: ' ' },
    { desc: _('i18n.CharacterSet.c01'), value: '01' },
    { desc: _('i18n.CharacterSet.c02'), value: '02' },
    { desc: _('i18n.CharacterSet.c03'), value: '03' },
    { desc: _('i18n.CharacterSet.c04'), value: '04' },
    { desc: _('i18n.CharacterSet.c05'), value: '05' },
    { desc: _('i18n.CharacterSet.c06'), value: '06' },
    { desc: _('i18n.CharacterSet.c07'), value: '07' },
    { desc: _('i18n.CharacterSet.c08'), value: '08' },
    { desc: _('i18n.CharacterSet.c09'), value: '09' },
    { desc: _('i18n.CharacterSet.c10'), value: '10' },
    { desc: _('i18n.CharacterSet.c11'), value: '11' },
    { desc: _('i18n.CharacterSet.c20'), value: '20' },
    { desc: _('i18n.CharacterSet.c21'), value: '21' },
    { desc: _('i18n.CharacterSet.c50'), value: '50' }      
  ];

  ScriptCode = [
    { desc: '', value: ' ' },
    { desc: _('i18n.ScriptCode.ba'), value: 'ba' },
    { desc: _('i18n.ScriptCode.ca'), value: 'ca' },
    { desc: _('i18n.ScriptCode.da'), value: 'da' },
    { desc: _('i18n.ScriptCode.db'), value: 'db' },
    { desc: _('i18n.ScriptCode.dc'), value: 'dc' },
    { desc: _('i18n.ScriptCode.ea'), value: 'ea' },
    { desc: _('i18n.ScriptCode.fa'), value: 'fa' },
    { desc: _('i18n.ScriptCode.ga'), value: 'ga' },
    { desc: _('i18n.ScriptCode.ha'), value: 'ha' },
    { desc: _('i18n.ScriptCode.ia'), value: 'ia' },
    { desc: _('i18n.ScriptCode.ja'), value: 'ja' },
    { desc: _('i18n.ScriptCode.ka'), value: 'ka' },
    { desc: _('i18n.ScriptCode.la'), value: 'la' },
    { desc: _('i18n.ScriptCode.ma'), value: 'ma' },
    { desc: _('i18n.ScriptCode.mb'), value: 'mb' },
    { desc: _('i18n.ScriptCode.zz'), value: 'zz' }  
  ];

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