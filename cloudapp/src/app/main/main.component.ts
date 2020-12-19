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
  formChanged = false;

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
    { desc: _('i18n.CharacterSet.c50'), value: '50' },
    { desc: _('i18n.CharacterSet.c21'), value: '21' },  
    { desc: _('i18n.CharacterSet.c20'), value: '20' },
    { desc: _('i18n.CharacterSet.c11'), value: '11' },
    { desc: _('i18n.CharacterSet.c10'), value: '10' },
    { desc: _('i18n.CharacterSet.c09'), value: '09' },
    { desc: _('i18n.CharacterSet.c08'), value: '08' },
    { desc: _('i18n.CharacterSet.c07'), value: '07' },
    { desc: _('i18n.CharacterSet.c06'), value: '06' },
    { desc: _('i18n.CharacterSet.c05'), value: '05' },
    { desc: _('i18n.CharacterSet.c04'), value: '04' },
    { desc: _('i18n.CharacterSet.c03'), value: '03' },
    { desc: _('i18n.CharacterSet.c02'), value: '02' },
    { desc: _('i18n.CharacterSet.c01'), value: '01' }
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
      this.translate.use(data.lang);
    });

    this.pageLoad$ = this.eventsService.onPageLoad((pageInfo: PageInfo) => {
      const entities = (pageInfo.entities||[]).filter(e=>[EntityType.BIB_MMS, 'IEP', 'BIB'].includes(e.type));
      if (entities.length > 0) {
        this.bibUtils.getBib(entities[0].id).subscribe(bib=> {
          this.bib = (bib.record_format=='cnmarc' || bib.record_format == 'unimarc') ? bib : null;
          if(this.bib){
            this.formChanged = false;
            this.field100a = this.bibUtils.getField100a(this.bib);
            this.form = FormGroupUtil.toFormGroup(this.field100a);
            this.form.valueChanges.subscribe(data => this.formChanged = true);
          }
        })
      } else {
        this.bib = null;
        this.form = null;       
      }
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  updateField100() {
    this.field100a.record_date_0_7 = this.form.get("record_date_0_7").value;
    this.field100a.pub_type_8 = this.form.get("pub_type_8").value;
    this.field100a.pub_year1_9_12 = this.form.get("pub_year1_9_12").value;
    this.field100a.pub_year2_13_16 = this.form.get("pub_year2_13_16").value;
    this.field100a.reader_17 = this.form.get("reader_17").value;
    this.field100a.reader_18 = this.form.get("reader_18").value;
    this.field100a.reader_19 = this.form.get("reader_19").value;
    this.field100a.gov_code_20 = this.form.get("gov_code_20").value;
    this.field100a.modified_21 = this.form.get("modified_21").value;
    this.field100a.cata_lang_22_24 = this.form.get("cata_lang_22_24").value;
    this.field100a.tran_code_25 = this.form.get("tran_code_25").value;
    this.field100a.charset_26_27 = this.form.get("charset_26_27").value;
    this.field100a.charset_28_29 = this.form.get("charset_28_29").value;
    this.field100a.supp_charset_30_33 = this.form.get("supp_charset_30_33").value;
    this.field100a.title_lang_34_35 = this.form.get("title_lang_34_35").value;

    if (!confirm(this.translate.instant('i18n.UpdateConfirm',{title:this.bib.title, mmid: this.bib.mms_id }))) return;
    this.running = true;
    this.bib = this.bibUtils.updateBibField100aContent(this.bib, this.field100a.toString());
    this.bibUtils.updateBib(this.bib).pipe(
      switchMap(res => this.eventsService.refreshPage()),
      tap(() => this.alert.success(this.translate.instant('i18n.UpdateSuccess'))),
      finalize(() => this.running=false)
    )
    .subscribe({
      error: e => this.alert.error(e.message)
    });
  }
}