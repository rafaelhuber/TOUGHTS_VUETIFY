<template>
      <div>
      <v-alert v-if="infoMessage" :type="alertType" class="mb-4" > {{ infoMessage }} </v-alert>
      <v-container class="pa-5 d-flex justify-center">
    <v-card class="pa-5" elevation="2" width="600" style="background-color: #1e1e1e; color: #ffffff">
      <v-card-title class="text-h5">
        <v-divider vertical :thickness="7" class="mr-3 border-opacity-75" style="background-color: #ff8c00; color: orange; height: 40px;"></v-divider>
        Cadastrar
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <!-- Nome -->
          <v-text-field
            v-model="user.name"
            label="Nome:"
            placeholder="Digite o seu nome"
            outlined
            color="orange"
            style="color: white"
            :rules="[rules.obrigatorio]"
          ></v-text-field>

          <!-- E-mail -->
          <v-text-field
            v-model="user.email"
            label="E-mail:"
            placeholder="Digite o seu email"
            outlined
            color="orange"
            :rules="[rules.obrigatorio, rules.email]"
          ></v-text-field>

          <!-- Senha -->
          <v-text-field
            v-model="user.password"
            label="Senha:"
            placeholder="Digite a sua senha"
            outlined
            color="orange"
            type="password"
            :rules="[rules.obrigatorio]"
          ></v-text-field>

          <!-- Confirmação de Senha -->
          <v-text-field
            v-model="user.confirmpassword"
            label="Confirmação de Senha:"
            placeholder="Confirme sua senha"
            outlined
            color="orange"
            type="password"
            :rules="[rules.obrigatorio, rules.confirmsenha]"
          ></v-text-field>

            <!-- Botão Cadastrar -->
            <v-hover v-slot="{ isHovering, props }">
              <v-btn
                v-bind="props"
                block
                class="mt-auto"
                variant="outlined"
                rounded="0"
                @click="register"
                :color="isHovering ? '#ff8c00' : undefined"
                :loading="isLoading"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Carregando...' : 'Cadastrar' }}
              </v-btn>
            </v-hover>
          </v-form>
        </v-card-text>

      <v-card-actions class="justify-center">
        <span class="mt-2" style="color: white">
          Já tem conta? 
          <router-link to="/Login" style="color: #ff8c00">Clique aqui!</router-link>
        </span>
      </v-card-actions>
    </v-card>
  </v-container>
    </div>
  </template>
  
<script>
import { ref, reactive } from "vue"; // Importa funções do Vue
//import http from "@/services/http.js"; // Importa o serviço HTTP para requisições
import { useAuth } from "@/stores/auth.js"; // Importa o store de autenticação


export default {
  setup() {
    // Reativos para armazenar os dados do login e estado de autenticação
    const infoMessage = ref(''); // Mensagem de erro ou sucesso
    const alertType = ref(''); // Tipo de alerta (success, error, etc.)
    const auth = useAuth(); // Objeto de autenticação (usando store)
   
    const user = reactive({
      name: '',
      email: '', // E-mail inicial
      password: '', // Senha inicial
      confirmpassword: ''
    });

    const valid = ref(false); // Controle de validação do formulário
    const showPassword = ref(false); // Controle da visibilidade da senha
    const isLoading = ref(false); // Controle do estado de carregamento

    // Regras de validação dos campos
    const rules = {
      confirmsenha: (value) => {
        return user.password === value || "Senha não confere!!";
      },
      required: (value) => !!value || "Este campo é obrigatório", // Valida se o campo está preenchido
      email: (value) => {
        const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        return pattern.test(value) || "E-mail inválido"; // Valida o formato do e-mail
      },
      length: (value) =>
        (value && value.length >= 4 && value.length <= 15) ||
        "A senha deve ter entre 4 e 15 caracteres", // Valida o tamanho da senha
    };

    // Função para alternar a visibilidade da senha
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    // Função de registar
    const register = async () => {
      isLoading.value = true;
      try {  
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const authResponse = await auth.register(user.name, user.email, user.password, user.confirmpassword);
        if(authResponse?.response?.status === 422 ){
          infoMessage.value = authResponse?.response?.data?.message || 'Erro ao realizar o login'; // Mensagem de erro
          alertType.value = 'error'; // Tipo do alerta
        } else {
          infoMessage.value = 'Login realizado com sucesso!'
          alertType.value = 'success'
        }
      } catch (error) {
        infoMessage.value = error?.response?.data?.message || 'Erro ao realizar o login'; // Mensagem de erro
        alertType.value = 'error'; // Tipo do alerta
      }finally {
        isLoading.value = false; // Desativa o carregamento independentemente do sucesso ou erro
      }
    };

    return {
      user,
      valid,
      showPassword,
      togglePasswordVisibility,
      rules,
      register,
      auth,
      infoMessage,
      alertType,
      isLoading,
    };
  },
};
</script>

<style scoped>
.v-text-field {
  color: white;
}
.v-input__control {
  border-color: orange !important;
}
.v-input--is-focused .v-input__control {
  border-width: 2px !important;
}
</style>

  