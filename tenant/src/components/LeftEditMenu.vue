<template>
  <div class="left-edit-menu">
    <div class="inner-left-edit fr-mt-7w">
      <div class="active step">
        <div class="step-number">1</div>
        <div class="step-title">
          <router-link :to="{ name: 'TenantName' }" class="fr-link">
            {{ $t("personal-information") }}</router-link
          >
        </div>
      </div>
      <div class="vline" :class="getClass(0)">
        <div class="ml-5">
          <router-link :to="{ name: 'Profile' }"
            ><ColoredTag
              :text="`${user.firstName} ${user.lastName}`"
              status="NAME"
            ></ColoredTag
          ></router-link>
        </div>
        <div class="ml-5" v-if="user.applicationType">
          <router-link :to="{ name: 'TenantType' }"
            ><ColoredTag
              :text="$t(user.applicationType)"
              :status="user.applicationType"
              :active="step < 2"
            ></ColoredTag
          ></router-link>
        </div>
      </div>
      <div class="step" :class="getClass(1)">
        <div class="step-number">2</div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
            >{{ $t("my-document") }}</router-link
          >
        </div>
      </div>
      <div class="vline" :class="getClass(1)">
        <div v-if="step === 2">
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '1' } }"
              ><ColoredTag
                :text="$t('identification')"
                :status="tenantStatus('IDENTITY')"
                :active="getTenantCurrentStep(1)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '2' } }"
              ><ColoredTag
                :text="$t('residency')"
                :status="tenantStatus('RESIDENCY')"
                :active="getTenantCurrentStep(2)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '3' } }"
              ><ColoredTag
                :text="$t('professional')"
                :status="tenantStatus('PROFESSIONAL')"
                :active="getTenantCurrentStep(3)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '4' } }"
              ><ColoredTag
                :text="$t('financial')"
                :status="tenantStatus('FINANCIAL')"
                :active="getTenantCurrentStep(4)"
              ></ColoredTag
            ></router-link>
          </div>
          <div class="ml-5">
            <router-link
              :to="{ name: 'TenantDocuments', params: { substep: '5' } }"
              ><ColoredTag
                :text="$t('tax')"
                :status="tenantStatus('TAX')"
                :active="getTenantCurrentStep(5)"
              ></ColoredTag
            ></router-link>
          </div>
        </div>
      </div>
      <div class="step" :class="getClass(2)">
        <div class="step-number">3</div>
        <div class="step-title">
          <router-link class="fr-link" :to="getGuarantorLink()">{{
            $t("my-guarantor")
          }}</router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(2)">
        <div v-if="step === 3 && selectedGuarantor">
          <div
            v-if="
              selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
                selectedGuarantor.firstName !== undefined &&
                selectedGuarantor.lastName !== undefined
            "
          >
            <div v-for="(g, k) in user.guarantors" :key="k">
              <div class="ml-5 bold">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '0', guarantorId: g.id }
                  }"
                  ><ColoredTag
                    :text="`${g.firstName} ${g.lastName}`"
                    status="NONE"
                    :active="getGuarantorCurrentStep(0, g)"
                  ></ColoredTag
                ></router-link>
              </div>
              <div class="ml-10">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '1', guarantorId: g.id }
                  }"
                  ><ColoredTag
                    :text="$t('identification')"
                    :status="guarantorStatus('IDENTITY', g)"
                    :active="getGuarantorCurrentStep(1, g)"
                  ></ColoredTag
                ></router-link>
              </div>
              <div class="ml-10">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '2', guarantorId: g.id }
                  }"
                  ><ColoredTag
                    :text="$t('residency')"
                    :status="guarantorStatus('RESIDENCY', g)"
                    :active="getGuarantorCurrentStep(2, g)"
                  ></ColoredTag
                ></router-link>
              </div>
              <div class="ml-10">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '3', guarantorId: g.id }
                  }"
                  ><ColoredTag
                    :text="$t('professional')"
                    :status="guarantorStatus('PROFESSIONAL', g)"
                    :active="getGuarantorCurrentStep(3, g)"
                  ></ColoredTag
                ></router-link>
              </div>
              <div class="ml-10">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '4', guarantorId: g.id }
                  }"
                  ><ColoredTag
                    :text="$t('financial')"
                    :status="guarantorStatus('FINANCIAL', g)"
                    :active="getGuarantorCurrentStep(4, g)"
                  ></ColoredTag
                ></router-link>
              </div>
              <div class="ml-10">
                <router-link
                  :to="{
                    name: 'GuarantorDocuments',
                    params: { substep: '5', guarantorId: g.id }
                  }"
                  ><ColoredTag
                    :text="$t('tax')"
                    :status="guarantorStatus('TAX', g)"
                    :active="getGuarantorCurrentStep(5, g)"
                  ></ColoredTag
                ></router-link>
              </div>
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '0' } }"
                ><ColoredTag
                  :text="$t('identification-legal-person')"
                  :status="
                    guarantorStatus(
                      'IDENTIFICATION_LEGAL_PERSON',
                      selectedGuarantor
                    )
                  "
                  :active="getGuarantorCurrentStep(0)"
                ></ColoredTag
              ></router-link>
            </div>
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '1' } }"
                ><ColoredTag
                  :text="$t('identity-represent')"
                  :status="guarantorStatus('IDENTIFICATION', selectedGuarantor)"
                  :active="getGuarantorCurrentStep(1)"
                ></ColoredTag
              ></router-link>
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'">
            <div class="ml-5">
              <router-link
                :to="{ name: 'GuarantorDocuments', params: { substep: '0' } }"
                ><ColoredTag
                  :text="$t('identification-organism')"
                  :status="guarantorStatus('IDENTIFICATION', selectedGuarantor)"
                  :active="getGuarantorCurrentStep(0)"
                ></ColoredTag
              ></router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="step" :class="getClass(3)">
        <div class="step-number">4</div>
        <div class="step-title">
          <router-link class="fr-link" :to="{ name: 'ValidateFile' }">{{
            $t("validate-file")
          }}</router-link>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { DocumentService } from "../services/DocumentService";
