<template>
    <v-card>
      <v-card-title>Comentários</v-card-title>
  
      <!-- Campo de Comentário -->
    <v-textarea v-model="newComment" label="Adicionar um comentário..." rows="2" outlined dense auto-grow></v-textarea>
  
      <!-- Botão para Enviar Comentário -->
      <v-btn color="primary" @click="submitComment" :disabled="newComment.trim() === ''">
        Publicar
      </v-btn>
  
      <!-- Lista de Comentários -->
      <v-divider></v-divider>
      <v-list>
        <v-list-item-group v-if="comments.length">
          <v-list-item v-for="(comment, index) in comments" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ comment.name }}:</v-list-item-title>

              <v-list-item-subtitle>{{ comment.text }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item v-else>
          <v-list-item-content>
            <v-list-item-subtitle>Nenhum comentário ainda.</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useToughts } from "@/stores/tought.js";
  
  export default {
    props: {
      postId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const toughtStore = useToughts();
  
      const newComment = ref('');
      const comments = ref([]);
  
      // Método para enviar o comentário
      const submitComment = async () => {
        if (newComment.value.trim() === '') return;
        
        try {
          // Envia o comentário para o servidor
          const response = await toughtStore.publicComment(props.postId, newComment.value);
                    
            
          // Adiciona o comentário localmente (se o backend retornar o comentário criado)
          comments.value.push(response.data.comment);
  
          // Limpa o campo de comentário
          newComment.value = '';
        } catch (error) {
          console.error('Erro ao enviar o comentário:', error);
        }
      };
  
      // Método para buscar os comentários
      const fetchComments = async () => {
        try {
            
            const response = await toughtStore.getComments(props.postId);
            console.log('Buscando comentários para o postId:', response);
            
            
            if (response.data.comments.length === 0) {
            comments.value = [];
            } else {
            comments.value = response.data.comments;
            }

            console.log('Comentários recebidos:', comments.value);
        } catch (error) {
            console.error('Erro ao carregar os comentários:', error);
        }
        };

  
      onMounted(() => {
        fetchComments();
      });
  
      return {
        newComment,
        comments,
        submitComment
      };
    }
  };
  </script>
  
  <style scoped>
  .v-textarea {
    margin-bottom: 10px;
  }
  
  .v-btn {
    margin-top: 10px;
  }
  </style>
  