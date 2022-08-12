import { OmahaCollection } from '../client/OmahaCollection';
import { IdentityResponse } from './auth/IdentityResponse';
import { LoginRequest } from './auth/login/LoginRequest';
import { LoginResponse } from './auth/login/LoginResponse';
import { RegisterRequest } from './auth/register/RegisterRequest';
import { RegisterResponse } from './auth/register/RegisterResponse';
import { ScopesResponse } from './auth/ScopesResponse';

export class AuthCollection extends OmahaCollection {

	/**
	 * Logs into an account with a username and password.
	 * @param options
	 * @returns
	 */
	public async login(options: LoginRequest) {
		const response = await this.client.post<LoginResponse>('/v1/auth/login', options);
		this.client.setToken(response.token);
		return response;
	}

	/**
	 * Registers a new account with the given parameters.
	 * @param options
	 * @returns
	 */
	public async register(options: RegisterRequest) {
		const response = await this.client.post<RegisterResponse>('/v1/auth/register', options);
		this.client.setToken(response.token);
		return response;
	}

	/**
	 * Gets the identity of the current authenticated user.
	 * @returns
	 */
	public async identity() {
		return this.client.get<IdentityResponse>('/v1/auth/identity');
	}

	/**
	 * Gets an array of all scopes in the system, including information about them and whether the current user has
	 * access to them.
	 * @returns
	 */
	public async scopes() {
		return this.client.get<ScopesResponse>('/v1/auth/scopes');
	}

	/**
	 * Logs out (removes the token).
	 */
	public async logout() {
		this.client.setToken(undefined);
	}

}
