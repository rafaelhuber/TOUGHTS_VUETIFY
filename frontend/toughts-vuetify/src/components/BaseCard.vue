<template>
    <v-card
      class="pa-5"
      elevation="2"
      :style="`background-color: ${backgroundColor}; color: ${textColor};`"
    >
      <slot></slot>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      backgroundColor: {
        type: String,
        default: "#1e1e1e",
      },
      textColor: {
        type: String,
        default: "#ffffff",
      },
    },
  };
  </script>
  