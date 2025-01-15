<template>
  <div>
    <h1>Pensamentos</h1>

    <v-card 
    v-for="(x, index) in pensamentos" :key="index"
        class="mx-auto my-4"
        prepend-icon="mdi-lead-pencil"
         :subtitle="x.name"
        width="400"
    >
        <template v-slot:title >
        <span class="font-weight-black">{{x.title}}</span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
        {{ x.text }}
        </v-card-text>
  </v-card>

    
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useToughts } from "@/stores/tought.js";

export default {
  setup() {
    const toughtStore = useToughts();
    const pensamentos = ref([]); // Estado reativo para armazenar os pensamentos

    const fetchPensamentos = async () => {
      try {
        const response = await toughtStore.showTought();
        
        // Extrai os dados de título, texto e nome do usuário
        if (response.success) {
          pensamentos.value = response.data.toughts.map((tought) => ({
            title: tought.title,
            text: tought.text,
            name: tought.user?.name || "Desconhecido", // Nome do usuário
          }));
        }
        
      } catch (error) {
        console.error("Erro ao buscar pensamentos:", error);
      }
    };

    onMounted(() => {
      fetchPensamentos(); // Carrega os pensamentos ao montar o componente
      
    });

    return {
      pensamentos,
    };
  },
};
</script>

