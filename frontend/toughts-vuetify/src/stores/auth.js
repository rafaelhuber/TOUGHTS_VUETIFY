// Utilities
import { defineStore } from 'pinia'
import http from '@/services/http.js'; // Importa o serviço HTTP para realizar as requisições
import router from '@/router';
//import axios from 'axios';


export const useAuth = defineStore('auth', {

  state: () => ({
    // Estado da autenticação, recuperando valores do localStorage ou definindo valores padrão
    token: localStorage.getItem('token') || '', // Armazena o token de autenticação
    name: localStorage.getItem('name') || '',   // Armazena o nome do usuário
    userId: localStorage.getItem('userId') || '', // Armazena o nome do usuário
    isAuth: false,                              // Status de autenticação, inicialmente falso
  }),

  getters: {
    // Retorna o nome completo do usuário (pode ser expandido para incluir mais informações)
    fullName(state) {
      return state.name;
    },
  },

  actions: {

    // Método para definir o token de autenticação
    setToken(tokenValue) {
      localStorage.setItem('token', tokenValue); // Armazena o token no localStorage
      this.token = tokenValue; // Atualiza o estado do token
    },

    setUser(nameValue) {
      localStorage.setItem('name', nameValue); // Armazena o nome no localStorage
      this.name = nameValue; // Atualiza o estado do nome
    },

    setUserId(userIdValue) {
      localStorage.setItem('userId', userIdValue); // Armazena o nome no localStorage
      this.userId = userIdValue; // Atualiza o estado do nome
    },

    // Método para atualizar o status de autenticação
    setIsAuth(auth) {
      this.isAuth = auth; // Atualiza o estado de autenticação
    },

    async login(email, password) {
      try {
        const response = await http.post('users/login', { email, password });
        //console.log('Token recebido:', response.data.token);
        this.setToken(response.data.token); // Armazena o token
        this.setUser(response.data.name);   // Armazena o nome
        this.setUserId(response.data.userId);
        this.setIsAuth(true);
        //console.log('Login bem-sucedido:', response.data);
        if (this.isAuth) {
          router.push('/')
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        return error
      }


    },

    async register(name, email, password, confirmpassword) {
      try {
        this.checkToken();
        const response = await http.post('users/register', { name, email, password, confirmpassword });
        console.log('Token recebido:', response.data.token);
        this.setToken(response.data.token); // Armazena o token
        this.setUser(response.data.name);   // Armazena o nome
        this.setIsAuth(true);
        //console.log('Usuario criado com sucesso!', response.data);
        if (this.isAuth) {
          router.push('/')
        }
        return true
      } catch (error) {
        //console.error('Erro ao fazer criar usuario:', error);
        return error
      }

    },

    // Método assíncrono para verificar a validade do token
    async checkToken() {
      try {
        const tokenAuth = 'Bearer ' + this.token; // Formata o token para o cabeçalho da requisição
        const { data } = await http.get('users/verifyAuth', {
          headers: {
            Authorization: tokenAuth // Inclui o token no cabeçalho da requisição
          }
        });
        //console.log("teste isAuth", this.isAuth); // Verifica se a autenticação está ativa
        return data; // Retorna os dados da resposta
      } catch (error) {

        // Caso ocorra um erro (token inválido ou expirado), limpa os dados da autenticação e redireciona para o login
        this.clear();
        router.push('/Login'); // Redireciona para a página de login
        console.log("error", error.response?.data); // Exibe o erro no console
      }
    },


    // Método para limpar os dados de autenticação (token e nome)
    clear() {
      localStorage.removeItem('token'); // Remove o token do localStorage
      localStorage.removeItem('name');  // Remove o nome do localStorage
      this.isAuth = false;              // Define a autenticação como falsa
      this.token = '';                  // Limpa o token
      this.name = '';                   // Limpa o nome
    },
  },
});





