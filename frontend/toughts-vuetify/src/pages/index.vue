<template>
  <div>
    <h1 class="d-flex justify-center">Pensamentos</h1>
    <v-container>
      <v-card
        v-for="(post,index) in pensamentos" 
        :key="index"
        class="mx-auto my-4"
        prepend-icon="mdi-lead-pencil"
        :subtitle="post.name"        
        width="400"
      >
      <template v-slot:title >
        <span class="font-weight-black"> {{post.title}} </span>
      </template>
        <v-card-text>{{ post.text }}</v-card-text>
        <v-card-actions v-if="auth.isAuth">
          <v-btn
          variant="plain"
          v-ripple="false"
            :color="post.liked ? 'red' : 'grey-lighten-1'"
            @click="toggleLike(post)"
          >
            <v-icon size="x-large">
              {{ post.liked ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
            {{ post.likesCount }}
          </v-btn>
       

          
          
          <div class="pa-4 text-center">
            <v-icon icon="mdi-comment-outline" @click="openDialog(post._id)"></v-icon>
      <v-dialog v-model="dialog" max-width="480">
        <v-card title="Comentários">
          <template v-slot:text>
            <comment-section :post-id="post._id" @update-comments="fetchPensamentos" />
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Fechar" variant="text" @click="dialog = false"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

          </div>
          <p>{{ post.commentCount }}</p>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useToughts } from "@/stores/tought.js";
import { useAuth } from "@/stores/auth.js";
import CommentSection from '@/components/CommentSection.vue';

export default {
  components: {
    CommentSection
  },
  setup() {
    const toughtStore = useToughts();
    const auth = useAuth();
    const pensamentos = ref([]); // Armazena os pensamentos
    const dialog = ref(false)


const selectedPostId = ref(null);

const openDialog = (postId) => {
  selectedPostId.value = postId; // Armazena o ID do post selecionado
  dialog.value = true;
  fetchPensamentos();
}
    // Carrega os pensamentos do backend
    const fetchPensamentos = async () => {
      try {
        const response = await toughtStore.showTought();
        
        if (response.success) {
          pensamentos.value = response.data.toughts.map((tought) => ({
            _id: tought._id,
            title: tought.title,
            text: tought.text,
            likes: tought.likes,
            name: tought.user?.name, // Nome do usuário
            liked: tought.likes.includes(auth.userId),
            likesCount: tought.likes.length,
            commentCount: tought.comments.length
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar pensamentos:", error);
      }
    };

    // Alterna o estado de "like" no post
    const toggleLike = async (post) => {
      try {
        const response = await toughtStore.getLike(post._id); // Chama a função no store
        const updatedLikes = response.data;
        //console.log('updatedLikes......',updatedLikes.likes);

        // Atualiza os dados localmente
        post.liked = updatedLikes.likes.includes(auth.userId);
        post.likesCount = updatedLikes.likes.length;
        
        
      } catch (error) {
        console.error("Erro ao alternar like:", error);
      }
    };

    // Monta o componente e busca os pensamentos
    onMounted(() => {
      fetchPensamentos();
    });

    return {
      pensamentos,
      toggleLike,
      auth,
      dialog,
      openDialog
    };
  },
};
</script>