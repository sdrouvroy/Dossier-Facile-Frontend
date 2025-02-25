<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h6>{{ $t("title") }}</h6>
          <v-gouv-fr-modal>
            <template v-slot:button>
              <span class="small-font">{{ $t("more-information") }}</span>
            </template>
            <template v-slot:title>
              {{ $t("more-information") }}
            </template>
            <template v-slot:content>
              <p>
                <CoupleInformationHelp></CoupleInformationHelp>
              </p>
            </template>
          </v-gouv-fr-modal>
        </div>
        <div v-if="showEmailExists" class="fr-col-12 fr-mt-2w">
          <div class="fr-callout">
            <p class="fr-mb-1w" v-html="$t('email-exists')"></p>
          </div>
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-mt-2w" v-if="getPartner()">
          <NakedCard>
            <div class="fr-grid-row bg--white">
              <div class="fr-col-10">
                <div class="fr-grid-row nowrap">
                  <div class="center-icon fr-mr-1w">
                    <span class="color--white material-icons md-24 round-icon" aria-hidden="true"
                      >person</span
                    >
                  </div>
                  <div class="fr-grid-col overflow--hidden max-content">
                    <div :title="coupleMail" class="overflow--hidden">
                      <b>
                        {{ getPartner().email }}
                      </b>
                    </div>
                    <div class="small-text">
                      {{
                        $t(getPartner().id ? "invite-sent" : "invite-waiting")
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="fr-col-2 center-icon">
                <button
                  class="fr-btn fr-btn--secondary icon-btn"
                  :title="$t('delete')"
                  @click="remove(getPartner().email)"
                  type="button"
                >
                  <span class="color--primary material-icons md-24"
                    >Effacer l'invitation</span
                  >
                </button>
              </div>
            </div>
          </NakedCard>
        </div>

        <div class="fr-col-12 fr-mt-2w" v-if="getPartner() === undefined">
          <label class="fr-label fr-mb-1w" for="email-conjoint">{{ $t("spouseEmail") }}</label>
          <validation-provider
            v-slot="{ errors }"
            :rules="{ email: true, custom: user.email }"
          >
            <div
              class="fr-input-group"
              :class="errors[0] ? 'fr-input-group--error' : ''"
            >
              <input
                v-model="coupleMail"
                class="validate-required form-control fr-input"
                :class="errors[0] ? 'fr-input--error' : ''"
                name="email"
                placeholder="Ex : exemple@exemple.fr"
                type="email"
                id="email-conjoint"
              />
              <span
                class="fr-error-text"
                v-if="errors[0] && errors[0] !== 'none'"
                >{{ $t(errors[0]) }}</span
              >
            </div>
          </validation-provider>
        </div>
        <div class="fr-col-12" v-if="getPartner() === undefined">
          <div class="fr-grid-row fr-grid-row--right fr-mt-2w fr-mb-3w">
            <v-gouv-fr-button
              :secondary="true"
              :label="$t('add-a-spouse')"
              :btn-type="'button'"
              :disabled="coupleMail === ''"
              @click="addMail"
            ></v-gouv-fr-button>
          </div>
        </div>
      </div>
    </NakedCard>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w fr-mt-3w">
        <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
          <div
            class="fr-checkbox-group bg-purple"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <input
              type="checkbox"
              id="authorize"
              value="false"
              v-model="authorize"
              @change="updateAuthorize()"
            />
            <label for="authorize">{{ $t("acceptAuthor") }}</label>
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { email, is } from "vee-validate/dist/rules";
import { mapGetters, mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import CoupleInformationHelp from "./helps/CoupleInformationHelp.vue";

extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

extend("custom", {
  ...is,
  message: "none",
  validate: (v1, v2: any) => {
    return v1 !== v2.other;
  }
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VGouvFrButton,
    VGouvFrModal,
    CoupleInformationHelp,
    NakedCard
  },
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      spouseAuthorize: "spouseAuthorize"
    })
  }
})
export default class CoupleInformation extends Vue {
  coupleMail = "";
  authorize = false;
  spouseAuthorize!: boolean;
  showEmailExists = false;

  user!: User;

  mounted() {
    if ((this.user.apartmentSharing?.tenants.length || 0) > 1) {
      const partner = this.user.apartmentSharing?.tenants.find(t => {
        return t.email != this.user.email;
      });
      this.coupleMail = partner?.email || "";
    }
    this.authorize = this.spouseAuthorize;
  }

  updateAuthorize() {
    this.$store.commit("updateCoupleAuthorize", this.authorize);
  }

  addMail() {
    this.showEmailExists = false;
    if (this.coupleMail !== "") {
      if (this.coupleMail !== this.user.email) {
        this.$store.commit("createCouple", this.coupleMail);
      } else {
        this.showEmailExists = true;
      }
    }
  }

  getPartner() {
    const partner = this.user.apartmentSharing?.tenants.find(t => {
      return t.email != this.user.email;
    });
    return partner;
  }

  remove(email: string) {
    this.$store.commit("deleteRoommates", email);
    return false;
  }
}
</script>

<style scoped lang="scss">
.small-text {
  font-size: 0.8rem;
}

.overflow--hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fr-btn {
  box-shadow: none;
  background-color: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
}

.icon-btn {
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.material-icons,
.material-icons-outlined {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
}

.center-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-icon {
  border-radius: 50%;
  background-color: var(--primary);
  padding: 0.25rem;
}

.card {
  box-shadow: 0 1px 8px 0 #cecece;
  @media all and (min-width: 992px) {
    padding: 1.5rem;
  }
}

.nowrap {
  flex-wrap: nowrap;
  overflow: auto;
}

.max-content {
  max-width: max-content;
  @media all and (max-width: 420px) {
    max-width: 200px;
  }
}
</style>

<i18n>
{
"en": {
"spouseEmail": "Your spouse email",
"acceptAuthor": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"title": "Who will be you spouse ?",
"invite-waiting": "Waiting for confirmation",
"invite-sent": "Invitation sent",
"add-a-spouse": "Invite your spouse",
"email-exists": "You can not associate two account with only one email address ! <br>Fullfill a different email address.",
"more-information": "How is this information useful to us?"
},
"fr": {
"spouseEmail": "L’adresse email de votre conjoint",
"acceptAuthor": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"title": "Qui sera votre conjoint·e ?",
"add-a-spouse": "Inviter votre conjoint·e",
"invite-waiting": "Invitation en attente d'envoi",
"invite-sent": "Invitation envoyée",
"email-exists": "Vous ne pouvez pas associer deux comptes à une même adresse email ! <br>Renseignez une adresse email différente.",
"more-information": "En quoi cette information nous est utile ?"
}
}
</i18n>
