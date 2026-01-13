<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTrainingStore } from '../../stores/training';
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import SlowLoadingDialog from '../../components/dashboard/SlowLoadingDialog.vue';

const router = useRouter();
const trainingStore = useTrainingStore();
const authStore = useAuthStore();
const { formations, loading } = storeToRefs(trainingStore);

const showSlowLoading = ref(false);

const hardNavigate = (path) => {
    window.location.href = path;
};

onMounted(async () => {
  loading.value = true;
  showSlowLoading.value = false;

  const slowTimer = setTimeout(() => {
    if (loading.value) {
      showSlowLoading.value = true;
    }
  }, 10000);

  try {
    await trainingStore.fetchFormations();
  } finally {
    clearTimeout(slowTimer);
    showSlowLoading.value = false;
  }
});

const confirmDelete = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
    trainingStore.deleteFormation(id);
  }
};

const editFormation = (id) => {
  hardNavigate(`/dashboard/catalogue/edit/${id}`);
};

const viewPdf = (pdfUrl) => {
  if (pdfUrl) {
    window.open(pdfUrl, '_blank');
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR');
};
</script>

<template>
  <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <SlowLoadingDialog :visible="showSlowLoading" />
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Catalogue de Formation</h1>
      <Button label="Nouvelle Formation" icon="pi pi-plus" @click="hardNavigate('/dashboard/catalogue/create')" />
    </div>

    <DataTable :value="formations" :loading="loading" paginator :rows="10" tableStyle="min-width: 50rem"
        dataKey="id" :globalFilterFields="['title']">
        
        <template #empty>Aucune formation créée</template>
        <template #loading>Chargement des formations...</template>

        <Column field="title" header="Titre" sortable style="width: 40%"></Column>
        <Column v-if="authStore.isAdmin" header="Créé par" style="width: 20%">
            <template #body="slotProps">
                <span class="text-sm text-gray-500">{{ slotProps.data.profiles?.email || 'N/A' }}</span>
            </template>
        </Column>
        <Column field="updated_at" header="Dernière modification" sortable style="width: 25%">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.updated_at) }}
          </template>
        </Column>
        <Column field="content.duree" header="Durée" style="width: 15%">
          <template #body="slotProps">
            {{ slotProps.data.content?.duree || '-' }}
          </template>
        </Column>
        <Column header="Actions" style="width: 20%">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editFormation(slotProps.data.id)" 
                      v-tooltip.top="'Éditer'" />
              
              <Button 
                v-if="slotProps.data.pdf_url" 
                icon="pi pi-file-pdf" 
                text 
                rounded 
                severity="success" 
                @click="viewPdf(slotProps.data.pdf_url)"
                v-tooltip.top="'Voir PDF'" 
              />
              
              <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data.id)"
                      v-tooltip.top="'Supprimer'" />
            </div>
          </template>
        </Column>
    </DataTable>
  </div>
</template>
