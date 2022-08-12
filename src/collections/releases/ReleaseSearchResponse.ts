import { Release } from '../../entities/Release';
import { Pagination } from '../generic/Pagination';

export interface ReleaseSearchResponse {
	pagination: Pagination;
	results: Release[];
}
