import axios, { type AxiosInstance } from "axios";
import { getCookie } from "../utils/cookie";
import Cookies from "js-cookie";

export default abstract class BaseService {
	protected _axios: AxiosInstance;
	constructor(token?: string) {
		this._axios = axios.create({
			baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
			timeout: 100000,
		});

		// Add request interceptor to include fresh token on each request
		this._axios.interceptors.request.use(
			(config) => {
				let authToken = token;
				if (!authToken) {
					authToken = getCookie("auth_token");
				}
				if (authToken) {
					config.headers.Authorization = `Bearer ${authToken}`;
				} else {
					console.log("No token available for request");
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Add response interceptor to handle 401s
		this._axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					// Clear the auth token cookie (only on client-side)
					if (typeof window !== "undefined") {
						Cookies.remove("auth_token", { path: "/" });
						// Don't automatically redirect here as it interferes with React Router
						// Let the auth context handle redirection
						console.log("401 received - token cleared");
					}
				}
				return Promise.reject(error);
			}
		);
	}

	protected setMultipartFormDataHeaders() {
		this._axios.defaults.headers.common["Content-Type"] =
			"multipart/form-data";
	}
}
