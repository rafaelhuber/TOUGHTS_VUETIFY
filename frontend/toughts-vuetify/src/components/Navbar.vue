<template >
  
    <v-app-bar app color="black" >
      <!-- Logo ou Título -->
      <v-toolbar-title>
        <router-link to="/" style="color: #ff8c00">
          <v-img :width="50" aspect-ratio="1/1" cover src="../assets/logo.png"></v-img>
        </router-link>

      </v-toolbar-title>
      <!-- Espaçamento para empurrar os botões -->
      <v-spacer></v-spacer>

      <!-- Botões na versão desktop -->
      <div class="d-none d-md-flex">
        <v-btn
        v-for="(botao, index) in botoes"
            :key="index"
            @click="handleClick(botao)" class="botao-navbar"
          >
          {{ botao }}
        </v-btn>
      </div>

      <!-- Menu de overflow para celular -->
      <v-menu
        activator="parent"
        class="d-flex d-md-none"
        offset-y
      >
        <template #activator="{ props }">
          <v-btn icon v-bind="props" class="d-md-none">
            <v-icon class="botao-navbar">mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list >
          <v-list-item v-for="(botao, index) in botoes" :key="index" @click="handleClick(botao)" class="botao-navbar">
            <v-list-item-title>{{ botao }}</v-list-item-title>
          </v-list-item>
        </v-list>
        
      </v-menu>
    </v-app-bar>

  
</template>

<script>
  import { computed  } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from "@/stores/auth.js"; 

      
 
  export default{
    
    setup(){
      const auth = useAuth();
      const router = useRouter();

      const getNavbarButtons = () => {
        console.log(auth.isAuth);
        
        if(auth.isAuth){
          return ["Home", "Pensamento", "Cadastrar", "Sair"]
        } else {
          return ["Home", "Registrar", "Entrar"]
        }        
      }

      const botoes = computed(() => getNavbarButtons(auth.isAuth));
      
      const  handleClick = (botao) => {
        if (botao === 'Entrar') {
            router.push({ path: '/Login' }); // Redireciona para a rota do Login
          } else if (botao === 'Home') {
            router.push({ path: '/' }); // Redireciona para a rota do Login
          } else if (botao === 'Sair'){
            router.push({ path: '/' });// Redireciona para a página inicial
            auth.clear(); // Limpa o estado de autenticação
          } else {
            router.push({ path: `/${botao}` })
          }
      }
      return {
        handleClick,
        botoes,
    }
  },
};
</script>

<style scoped>
/* Hover laranja para os botões */
.botao-navbar:hover {
  color: orange;
}
</style>
