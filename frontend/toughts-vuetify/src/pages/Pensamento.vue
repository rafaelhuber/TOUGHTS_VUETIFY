<template>
  <div>
    <h1 class="d-flex justify-center">Meus Pensamentos</h1>

    <v-card 
      v-for="(x, index) in pensamentos" :key="index"
      class="mx-auto my-4"
      prepend-icon="mdi-lead-pencil"
      :subtitle="x.name"
      width="400"
    >
      <template v-slot:title>
        <span class="font-weight-black">{{ x.title }}</span>
      </template>

      <v-card-text class="bg-surface-light pt-4">
        <div v-if="editingId === x._id">
          <!-- Formulário de Edição -->
          <v-text-field
            v-model="editingData.title"
            label="Título"
            outlined
          ></v-text-field>
          <v-textarea
            v-model="editingData.text"
            label="Texto"
            outlined
          ></v-textarea>
          <v-btn class="ma-10" color="blue" @click="saveEdit(x._id)">Salvar</v-btn>
          <v-btn class="ma-10" color="grey" @click="cancelEdit">Cancelar</v-btn>
        </div>
        <div v-else>
          {{ x.text }}
        </div>
      </v-card-text>

      <v-hover v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props"
          prepend-icon="mdi-delete-forever"
          class="ma-10"
          :color="isHovering ? 'red' : undefined"
          @click="remove(x._id)"
        >
          Deleta
        </v-btn>
      </v-hover>

      <v-hover v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props"
          prepend-icon="mdi-lead-pencil"
          class="ma-10"
          :color="isHovering ? 'green' : undefined"
          @click="edit(x)"
        >
          Editar
        </v-btn>
      </v-hover>
    </v-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useToughts } from "@/stores/tought.js";

export default {
  setup() {
    const toughtStore = useToughts();
    const pensamentos = ref([]); // Estado reativo para armazenar os pensamentos
    const editingId = ref(null); // ID do pensamento sendo editado
    const editingData = reactive({ title: "", text: "" }); // Dados temporários de edição

    const fetchPensamentos = async () => {
      try {
        const response = await toughtStore.allUserToughts();
        if (response.success) {
          pensamentos.value = response.data.tought.map((tought) => ({
            _id: tought._id,
            title: tought.title,
            text: tought.text,
            name: tought.user?.name || "Desconhecido",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar pensamentos:", error);
      }
    };

    const remove = async (id) => {
      try {
        const response = await toughtStore.removeTought(id);
        if (response.success) {
          pensamentos.value = pensamentos.value.filter((tought) => tought._id !== id);
        }
      } catch (error) {
        console.error("Erro ao remover pensamento:", error);
      }
    };

    const edit = (tought) => {
      editingId.value = tought._id; // Define o ID do pensamento em edição
      editingData.title = tought.title; // Preenche os dados temporários
      editingData.text = tought.text;
    };

    const saveEdit = async (id) => {
      try {
        const response = await toughtStore.updateTought(id, {
          title: editingData.title,
          text: editingData.text,
        });
        if (response.success) {
          const index = pensamentos.value.findIndex((tought) => tought._id === id);
          if (index !== -1) {
            pensamentos.value[index].title = editingData.title;
            pensamentos.value[index].text = editingData.text;
          }
          editingId.value = null; // Sai do modo de edição
        }
      } catch (error) {
        console.error("Erro ao salvar pensamento:", error);
      }
    };

    const cancelEdit = () => {
      editingId.value = null; // Sai do modo de edição sem salvar
    };

    onMounted(() => {
      fetchPensamentos();
    });

    return {
      pensamentos,
      editingId,
      editingData,
      remove,
      edit,
      saveEdit,
      cancelEdit,
    };
  },
};
</script>
