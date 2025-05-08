import {
  PersonnelData,
  EgliseData,
  ProfessionnelData,
  RegisterFormDataResult,
} from "./annuaire-register";
import { AnnuaireSearch } from "./annuaire";

export interface SearchMetadata {
  embedding: number[];
  lastUpdated: Date;
  searchScore?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  expiresIn: number;
}

export interface DataAccessConfig {
  cacheTimeout: number;
  maxCacheEntries: number;
  embeddingDimension: number;
}

export interface DataAccessResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: SearchMetadata;
}

export interface IDataAccessService {
  searchByText(query: string): Promise<DataAccessResult<AnnuaireSearch[]>>;
  searchByVector(
    embedding: number[]
  ): Promise<DataAccessResult<AnnuaireSearch[]>>;

  createProfile(
    data: RegisterFormDataResult
  ): Promise<DataAccessResult<string>>;
  getProfile(id: string): Promise<DataAccessResult<RegisterFormDataResult>>;
  updateProfile(
    id: string,
    data: Partial<RegisterFormDataResult>
  ): Promise<DataAccessResult<void>>;
  deleteProfile(id: string): Promise<DataAccessResult<void>>;

  clearCache(): void;
  getCacheStats(): {
    size: number;
    hitRate: number;
    missRate: number;
  };
}

export const defaultDataAccessConfig: DataAccessConfig = {
  cacheTimeout: 1800000, 
  maxCacheEntries: 1000,
  embeddingDimension: 384, 
};
