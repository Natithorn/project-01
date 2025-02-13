interface ApiConfig {
  googleApiKey: string;
}

export const apiConfig: ApiConfig = {
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
};