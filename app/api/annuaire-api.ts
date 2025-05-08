import {
  getId,
  type RegisterFormDataResult,
  type AnnuaireSearch,
  type Eglise,
} from "@/types/interfaces/annuaire";
import { type AnnuaireContactResult } from "@/types/interfaces/annuaire-search-result";


const annuaire_url = () => `${process.env.NEXT_PUBLIC_BASE_URL}/rpc`;
const annuaire_ns = () => `${process.env.NEXT_PUBLIC_ANNUAIRE_NS}`;
const annuaire_db = () => `${process.env.NEXT_PUBLIC_ANNUAIRE_DB}`;
const annuaire_user = () => `${process.env.NEXT_PUBLIC_ANNUAIRE_USER}`;
const annuaire_password = () => `${process.env.NEXT_PUBLIC_ANNUAIRE_PASSWORD}`;

const get_churches = async (): Promise<Eglise[]> => {
  const res = await fetch("/api/churches", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  });
  const value = await res.json();
  return value.data as Eglise[];
};

const search_users = async (
  key: string,
  church: string
): Promise<AnnuaireSearch[]> => {
  try {
    const res = await fetch(
      `/api/users?key=${encodeURIComponent(key)}&church=${encodeURIComponent(church)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
    
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    
    const value = await res.json();
    
    if (!value.data) {
      console.error('Format de réponse inattendu:', value);
      return [];
    }
    
    return value.data
      .flat()
      .map((d: AnnuaireSearch) => ({
        ...d,
        id: {
          tb: d.id.tb,
          id: getId(d.id.id),
        },
      }))
      .sort((a: AnnuaireSearch, b: AnnuaireSearch) =>
        a.prenom.localeCompare(b.prenom)
      );
  } catch (error) {
    console.error('Erreur lors de la recherche des utilisateurs:', error);
    return [];
  }
};

const get_user_by_id = async (
  id: string
): Promise<RegisterFormDataResult[]> => {
  const res = await fetch(
    `/api/users/details/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );
  const value = await res.json();
  return value.data.flat().map((d: RegisterFormDataResult) => ({
    ...d,
    id: {
      tb: d.id.tb,
      id: getId(d.id.id),
    },
  }));
};

const get_user_to_contact = async (
  id: string
): Promise<AnnuaireContactResult> => {
  const res = await fetch(
    `/api/users/contact/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );
  const value = await res.json();
  return value.data[0] as AnnuaireContactResult;
};

const create_annuaire_user = async (payload: any): Promise<Response> => {
  return await fetch("/api/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export {
  annuaire_url,
  annuaire_ns,
  annuaire_db,
  annuaire_user,
  annuaire_password,
  get_churches,
  search_users,
  get_user_by_id,
  get_user_to_contact,
  create_annuaire_user,
};
