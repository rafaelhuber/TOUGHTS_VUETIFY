import axios from "axios";

// Criação de uma instância personalizada do Axios
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/", // URL base para as requisições
    headers: {
        "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
    },
});

// Adiciona um interceptor para lidar com as respostas
// axiosInstance.interceptors.response.use(
//     response => {
//         // Se a resposta estiver OK, simplesmente a retorna
//         return response;
//     },
//     error => {
//         // Loga o erro no console para depuração
//         console.error("Erro na requisição:", error.response?.data || error.message);

//         // Retorna o erro para ser tratado nos componentes que chamam o Axios
//         return Promise.reject(error);
//     }
// );

// Exporta a instância do Axios para ser usada em todo o app
export default axiosInstance;
