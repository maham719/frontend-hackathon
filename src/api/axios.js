import axios from "axios";

const api =axios.create({
    baseURL: window.location.hostname === "localhost"
      ? "http://localhost:3006/api/auth"
      : "https://backend-hackathon-seven.vercel.app/",
    withCredentials:true
})

// Access token lives only in memory
let accessToken = null;


// Set access token
export const setAccessToken = (token) => {
    accessToken = token;
};


// Clear access token
export const clearAccessToken = () => {
    accessToken = null;
};


// Get access token
export const getAccessToken = () => {
    return accessToken;
};


// =====================================
// REQUEST INTERCEPTOR
// =====================================

api.interceptors.request.use(
    (config) => {

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// =====================================
// RESPONSE INTERCEPTOR
// =====================================

api.interceptors.response.use(

    // Successful response
    (response) => {
        return response;
    },

    // Error response
    async (error) => {

        const originalRequest = error.config;

        // Access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {

            originalRequest._retry = true;

            try {

                // Get a new access token
                const response = await api.get("/auth/refresh");

                const newAccessToken = response.data.accessToken;

                // Store new token in memory
                setAccessToken(newAccessToken);

                // Put new token on original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry original request
                return api(originalRequest);

            } catch (refreshError) {

                // Refresh token is invalid/expired
                clearAccessToken();

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



export default api;