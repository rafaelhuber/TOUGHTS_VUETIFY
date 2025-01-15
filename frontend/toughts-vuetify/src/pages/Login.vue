<template>
  
    <div>
      <v-alert v-if="infoMessage" :type="alertType" class="mb-4" > {{ infoMessage }} </v-alert>
      <v-container class="pa-5 d-flex justify-center">
    <v-card class="pa-5" elevation="2" width="600" style="background-color: #1e1e1e; color: #ffffff">
      <v-card-title class="text-h5">
        <v-divider vertical :thickness="7" class="mr-3 border-opacity-75" style="background-color: #ff8c00; color: orange; height: 40px;"></v-divider>
        Entrar
      </v-card-title>

      <v-card-text>
        <v-form ref="form">

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
                :rules="[rules.required, rules.length]">
            </v-text-field>

          
            <!-- Botão Logar -->
            <v-hover v-slot="{ isHovering, props }">
              <v-btn
                block
                v-bind="props"
                class="mt-auto"
                variant="outlined"
                rounded="0"
                @click="login"
                :color="isHovering ? '#ff8c00' : undefined"
                :loading="isLoading"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Carregando...' : 'Entrar' }}
              </v-btn>
            </v-hover>
          </v-form>
        </v-card-text>

      <v-card-actions class="justify-center">
        <span class="mt-2" style="color: white">
          Não tem conta? 
          <router-link to="/Registrar" style="color: #ff8c00">Clique aqui!</router-link>
        </span>
      </v-card-actions>
    </v-card>
  </v-container>
    </div>
  </template>


<script>
import { ref, reactive } from "vue"; // Importa funções do Vue
import { useAuth } from "@/stores/auth.js"; // Importa o store de autenticação


export default {
  setup() {
    // Reativos para armazenar os dados do login e estado de autenticação
    const infoMessage = ref(''); // Mensagem de erro ou sucesso
    const alertType = ref(''); // Tipo de alerta (success, error, etc.)
    const auth = useAuth(); // Objeto de autenticação (usando store)
    ;
    const user = reactive({
      email: "rafael@example.com", // E-mail inicial
      password: "1234", // Senha inicial
    });

    const valid = ref(false); // Controle de validação do formulário
    const showPassword = ref(false); // Controle da visibilidade da senha
    const isLoading = ref(false); // Controle do estado de carregamento

    // Regras de validação dos campos
    const rules = {
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

    // Função de login
    const login = async () => {
      isLoading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const email = user.email;
        const password = user.password;
        const authResponse = await auth.login(email, password);
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
      login,
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

  