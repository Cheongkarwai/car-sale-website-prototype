export interface Account{
  username:string;
  full_name:string;
  contact_number:string;
  authorities:GrantedAuthority[];
}

export interface GrantedAuthority{
  authority:string;
}
