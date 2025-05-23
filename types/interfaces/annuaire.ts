export interface Adresse {
  pays: string;
  ville: string;
  commune?: string;
  code_postal?: string;
  rue?: string;
  numero?: number;
  boite?: number;
}

export interface RecordId {
  tb: string;
  id: string | { String: string } | object;
}


export interface Eglise {
  id: RecordId;
  nom: string;
  adresse: Adresse;
  description?: string;
}

export interface AnnuaireSearch {
  id: RecordId;
  nom: string;
  photo?: string;
  prenom: string;
  langues: string[];
  professions: Profession[];
}

export interface Profession {
  domaine?: string;
  titre?: string;
  fonction?: string;
}

// Import types from annuaire-register for structure reference if needed
// import {
//   PersonnelData as FormPersonnelData,
//   EgliseData as FormEgliseData,
//   Education as FormEducation,
// } from "./annuaire-register";


export interface UserPersonnelData {
  nom: string;
  prenom: string;
  genre: string; 
  email: string;
  consentement_email: boolean;
  photo?: string | null;
  gsm: string;
  consentement_gsm: boolean;
  residence: {
    pays: string;
    ville: string;
  };
  langues: string[];
}


export interface UserEgliseData {
  eglise: string;
  star: boolean;
  departements: string[];
}


export interface UserEducationData {
  domaine: string;
  titre: string;
  specialite?: string | null;
}


export interface UserProfessionData {
  domaine: string;
  titre: string;
  fonction?: string | null; 
}


export interface UserProfessionnelData {
  educations: UserEducationData[];
  professions: UserProfessionData[];
  diplomes: Array<{ nom: string }>;
  certifications: Array<{ nom: string | null }>; 
  competences: Array<{ nom: string }>;
}


export interface UserRecord {
  id: RecordId; 
  personnel: UserPersonnelData;
  eglise: UserEgliseData;
  professionnel: UserProfessionnelData;
}


export interface UserDataResponse {
  data: UserRecord[];
}

export const getId = (input: any): string => {
  if (!input) return "";
  if (typeof input === "string") return input;
  if (typeof input === "object") {
    if ("String" in input) return input.String;
    try {
      const v = JSON.stringify(input);
      const trim = v.replace('{"String":"', "");
      return trim.replace('"}', "");
    } catch (error) {
      console.error("Error parsing ID:", error);
      return String(input);
    }
  }
  return String(input);
};

export interface RegisterFormDataResult {
  id: RecordId;
  personnel: PersonnelData;
  eglise: EgliseData;
  professionnel: ProfessionnelData;
}

export interface PersonnelData {
  nom: string;
  prenom: string;
  genre: string;
  email: string;
  consentement_email: boolean;
  photo?: string;
  gsm: string;
  consentement_gsm: boolean;
  residence: Residence;
  langues: string[];
}

export interface Residence {
  pays: string;
  ville: string;
}

export interface EgliseData {
  eglise: string;
  star: boolean;
  departements: string[];
}

export interface ProfessionnelData {
  educations: Education[];
  professions: Profession[];
  diplomes: Diplome[];
  certifications: Certification[];
  competences: Competence[];
}

export interface Education {
  domaine: string;
  titre: string;
  specialite: string;
}

export interface Diplome {
  nom: string;
}

export interface Certification {
  nom: string;
}

export interface Competence {
  nom: string;
}

export const defaultPersonnelData: PersonnelData = {
  nom: "",
  prenom: "",
  genre: "",
  email: "",
  consentement_email: false,
  photo: "",
  gsm: "",
  consentement_gsm: false,
  residence: {
    pays: "",
    ville: "",
  },
  langues: [],
};

export const defaultProfessionnelData = {
  educations: [
    {
      domaine: "",
      titre: "",
      specialite: "",
    },
  ],
  professions: [
    {
      domaine: "",
      titre: "",
      fonction: "",
    },
  ],
  diplomes: [
    {
      nom: "",
    },
  ],
  certifications: [
    {
      nom: "",
    },
  ],
  competences: [
    {
      nom: "",
    },
  ],
};

export const defaultEgliseData = {
  eglise: "",
  star: false,
  departements: [],
};

export const defaultRegisterFormData = {
  personnel: defaultPersonnelData,
  eglise: defaultEgliseData,
  professionnel: defaultProfessionnelData,
};

export const defaultRegisterFormDataResult = {
  id: {
    tb: "",
    id: "",
  },
  personnel: defaultPersonnelData,
  eglise: defaultEgliseData,
  professionnel: defaultProfessionnelData,
};