import StatusIcon from "df-shared/src/components/StatusIcon.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { User } from "df-shared/src/models/User";

@Component({
  components: { StatusIcon, ColoredTag },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor",
      user: "user"
    })
  }
})
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) step!: number;
  selectedGuarantor!: Guarantor;
  user!: User;

  getClass(s: number) {
    if (this.getStep(s)) {
      return "active";
    }
    return "";
  }

  guarantorStatus(documentType: string, guarantor: Guarantor) {
    return DocumentService.guarantorStatus(documentType, guarantor);
  }

  tenantStatus(documentType: string) {
    return DocumentService.tenantStatus(documentType);
  }

  getTenantCurrentStep(substep: number): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return this.step === 2 && s === substep;
  }

  getGuarantorCurrentStep(substep: number, g: Guarantor): boolean {
    const s = Number(this.$route.params.substep) || 0;
    return (
      this.step === 3 &&
      s === substep &&
      (g === undefined || this.selectedGuarantor.id === g.id)
    );
  }

  getGuarantorLink() {
    if (this.selectedGuarantor.typeGuarantor !== undefined) {
      return { name: "GuarantorList" };
    }
    return { name: "GuarantorChoice" };
  }

  getStep(s: number) {
    switch (this.step) {
      case 0:
      case 1:
        return s <= 0;
      case 2:
        return s <= 1;
      case 3:
        return s <= 2;
      case 4:
        return s <= 3;
      default:
        return s <= 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.left-edit-menu {
  background-color: var(--background-default-grey);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}

.vline {
  margin-left: 23px;
  border-left: 1px solid var(--g400-t);
  z-index: 0;
  min-height: 25px;
  &.active {
    border-left: 1px solid var(--primary);
  }
}

.step {
  display: flex;
  align-items: center;
  height: 3rem;
}

.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  min-width: 2.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}

.step-title {
  padding: 5px 5px 0;
}

.hidden {
  visibility: hidden;
}

.ml-5 {
  margin-left: -1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.ml-10 {
  margin-left: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.fr-link {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}

.bold {
  font-weight: bold;
}

[href] {
  box-shadow: none;
}
</style>

<i18n>
{
  "en": {
    "ALONE": "Alone",
    "COUPLE": "Couple",
    "GROUP": "Roommate"
  },
  "fr": {
    "ALONE": "Seul·e",
    "COUPLE": "En couple",
    "GROUP": "En colocation"
  }
}
</i18n>
