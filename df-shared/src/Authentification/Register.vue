<template>
  <div>
    <div>
      <h2 class="fr-h2 text-center fr-mt-3w fr-mb-5w color--primary">
        {{ $t("title") }}
      </h2>

      <template v-if="franceConnect">
        <div class="fr-mt-5w fr-mb-5w text-center ">
          <div v-if="getParams() !== undefined">
            <router-link :to="{name: 'SourceLink', params: getParams(), query: getQuery()}" class="color--primary">{{ $t('connect-france-connect') }}</router-link>
          </div>
          <div v-else>
            <a href="/account">
              {{ $t('connect-france-connect') }}
            </a>
          </div>
        </div>

        <div class="separator">{{ $t('or') }}</div>
      </template>

    <ValidationObserver v-slot="{ validate }">
      <form name="form" @submit.prevent="validate().then(handleRegister)">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="email">{{ $t("email") }}</label>
                <input
                  v-model="user.email"
                  class="form-control validate-required fr-input"
                  id="email"
                  name="email"
                  :placeholder="$t('email-placeholder')"
                  type="email"
                  autocomplete="email"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-1w">
            <validation-provider
              :rules="`required|strength:${score}`"
              v-slot="{ errors }"
              name="password"
              vid="password"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="password">{{
                  $t("password")
                }}</label>
                <input
                  id="password"
                  :placeholder="generatedPwd"
                  type="password"
                  v-model="user.password"
                  name="password"
                  class="validate-required form-control fr-input"
                  autocomplete="new-password"
                  required
                />
                <password
                  v-model="user.password"
                  :strength-meter-only="true"
                  @score="setScore"
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider
              rules="required|confirmed:password"
              v-slot="{ errors }"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <label class="fr-label" for="confirm-password">
                  {{ $t("confirm-password") }}</label
                >
                <input
                  id="confirm-password"
                  type="password"
                  v-model="user.confirm"
                  name="confirm-password"
                  class="validate-required form-control fr-input"
                  autocomplete="new-password"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="fr-col-12 fr-mb-3w">
            <vue-recaptcha
              ref="captcha"
              :sitekey="SITE_KEY"
              :loadRecaptchaScript="true"
              @verify="onVerify"
            ></vue-recaptcha>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
            >
              <div
                class="bg-purple fr-checkbox-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="acceptCgu"
                  value="false"
                  v-model="acceptCgu"
                />
                <label for="acceptCgu"><div v-html="$t('accept-cgu')"></div></label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn full-width-btn" type="submit">
              {{ $t("submit") }}
            </button>
          </div>
        </div>
      </form>
    </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";
import { required, email, confirmed, is } from "vee-validate/dist/rules";
import VueRecaptcha from "vue-recaptcha";
import Password from "vue-password-strength-meter";

// No message specified.
extend("email", {
  ...email,
  message: "email-not-valid"
});

// Override the default message.
extend("required", {
  ...required,
  message: "field-required"
});

extend("confirmed", {
  ...confirmed,
  message: "password-not-confirmed"
});

const MIN_SCORE = 2;
extend("strength", {
  message: "pwd-not-complex",
  validate: (_value, args: any) => {
    if (args !== undefined) {
      return args[0] >= MIN_SCORE;
    }
    return true;
  }
});

extend("is", {
  ...is,
  message: "require-accept",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VueRecaptcha,
    Password
  }
})
export default class Register extends Vue {
  SITE_KEY = process.env.VUE_APP_CAPTCHA_SITE_KEY;

  @Prop({ default: "" }) email!: string;
  franceConnect = window.location.href.includes("locataire-dev") || window.location.href.includes("localhost");

  user: User = new User();
  score = 0;
  acceptCgu=false;
  generatedPwd ="";

  mounted() {
    this.user.email = this.email;
    this.generatePlaceholder();
  }

  handleRegister() {
    if (this.score < MIN_SCORE || !this.acceptCgu) {
      return;
    }
    this.$emit("on-register", this.user);
    (this.$refs.captcha as VueRecaptcha).reset();
  }

  onVerify(captcha: string) {
    this.user.captcha = captcha;
  }

  setScore(s: number) {
    this.score = s;
  }

  getParams() {
    if (!this.$route.params.source) {
      return undefined;
    }
    return {
      source: this.$route.params.source,
    }
  }

  getQuery() {
    return {
      internalPartnerId: this.$route.query.internalPartnerId.toString() || "",
      firstName: this.$route.query.firstName.toString() || "",
      lastName: this.$route.query.lastName.toString() || "",
      email: this.$route.query.email.toString() || ""
    }
  }

  generatePlaceholder() {
    const chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz","0123456789", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "#!?-_."];
    this.generatedPwd = this.$i18n.t('ex') + [4,4,2,2].map(function(len, i) { return Array(len).fill(chars[i]).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function(){return 0.5-Math.random()}).join('');
  }
}
</script>

<style lang="scss">
.full-width-btn {
  width: 100%;
  display: table-cell;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6a6a6a;
  font-size: 12px;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #cecece;
}

.separator:not(:empty)::before {
  margin-right: 2rem;
}

.separator:not(:empty)::after {
  margin-left: 2rem;
}
</style>

<i18n>
{
"en": {
"title": "Create account",
"password": "Password :",
"email-placeholder": "E.g.: example@example.fr",
"confirm-password": "Confirm password :",
"email": "Email :",
"submit": "I create my account",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"password-not-confirmed": "Password not confirmed",
"pwd-not-complex": "Password not secure enough",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a target=\"_blank\" href='https://dossierfacile.fr/mentions-legales#cgu'>Conditions générales d’utilisation</a> de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" href='https://dossierfacile.fr/mentions-legales#politique-de-confidentialite'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
"ex": "E.g.: ",
"or": "or",
"connect-france-connect": "Connect with FranceConnect"
},
"fr": {
"title": "Rejoindre DossierFacile",
"password": "Votre mot de passe :",
"confirm-password": "Confirmation de votre mot de passe :",
"email-placeholder": "Ex : exemple@exemple.fr",
"email": "Votre e-mail :",
"submit": "Je crée mon compte",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"password-not-confirmed": "Le mot de passe ne correspond pas",
"pwd-not-complex": "Mot de passe trop simple",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a class=\"cgu\" target=\"_blank\" href='https://www.dossierfacile.fr/mentions-legales#cgu'>Conditions générales d’utilisation</a> de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" class=\"cgu\" href='https://www.dossierfacile.fr/mentions-legales#politique-de-confidentialite'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
"ex": "Ex : ",
"or": "Ou",
"connect-france-connect": "Se connecter avec FranceConnect"
}
}
</i18n>
