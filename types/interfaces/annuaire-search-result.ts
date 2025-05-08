export type AnnuaireSearchResult = {
    id: {
      tb: string;
      id: string;
    };
    nom: string;
    photo?: string;
    prenom: string;
    langues: string[];
    professions: {
      domaine?: string;
      titre?: string;
    }[];
  };
  
  export type AnnuaireContactResult = {
    nom: string;
    prenom: string;
    email: string;
  };
  
  export const defaultAnnuaireContactResult = {
    nom: '',
    prenom: '',
    email: ''
  };
  