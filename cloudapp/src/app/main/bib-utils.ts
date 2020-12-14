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
  charset_26_29:string;
  supp_charset_30_33:string;
  title_lang_34_35:string;
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
            _f = this.parse100a(subfield.textContent);          
          }
        });
      }
   });
   return _f;
  }

  private parse100a(textContent: string): Field100 {
    var _f : Field100 = {
      record_date_0_7 :textContent.substr(0,8),
      pub_type_8 :textContent.substr(8,1),
      pub_year1_9_12 :textContent.substr(9,4),
      pub_year2_13_16 :textContent.substr(13,4),
      reader_17:textContent.substr(17,1),
      reader_18:textContent.substr(18,1),
      reader_19:textContent.substr(19,1),
      gov_code_20 :textContent.substr(20,1),
      modified_21 :textContent.substr(21,1),
      cata_lang_22_24 :textContent.substr(22,3),
      tran_code_25 :textContent.substr(25,1),
      charset_26_29 :textContent.substr(26,4),
      supp_charset_30_33 :textContent.substr(30,4),
      title_lang_34_35: textContent.substr(34,2)
    };
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

  /** Adds a 500 note field to a MARC21 Bibliographic Record */
  addNoteToBib(bib: Bib) {
    const doc = new DOMParser().parseFromString(bib.anies, "application/xml");
    const datafield = dom("datafield", { 
      parent: doc.documentElement, 
      attributes: [ ["tag", "500"], ["ind1", " "], ["ind2", " "] ]
    });
    dom("subfield", { 
      parent: datafield, 
      text: `Record processed at ${(new Date()).toLocaleString()}`, 
      attributes: [ ["code", "a"] ]
    });
    bib.anies = new XMLSerializer().serializeToString(doc.documentElement);
    return bib;
  }   
}

/** Adds Element to dom and returns it */
const dom = (name: string, options: {parent?: Element | Node, text?: 
  string, className?: string, id?: string, attributes?: string[][]} = {}
  ): Element => {

  let ns = options.parent ? options.parent.namespaceURI : '';
  let element = document.createElementNS(ns, name);

  if (options.parent) options.parent.appendChild(element);
  if (options.text) element.innerHTML = options.text;
  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.attributes) options.attributes.forEach(([att, val]) => element.setAttribute(att, val));

  return element;  
}