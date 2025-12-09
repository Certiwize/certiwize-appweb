<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import { useAuthStore } from '../stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const form = ref({
  trainingName: '',
  companyName: '',
  companyAddress: '',
  siret: '',
  managerName: '',
  trainingType: 'presentiel',
  duration: '',
  period: '',
  nbDays: null,
  date: null,
  rate: null,
  fees: null
});

const loading = ref(false);
const msg = ref({ type: '', content: '' });
const pdfUrl = ref(null);
const showPdfPreview = ref(false);

const trainingTypes = [
  { label: 'Présentiel', value: 'presentiel' },
  { label: 'Hybride', value: 'hybrid' }
];

// Calcul automatique du total
const total = computed(() => {
  const rate = form.value.rate || 0;
  const fees = form.value.fees || 0;
  return rate + fees;
});

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    form.value.trainingName &&
    form.value.companyName &&
    form.value.companyAddress &&
    form.value.siret &&
    form.value.managerName &&
    form.value.trainingType &&
    form.value.duration &&
    form.value.period &&
    form.value.nbDays &&
    form.value.date &&
    form.value.rate !== null &&
    form.value.fees !== null &&
    form.value.siret.length === 14 &&
    !isNaN(form.value.siret)
  );
});

const generateDocument = async () => {
  msg.value = { type: '', content: '' };
  loading.value = true;

  try {
    // Formater la date
    const dateObj = new Date(form.value.date);
    const formattedDate = dateObj.toLocaleDateString('fr-FR');

    const payload = {
      trainingName: form.value.trainingName,
      companyName: form.value.companyName,
      companyAddress: form.value.companyAddress,
      siret: form.value.siret,
      managerName: form.value.managerName,
      trainingType: form.value.trainingType,
      duration: form.value.duration,
      period: form.value.period,
      nbDays: form.value.nbDays,
      date: formattedDate,
      rate: form.value.rate,
      fees: form.value.fees,
      total: total.value,
      userEmail: authStore.user?.email,
      timestamp: new Date().toISOString()
    };

    const response = await fetch('/api/generate-convention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.session?.access_token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.pdfUrl) {
      pdfUrl.value = result.pdfUrl;
      showPdfPreview.value = true;
      msg.value = { 
        type: 'success', 
        content: 'Convention générée avec succès ! Le téléchargement va commencer...' 
      };

      // Télécharger automatiquement le PDF
      downloadPdf(result.pdfUrl);
    } else {
      msg.value = { 
        type: 'error', 
        content: result.error || 'Erreur lors de la génération du document' 
      };
    }
  } catch (error) {
    console.error(error);
    msg.value = { 
      type: 'error', 
      content: 'Erreur de communication avec le serveur' 
    };
  } finally {
    loading.value = false;
  }
};

