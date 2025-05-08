export type Maybe<T> = T | null | undefined;

export type AnnuaireUserContact = {
  nom: Maybe<string>;
  prenom: Maybe<string>;
  gsm: Maybe<string>;
  email: Maybe<string>;
  msg: Maybe<string>;
};

export type AnnuaireUserUpdate = {
  email: Maybe<string>;
};

export type ZodAnnuaireUserContact = {
  nom?: Maybe<string>;
  prenom?: Maybe<string>;
  gsm?: Maybe<string>;
  email?: Maybe<string>;
  msg?: Maybe<string>;
};

export type ZodAnnuaireUserUpdate = {
  email?: Maybe<string>;
};

export const defaultAnnuaireUserContact = {
  nom: "",
  prenom: "",
  gsm: "",
  email: "",
  msg: "",
};

export const getContact = (
  input: ZodAnnuaireUserContact
): AnnuaireUserContact => {
  return {
    nom: input.nom,
    prenom: input.prenom,
    gsm: input.gsm,
    email: input.email,
    msg: input.msg,
  };
};

export const defaultAnnuaireUserUpdate = {
  email: "",
};

export const getUpdate = (input: ZodAnnuaireUserUpdate): AnnuaireUserUpdate => {
  return {
    email: input.email,
  };
};
