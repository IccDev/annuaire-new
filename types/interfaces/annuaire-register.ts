export type Maybe<T> = T | null | undefined;

export type PersonnelData = {
  nom: string;
  prenom: string;
  genre: string;
  email: string;
  consentement_email: boolean;
  photo?: string;
  gsm: string;
  consentement_gsm: boolean;
  residence: {
    pays: string;
    ville: string;
  };
  langues: string[];
};

export type ZodPersonnelData = {
  nom?: Maybe<string>;
  prenom?: Maybe<string>;
  genre?: Maybe<string>;
  email?: Maybe<string>;
  consentement_email?: Maybe<boolean>;
  photo?: Maybe<string>;
  gsm?: Maybe<string>;
  consentement_gsm?: Maybe<boolean>;
  residence?: Maybe<{
    pays?: Maybe<string>;
    ville?: Maybe<string>;
  }>;
  langues?: Maybe<string[]>;
};

export type EgliseData = {
  eglise: string;
  star: boolean;
  departements: string[];
};

export type ZodEgliseData = {
  eglise?: Maybe<string>;
  star?: Maybe<boolean>;
  departements?: Maybe<string[]>;
};

export type ProfessionnelData = {
  educations: Education[];
  professions: Profession[];
  diplomes: {
    nom: string;
  }[];
  certifications: {
    nom: string;
  }[];
  competences: {
    nom: string;
  }[];
};

export type Education = {
  domaine: string;
  titre: string;
  specialite: string;
};

export type Profession = {
  domaine: string;
  titre: string;
  fonction: string;
};

export type ZodEducation = {
  domaine?: Maybe<string>;
  titre?: Maybe<string>;
  specialite?: Maybe<string>;
};

export type ZodProfession = {
  domaine?: Maybe<string>;
  titre?: Maybe<string>;
  fonction?: Maybe<string>;
};

export type ZodProfessionnelData = {
  educations?: Maybe<Maybe<ZodEducation>[]>;
  professions?: Maybe<Maybe<ZodProfession>[]>;
  diplomes?: Maybe<
    Maybe<{
      nom?: Maybe<string>;
    }>[]
  >;
  certifications?: Maybe<
    Maybe<{
      nom?: Maybe<string>;
    }>[]
  >;
  competences?: Maybe<
    Maybe<{
      nom?: Maybe<string>;
    }>[]
  >;
};

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

export const defaultEgliseData: EgliseData = {
  eglise: "",
  star: false,
  departements: [] as string[],
};

export const defaultRegisterFormData = {
  personnel: defaultPersonnelData,
  eglise: defaultEgliseData,
  professionnel: defaultProfessionnelData,
};

export const get_personnel = (pers: ZodPersonnelData): PersonnelData => {
  return {
    nom: pers.nom || "",
    prenom: pers.prenom || "",
    genre: pers.genre || "",
    email: pers.email || "",
    consentement_email: Boolean(pers.consentement_email),
    photo: pers.photo || "",
    gsm: pers.gsm || "",
    consentement_gsm: Boolean(pers.consentement_gsm),
    residence: {
      pays: pers.residence?.pays || "",
      ville: pers.residence?.ville || "",
    },
    langues: pers.langues || [],
  };
};

export const get_eglise = (egl: ZodEgliseData): EgliseData => {
  return {
    eglise: egl.eglise || "",
    star: egl.star === true ? true : false,
    departements: egl.departements || [],
  };
};

export const get_professionnel = (
  pro: ZodProfessionnelData
): ProfessionnelData => {
  return {
    educations: pro.educations?.filter(d => d && (d.domaine || d.titre || d.specialite)).map((d) => ({
      domaine: d?.domaine || "",
      titre: d?.titre || "",
      specialite: d?.specialite || "",
    })) || [],
    professions: pro.professions?.filter(d => d && (d.domaine || d.titre || d.fonction)).map((d) => ({
      domaine: d?.domaine || "",
      titre: d?.titre || "",
      fonction: d?.fonction || "",
    })) || [],
    diplomes: pro.diplomes?.filter(d => d && d.nom).map((d) => ({
      nom: d?.nom || "",
    })) || [],
    certifications: pro.certifications?.filter(d => d && d.nom).map((d) => ({
      nom: d?.nom || "",
    })) || [],
    competences: pro.competences?.filter(d => d && d.nom).map((d) => ({
      nom: d?.nom || "",
    })) || [],
  };
};

export const user_status = [
  "Indépendant",
  "Employé",
  "Etudiant ",
  "A la recherche",
];

export const domaines = [
  "Administration et Législation",
  "Bâtiment et Construction",
  "Communication",
  "Culture",
  "Economie et Gestion",
  "Environnement et Nature",
  "Hôtellerie et Alimentation",
  "Informatique et Télécommunication",
  "Santé et Bien être",
  "Sciences",
  "Sciences humaines et sociales",
  "Sécurité",
  "Technique et Industrie",
  "Tourisme , Sport et Loisir",
  "Transport et Logistique",
];

export type RegisterFormData = {
  personnel: PersonnelData;
  eglise: EgliseData;
  professionnel: ProfessionnelData;
};

export type RegisterFormDataResult = {
  id: {
    tb: string;
    id: string;
  };
  personnel: PersonnelData;
  eglise: EgliseData;
  professionnel: ProfessionnelData;
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

export const departements = [
  "Accueil et Placeurs",
  "MCP",
  "BiblioStar",
  "Call Center",
  "CCP",
  "CCB",
  "CVM",
  "Département Administratif et Juridique",
  "DSI",
  "DCE",
  "DTI",
  "DTM",
  "DVA",
  "EDL",
  "Entretien & Décoration",
  "GVIE",
  "MGI",
  "MCP",
  "Impact Ados",
  "Impact Junior",
  "MIS",
  "Impact Célébration",
  "Impact Santé",
  "Intégration",
  "Librairie Métanoïa",
  "Maintenance & Logistique",
  "MCDE",
  "MDIP",
  "Ministère de la Famille",
  "MEBF",
  "MLR",
  "MOS",
  "Ministère des Célibataires",
  "MFI",
  "MFBC",
  "MHI",
  "MJIB",
  "MRH",
  "Impact Social",
  "MCG",
  "On est Ensemble",
  "PCNC",
  "PCC",
  "Protocole",
  "Radio Direct Impact",
  "Restauration",
  "Secrétariat",
  "SPM",
  "Service Nurserie",
  "Service ZOOM",
  "Soins Pastoraux",
  "IEBI",
];
