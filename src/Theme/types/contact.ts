export interface ContactResponse {
  contact: Contact;
  recaptchaSetting: recaptchaSetting;
  seoSetting: seoSetting;
}


export interface Contact   {
    id: number;
     title :  string;
     description :  string;
     address :  string;
     phone :  number;
     map :  string ;
     email:string;
     created_at : string ;
     updated_at :  string;
}

export interface recaptchaSetting {
  id: number;
  site_key: string;
  secret_key: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export
interface seoSetting  {
    id : number;
    page_name : string ;
    seo_title : string;
    seo_description :  string;
    created_at : string;
    updated_at :  string; 
}