const downloadPdf = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = `convention_${form.value.companyName.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const resetForm = () => {
  form.value = {
    trainingName: '',
    companyName: '',
    companyAddress: '',
    siret: '',
    managerName: '',
    trainingType: 'presentiel',
    duration: '',
    period: '',
    nbDays: null,
    date: null,
    rate: null,
    fees: null
  };
  pdfUrl.value = null;
  showPdfPreview.value = false;
  msg.value = { type: '', content: '' };
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Générer une convention de formation
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Remplissez le formulaire ci-dessous pour générer automatiquement votre convention conforme Qualiopi.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulaire -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <form @submit.prevent="generateDocument" class="space-y-6">
              <!-- Informations de la formation -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <i class="pi pi-book mr-2"></i>Informations de la formation
                </h2>

                <div class="space-y-4">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom de la formation *
                    </label>
                    <InputText 
                      v-model="form.trainingName" 
                      class="w-full"
                      placeholder="Ex: Formation développeur web"
                      required 
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type de formation *
                      </label>
                      <Dropdown 
                        v-model="form.trainingType" 
                        :options="trainingTypes"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
                      />
                    </div>

                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Durée (Ex: 40h) *
                      </label>
                      <InputText 
                        v-model="form.duration" 
                        class="w-full"
                        placeholder="Ex: 40h"
                        required 
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Période *
                      </label>
                      <InputText 
                        v-model="form.period" 
                        class="w-full"
                        placeholder="Ex: Janvier à Mars 2024"
                        required 
                      />
                    </div>

                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre de jours *
                      </label>
                      <InputNumber 
                        v-model="form.nbDays" 
                        class="w-full"
                        :min="1"
                        required 
                      />
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date de formation (jj/mm/aaaa) *
                    </label>
                    <Calendar 
                      v-model="form.date" 
                      dateFormat="dd/mm/yy"
                      class="w-full"
                      showIcon
                      required 
                    />
                  </div>
                </div>
              </div>

              <!-- Informations de l'entreprise -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <i class="pi pi-building mr-2"></i>Informations de l'entreprise
                </h2>

                <div class="space-y-4">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom de l'entreprise *
                    </label>
                    <InputText 
                      v-model="form.companyName" 
                      class="w-full"
                      placeholder="Ex: Acme Corp"
                      required 
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse de l'entreprise *
                    </label>
                    <Textarea 
                      v-model="form.companyAddress" 
                      rows="2"
                      class="w-full"
                      placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
                      required 
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        SIRET (14 chiffres) *
                      </label>
                      <InputText 
                        v-model="form.siret" 
                        class="w-full"
                        placeholder="12345678901234"
                        maxlength="14"
                        required 
                      />
                      <small 
                        :class="form.siret.length === 14 ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ form.siret.length }}/14 chiffres
                      </small>
                    </div>

                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom du gérant *
                      </label>
                      <InputText 
                        v-model="form.managerName" 
                        class="w-full"
                        placeholder="Ex: Jean Dupont"
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tarification -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <i class="pi pi-euro mr-2"></i>Tarification
                </h2>

                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tarif (€) *
                      </label>
                      <InputNumber 
                        v-model="form.rate" 
                        class="w-full"
                        :min="0"
                        mode="currency"
                        currency="EUR"
                        locale="fr-FR"
                        required 
                      />
                    </div>

                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Frais (€) *
                      </label>
                      <InputNumber 
                        v-model="form.fees" 
                        class="w-full"
                        :min="0"
                        mode="currency"
                        currency="EUR"
                        locale="fr-FR"
                        required 
                      />
                    </div>

                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total (€)
                      </label>
                      <div class="bg-primary/10 dark:bg-primary/20 border border-primary p-3 rounded-lg">
                        <p class="text-2xl font-bold text-primary">
                          {{ total.toFixed(2) }} €
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Messages -->
              <Message 
                v-if="msg.content" 
                :severity="msg.type" 
                :closable="false"
              >
                {{ msg.content }}
              </Message>

              <!-- Boutons -->
              <div class="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  :label="'Générer le document'" 
                  icon="pi pi-download"
                  :loading="loading"
                  :disabled="!isFormValid"
                  class="flex-1"
                />
                <Button 
                  type="button"
                  label="Réinitialiser"
                  icon="pi pi-refresh"
                  severity="secondary"
                  @click="resetForm"
                />
              </div>
            </form>
          </div>
        </div>

        <!-- Aperçu PDF -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-20">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              <i class="pi pi-file-pdf mr-2 text-red-600"></i>Aperçu du document
            </h3>

            <div v-if="!showPdfPreview" class="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
              <i class="pi pi-image text-5xl text-gray-400 mb-4"></i>
              <p class="text-gray-600 dark:text-gray-400">
                L'aperçu du PDF s'affichera ici après la génération
              </p>
            </div>

            <div v-else class="space-y-4">
              <!-- Aperçu PDF intégré -->
              <iframe 
                v-if="pdfUrl"
                :src="pdfUrl"
                class="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg"
              ></iframe>

              <!-- Bouton de téléchargement -->
              <Button 
                v-if="pdfUrl"
                label="Télécharger le PDF"
                icon="pi pi-download"
                @click="downloadPdf(pdfUrl)"
                class="w-full"
                severity="success"
              />

              <!-- Résumé des données -->
              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Formation</p>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ form.trainingName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Entreprise</p>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ form.companyName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p class="font-bold text-2xl text-primary">{{ total.toFixed(2) }} €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>