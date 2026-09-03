import axios from "axios";

const api =axios.create({
    baseURL: window.location.hostname === "localhost"
      ? "http://localhost:3006/api"
      : "https://backend-hackathon-1dgv.onrender.com/api",
    withCredentials:true
})

// Access token lives only in memory
let accessToken = null;
let isRefreshing = false;

let isRestoringSession = false;

export const setRestoringSession = (value) => {
    isRestoringSession = value;
};
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

// api.interceptors.request.use(
//     (config) => {
//    console.log("AXIOS REQUEST:", config.url);
//         console.log("ACCESS TOKEN:", accessToken);
//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         return config;
//     },

//     (error) => {
//         return Promise.reject(error);
//     }
// );

api.interceptors.request.use(
    (config) => {
        console.log("AXIOS REQUEST:", config.url);
        console.log("ACCESS TOKEN:", accessToken);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log(
            "AUTH HEADER BEING SENT:",
            config.headers.Authorization
        );

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
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

    if (
    error.response?.status === 401 &&
    accessToken &&
    !isRestoringSession &&
    !originalRequest._retry &&
    !originalRequest.url.includes("/auth/refresh")
){
            originalRequest._retry = true;

            try {
                const response = await api.get("/auth/refresh");

                const newAccessToken = response.data.accessToken;

                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                clearAccessToken();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



export default api;
