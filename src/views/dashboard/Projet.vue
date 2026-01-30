<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import { useAuthStore } from '../../stores/auth';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import SlowLoadingDialog from '../../components/dashboard/SlowLoadingDialog.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const auth = useAuthStore();
const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();
const projects = ref([]);
const loading = ref(true);
const showSlowLoading = ref(false);

const fetchProjects = async () => {
  if (!auth.user?.id) {
    loading.value = false;
    return;
  }

  loading.value = true;
  showSlowLoading.value = false;

  const slowTimer = setTimeout(() => {
    if (loading.value) {
      showSlowLoading.value = true;
    }
  }, 10000);

  try {
    const checkAdmin = auth.userRole === 'admin';

    let query = supabase
      .from('projects')
      .select('*, profiles(email)')
      .order('updated_at', { ascending: false });

    if (!checkAdmin) {
      query = query.eq('user_id', auth.user.id);
    }

    const { data, error } = await query;

    if (error) throw error;
    projects.value = data || [];
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur chargement projets', life: 3000 });
  } finally {
    clearTimeout(slowTimer);
    loading.value = false;
    showSlowLoading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});

const editProject = (id) => {
  window.location.href = `/dashboard/projets/edit/${id}`;
};

const createProject = () => {
  window.location.href = '/dashboard/projets/create';
};

const deleteProject = (id) => {
  confirm.require({
    message: t('project_list.confirm_delete'),
    header: t('project_list.columns.actions'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        projects.value = projects.value.filter(p => p.id !== id);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Projet supprimé', life: 3000 });
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur suppression: ' + e.message, life: 3000 });
      }
    }
  });
};

const getStatusLabel = (status) => {
  if (!status) return t('project_list.status_labels.draft');
  if (status === 'Validé') return t('project_list.status_labels.validated');
  if (status === 'En attente') return t('project_list.status_labels.pending');
  if (status === 'Terminé') return t('project_list.status_labels.finished');
  return status;
};

const getStatusSeverity = (status) => {
  switch(status) {
    case 'Validé': return 'success';
    case 'En attente': return 'warn';
    case 'Terminé': return 'info';
    default: return 'secondary';
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR');
};

// Valider un projet (passer de "En attente" à "Validé")
const validateProject = (id) => {
  confirm.require({
    message: t('project_list.confirm_validate'),
    header: 'Validation',
    icon: 'pi pi-check-circle',
    acceptClass: 'p-button-success',
    accept: async () => {
      try {
        const { error } = await supabase
          .from('projects')
          .update({ status: 'Validé' })
          .eq('id', id);

        if (error) throw error;

        const project = projects.value.find(p => p.id === id);
        if (project) project.status = 'Validé';

        toast.add({ severity: 'success', summary: 'Succès', detail: t('project_list.success_validate'), life: 3000 });
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur validation: ' + e.message, life: 3000 });
      }
    }
  });
};
</script>

<template>
  <div class="p-8">
    <!-- Documents de référence -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border-l-4 border-blue-500">
      <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <i class="pi pi-info-circle"></i> {{ t('project_list.reference_docs.title') }}
      </h2>
      <div class="flex flex-wrap gap-4">
        <a href="/CGV_Formation.pdf" download class="no-underline">
          <Button :label="t('project_list.reference_docs.cgv')" icon="pi pi-file-pdf" severity="secondary" outlined />
        </a>
        <a href="/Reglement_Interieur.pdf" download class="no-underline">
          <Button :label="t('project_list.reference_docs.rules')" icon="pi pi-file-pdf" severity="secondary" outlined />
        </a>
      </div>
    </div>



    <SlowLoadingDialog :visible="showSlowLoading" />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ t('project_list.title') }}</h1>
      <Button :label="t('project_list.new_project')" icon="pi pi-plus" @click="createProject" />
    </div>

    <DataTable :value="projects" :loading="loading" paginator :rows="10" 
               tableStyle="min-width: 50rem" dataKey="id">
      
      <template #empty>{{ t('project_list.empty') }}</template>
      <template #loading>{{ t('project_list.loading') }}</template>

      <Column field="name" :header="t('project_list.columns.name')" sortable style="width: 30%"></Column>
      <Column v-if="auth.isAdmin" :header="t('project_list.columns.created_by')" style="width: 20%">
        <template #body="slotProps">
          <span class="text-sm text-gray-500">{{ slotProps.data.profiles?.email || 'N/A' }}</span>
        </template>
      </Column>
      
      <Column field="status" :header="t('project_list.columns.status')" sortable style="width: 15%">
        <template #body="slotProps">
          <Tag :value="getStatusLabel(slotProps.data.status)" 
               :severity="getStatusSeverity(slotProps.data.status)" />
        </template>
      </Column>

      <Column field="updated_at" :header="t('project_list.columns.updated_at')" sortable style="width: 20%">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.updated_at) }}
        </template>
      </Column>

      <Column :header="t('project_list.columns.documents')" style="width: 20%">
        <template #body="slotProps">
          <div class="flex gap-2 flex-wrap">
            <a v-if="slotProps.data.identification" 
               :href="slotProps.data.identification" 
               target="_blank" 
               title="Identification">
              <Tag :value="t('project_list.doc_tags.study')" severity="info" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.convention" 
               :href="slotProps.data.convention" 
               target="_blank" 
               title="Convention">
              <Tag :value="t('project_list.doc_tags.conv')" severity="primary" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.convocation" 
               :href="slotProps.data.convocation" 
               target="_blank" 
               title="Convocation">
              <Tag :value="t('project_list.doc_tags.convoc')" severity="success" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.livret" 
               :href="slotProps.data.livret" 
               target="_blank" 
               title="Livret d'accueil">
              <Tag :value="t('project_list.doc_tags.booklet')" severity="warning" icon="pi pi-file-pdf"></Tag>
            </a>
          </div>
        </template>
      </Column>

      <Column :header="t('project_list.columns.actions')" style="width: 20%">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button v-if="auth.isAdmin && slotProps.data.status === 'En attente'" 
                    icon="pi pi-check" text rounded severity="success" 
                    @click="validateProject(slotProps.data.id)" 
                    v-tooltip.top="'Valider'" />
            <Button icon="pi pi-pencil" text rounded severity="info" 
                    @click="editProject(slotProps.data.id)" 
                    v-tooltip.top="'Éditer'" />
            <Button icon="pi pi-trash" text rounded severity="danger" 
                    @click="deleteProject(slotProps.data.id)"
                    v-tooltip.top="'Supprimer'" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>