import { CloudAppRestService, HttpMethod } from "@exlibris/exl-cloudapp-angular-lib";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Bib {
  link: string,
  mms_id: string;
  title: string;
  author: string;
  record_format: string;
  anies: any;
}

export class Field100 {
  record_date_0_7: string;
  pub_type_8:string;
  pub_year1_9_12: string;
  pub_year2_13_16: string;
  reader_17: string;
  reader_18: string;
  reader_19: string;
  gov_code_20: string;
  modified_21: string;
  cata_lang_22_24: string;
  tran_code_25:string;
  charset_26_27:string;
  charset_28_29:string;
  supp_charset_30_33:string;
  title_lang_34_35:string;

  parse(textContent: string): Field100 {
    this.record_date_0_7= textContent.substr(0,8);
    this.pub_type_8 = textContent.substr(8,1);
    this.pub_year1_9_12 = textContent.substr(9,4);
    this.pub_year2_13_16 = textContent.substr(13,4);
    this.reader_17=textContent.substr(17,1);
    this.reader_18=textContent.substr(18,1);
    this.reader_19=textContent.substr(19,1);
    this.gov_code_20 =textContent.substr(20,1);
    this.modified_21 =textContent.substr(21,1);
    this.cata_lang_22_24 =textContent.substr(22,3);
    this.tran_code_25 =textContent.substr(25,1);
    this.charset_26_27 =textContent.substr(26,2);
    this.charset_28_29 =textContent.substr(28,2);
    this.supp_charset_30_33 =textContent.substr(30,4);
    this.title_lang_34_35= textContent.substr(34,2);
    return this;
  }

  toString():string {
    return this.record_date_0_7 + this.pub_type_8 + this.pub_year1_9_12 + this.pub_year2_13_16 + this.reader_17 
     + this.reader_18 + this.reader_19 + this.gov_code_20 + this.modified_21
     + this.cata_lang_22_24 + this.tran_code_25  + this. charset_26_27  
     + this. charset_28_29  + this. supp_charset_30_33  + this. title_lang_34_35;
  }
}

export class BibUtils {
  private _restService: CloudAppRestService;

  constructor(restService: CloudAppRestService) {
    this._restService = restService;
  }

  /** Retrieve a single BIB record */
  getBib (mmsId: string): Observable<Bib> {
    return this._restService.call(`/bibs/${mmsId}`);
  }   

  getField100a(bib: Bib) : Field100 {
    const doc = new DOMParser().parseFromString(bib.anies, "application/xml");
    let _f : Field100;
    Array.from(doc.getElementsByTagName("datafield")).forEach( datafield => {
      if( "100" == datafield.getAttribute("tag")) {
        Array.from(datafield.getElementsByTagName("subfield")).forEach(subfield => {
          if("a" == subfield.getAttribute("code")){
            _f = new Field100().parse(subfield.textContent);          
          }
        });
      }
   });
   return _f;
  }

  /** Update a BIB record with the specified MARCXML */
  updateBib( bib: Bib ): Observable<Bib> {
    return this._restService.call( {
      url: `/bibs/${bib.mms_id}`,
      headers: { 
        "Content-Type": "application/xml",
        Accept: "application/json" },
      requestBody: `<bib>${bib.anies}</bib>`,
      method: HttpMethod.PUT
    });
  }    

  /** Update 100a field content to Bibliographic Record */
  updateBibField100aContent(bib: Bib, _100aContent:string ) {
    const doc = new DOMParser().parseFromString(bib.anies, "application/xml");
    Array.from(doc.getElementsByTagName("datafield")).forEach( datafield => {
      if( "100" == datafield.getAttribute("tag")) {
        Array.from(datafield.getElementsByTagName("subfield")).forEach(subfield => {
          if("a" == subfield.getAttribute("code")){
            subfield.textContent = _100aContent;         
          }
        });
      }
   });
    bib.anies = new XMLSerializer().serializeToString(doc.documentElement);
    return bib;
  }   
}
