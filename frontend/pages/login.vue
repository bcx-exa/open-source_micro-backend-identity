<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login Form</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-sheet elevation="12" class="pa-12">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="username.model"
              :label="username.label"
              :shaped="username.shaped"
              :outlined="username.outlined"
              :rules="[username.rules.required, username.rules.validType]"
              prepend-icon="mdi-account"
              :rounded="username.rounded"
              :clearable="username.clearable"
              :counter="username.counterEn ? username.counter : false"
            ></v-text-field>
            <v-text-field
              v-model="password.model"
              :label="password.label"
              :shaped="password.shaped"
              :outlined="password.outlined"
              prepend-icon="mdi-lock"
              hint="At least 8 characters"
              :append-icon="password.show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[password.rules.required, password.rules.min]"
              :type="password.show1 ? 'text' : 'password'"
              :rounded="password.rounded"
              :clearable="password.clearable"
              :counter="password.counterEn ? password.counter : false"
              @click:append="password.show1 = !password.show1"
            ></v-text-field>

            <div class="text-center">
              <v-btn
                :loading="loading"
                :disabled="!valid"
                color="blue"
                class="ma-2 white--text"
                @click="loader = 'loading'"
              >
                Login
                <v-icon right dark>mdi-login</v-icon>
              </v-btn>
            </div>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    valid: true,
    loader: false,
    loading: false,
    legal: false,
    username: {
      model: "",
      label: "Email or Phone Number",
      shaped: true,
      outlined: true,
      rounded: true,
      clearable: true,
      counterEn: true,
      counter: 100,
      rules: {
        required: (v) => !!v || "E-mail or phone number is required",
        validType: (v) =>
          /.+@.+\..+/.test(v) ||
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
            v
          ) ||
          "Not a valid email or phone number",
      },
    },
    password: {
      model: "",
      label: "Password",
      shaped: true,
      outlined: true,
      rounded: true,
      clearable: true,
      counterEn: true,
      counter: 100,
      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match",
      },
    },
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>
