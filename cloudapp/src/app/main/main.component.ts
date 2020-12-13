import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { CloudAppEventsService, PageInfo, EntityType, CloudAppRestService, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { Bib, BibUtils, Field100 } from './bib-utils';


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
  running = false;
  mytest = "test";

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.bibUtils = new BibUtils(this.restService);
    this.pageLoad$ = this.eventsService.onPageLoad((pageInfo: PageInfo) => {
      console.log(pageInfo);
      const entities = (pageInfo.entities||[]).filter(e=>[EntityType.BIB_MMS, 'IEP', 'BIB'].includes(e.type));
      if (entities.length > 0) {
        this.bibUtils.getBib(entities[0].id).subscribe(bib=> {
          this.bib = (bib.record_format=='cnmarc') ? bib : null;
          if(this.bib){
            this.field100a = this.bibUtils.getField100a(this.bib);
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
    console.log(this.mytest,this.field100a);
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