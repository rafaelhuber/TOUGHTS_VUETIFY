// Utilities
import { defineStore } from 'pinia';
import { useAuth } from "@/stores/auth.js";
import http from '@/services/http.js'; // Serviço HTTP
import router from '@/router';

export const useToughts = defineStore('tought', {
    state: () => ({
        toughts: [], // Armazena os pensamentos publicados
    }),

    actions: {
        async publicTought(title, text) {
            const auth = useAuth();
            const token = auth.token;
            try {
                // Verifica se o token está presente e é válido
                auth.checkToken();

                // Realiza a publicação do pensamento, incluindo o token no cabeçalho
                const response = await http.post(
                    'toughts/add',
                    { title, text },
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );


                // Redireciona o usuário
                router.push('/Pensamento');

                return { success: true, data: response.data };
            } catch (error) {
                console.error('Erro ao publicar o pensamento:', error);
                return {
                    success: false,
                    message: error.response?.data?.message || 'Erro desconhecido.',
                };
            }
        },

        async allUserToughts() {
            const auth = useAuth();
            const token = auth.token;
            try {
                auth.checkToken();
                const response = await http.get(
                    'toughts/mytoughts',
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );
                // Adiciona o pensamento ao estado local
                this.toughts.push(response.data);
                // Redireciona o usuário
                router.push('/Pensamento');

                return { success: true, data: response.data };
            } catch (error) {
                console.log(error);
                return error
            }
        },

        async showTought() {
            try {
                const response = await http.get('toughts/');
                return { success: true, data: response.data };
            } catch (error) {
                console.log(error);
                return error
            }
        },

        async removeTought(id) {
            const auth = useAuth();
            const token = auth.token;
            try {
                auth.checkToken();
                await http.delete(
                    `toughts/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );
                return { success: true };
            } catch (error) {
                console.log(error);
                return error
            }
        },

        async updateTought(id, { title, text }) {
            const auth = useAuth();
            const token = auth.token;
            try {
                auth.checkToken();
                await http.patch(
                    `toughts/${id}`,
                    { title, text },
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );
                return { success: true };;
            } catch (error) {
                console.log(error);
                return error
            }
        },

        async getLike(id) {
            const auth = useAuth();
            const token = auth.token;
            try {
                auth.checkToken();
                const response = await http.patch(
                    `toughts/${id}/like`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );
                return { data: response.data };
            } catch (error) {
                console.log(error);
                return error
            }
        },

        async publicComment(id, commentText) {
            const auth = useAuth();
            const token = auth.token;


            try {
                auth.checkToken();
                const response = await http.patch(
                    `toughts/${id}/comment`,
                    { commentText },
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );
                console.log('response', response);

                return { data: response.data };
            } catch (error) {
                console.log(error);
                return error
            }
        },

        async getComments(id) {
            const auth = useAuth();
            const token = auth.token;
            try {
                auth.checkToken();
                const response = await http.get(
                    `toughts/${id}/comment`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
                        }
                    }
                );
                // Adiciona o pensamento ao estado local
                return { data: response.data };


            } catch (error) {
                console.log(error);
                return error
            }
        },

    },
});
