import api from "../../../api/axios.js";


export const getTicketByIdService = async (ticketId) => {
    const response = await api.get(
        `/tickets/${ticketId}`,
        {
            withCredentials: true,
        }
    );

    return response.data?.ticket || response.data;
};
export const createTicketService = async (ticketData) => {
    const response = await api.post(
        `/tickets`,
        ticketData,
        {
            withCredentials: true,
        }
    );

    return response.data;
};
export const getTicketMessagesService = async (ticketId) => {
    const response = await api.get(
        `/tickets/${ticketId}/messages`,
        {
            withCredentials: true,
        }
    );

    return response.data?.messages || [];
};
export const getCustomerTicketsService = async () => {
    const response = await api.get(
        `/tickets`,

        {
            withCredentials: true,
        }
    );

    return response.data?.tickets || [];
};


export const getAgentTicketsService = async () => {
    const response = await api.get(
        `/tickets/agent`,
        {
            withCredentials: true,
        }
    );

    return response.data?.tickets || [];
};

    export const getAllTicketsService = async () => {
        const response = await api.get(`/tickets/admin`, {
            withCredentials: true,
        });

        return response.data?.tickets || [];
    };

export const sendMessageService = async (ticketId, content) => {
    const response = await api.post(
        `${getTicketBaseUrl()}/${ticketId}/messages`,
        {
            content
        },
        {
            withCredentials: true,
        }
    );

    return response.data;
};


