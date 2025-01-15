<template>
    <div>
      <h1 class="d-flex justify-center">Meus Pensamentos</h1>
  
    <v-form class="mx-auto my-4" style="max-width: 400px;">
      <v-text-field
        v-model="pensamento.title"
        label="Título"
        hide-details
        :rules="[rules.required]"
      ></v-text-field>
  
        <v-divider></v-divider>
  
        <v-textarea
          v-model="pensamento.text"
          label="Mensagem"
          maxlength="120"
          counter
          :rules="[rules.required]"
        ></v-textarea>
  
        <v-btn
          class="ma-10"
          color="orange"
          :loading="isLoading"
          :disabled="isLoading || !isFormValid"
          @click="publicar"
        >
          Publicar
        </v-btn>
  
        <v-alert
          v-if="feedbackMessage"
          :type="feedbackType"
          class="mt-4"
          dismissible
        >
          {{ feedbackMessage }}
        </v-alert>
      </v-form>
    </div>
  </template>
  
<script>
import { reactive, ref, computed } from 'vue';
import { useToughts } from "@/stores/tought.js";

export default {
  setup() {
    const pensamento = reactive({
      title: '',
      text: '',
    });

    const isLoading = ref(false); // Estado de carregamento
    const feedbackMessage = ref(''); // Mensagem de feedback
    const feedbackType = ref(''); // Tipo de feedback (success, error)

    const rules = {
      required: (value) => !!value || 'Este campo é obrigatório.',
    };

    const toughtStore = useToughts();

    const isFormValid = computed(() => {
      return pensamento.title.trim() && pensamento.text.trim();
    });

    const publicar = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;
      feedbackMessage.value = '';
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulando atraso
        await toughtStore.publicTought(pensamento.title, pensamento.text);

        feedbackMessage.value = 'Pensamento publicado com sucesso!';
        feedbackType.value = 'success';

        // Limpa os campos após publicação
        pensamento.title = '';
        pensamento.text = '';
      } catch (error) {
        feedbackMessage.value = 'Erro ao publicar o pensamento.';
        feedbackType.value = 'error';
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      pensamento,
      isLoading,
      feedbackMessage,
      feedbackType,
      rules,
      publicar,
      isFormValid,
    };
  },
};
</script>

