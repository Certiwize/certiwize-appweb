<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase';
import { useAuthStore } from '../../stores/auth';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import SlowLoadingDialog from '../../components/dashboard/SlowLoadingDialog.vue';

const router = useRouter();
const auth = useAuthStore();
const projects = ref([]);
const loading = ref(true);
const showSlowLoading = ref(false);

const reloadPage = () => {
    window.location.reload();
};

const hardNavigate = (path) => {
    window.location.href = path;
};

const fetchProjects = async () => {
  if (!auth.user?.id) {
    loading.value = false;
    return;
  }

  loading.value = true;
  showSlowLoading.value = false;

  // Timer pour afficher la popup après 5s si toujours en chargement
  const slowTimer = setTimeout(() => {
    if (loading.value) {
      showSlowLoading.value = true;
    }
  }, 5000);

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
    console.error('Erreur chargement projets:', e);
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
  router.push(`/dashboard/projets/edit/${id}`);
};

const deleteProject = async (id) => {
  if (!confirm('Supprimer ce projet ?')) return;
  
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    projects.value = projects.value.filter(p => p.id !== id);
  } catch (e) {
    alert('Erreur suppression: ' + e.message);
  }
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
const validateProject = async (id) => {
  if (!confirm("Valider ce projet ? L'utilisateur pourra accéder à la Phase 2 (Convocations et Livret).")) return;
  
  try {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'Validé' })
      .eq('id', id);
    
    if (error) throw error;
    
    // Mettre à jour localement
    const project = projects.value.find(p => p.id === id);
    if (project) project.status = 'Validé';
    
    alert('Projet validé avec succès !');
  } catch (e) {
    alert('Erreur validation: ' + e.message);
  }
};
</script>

<template>
  <div class="p-8">
    <!-- Documents de référence -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border-l-4 border-blue-500">
      <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <i class="pi pi-info-circle"></i> Documents de Référence
      </h2>
      <div class="flex flex-wrap gap-4">
        <a href="/CGV_Formation.pdf" download class="no-underline">
          <Button label="Conditions Générales de Vente" icon="pi pi-file-pdf" severity="secondary" outlined />
        </a>
        <a href="/Reglement_Interieur.pdf" download class="no-underline">
          <Button label="Règlement Intérieur" icon="pi pi-file-pdf" severity="secondary" outlined />
        </a>
      </div>
    </div>

    <SlowLoadingDialog :visible="showSlowLoading" />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestion des Projets</h1>
      <Button label="Nouveau Projet" icon="pi pi-plus" @click="hardNavigate('/dashboard/projets/create')" />
    </div>

    <DataTable :value="projects" :loading="loading" paginator :rows="10" 
               tableStyle="min-width: 50rem" dataKey="id">
      
      <template #empty>Aucun projet créé</template>
      <template #loading>Chargement...</template>

      <Column field="name" header="Nom du Projet" sortable style="width: 30%"></Column>
      <Column v-if="auth.isAdmin" header="Créé par" style="width: 20%">
        <template #body="slotProps">
          <span class="text-sm text-gray-500">{{ slotProps.data.profiles?.email || 'N/A' }}</span>
        </template>
      </Column>
      
      <Column field="status" header="Statut" sortable style="width: 15%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status || 'Brouillon'" 
               :severity="getStatusSeverity(slotProps.data.status)" />
        </template>
      </Column>

      <Column field="updated_at" header="Dernière MAJ" sortable style="width: 20%">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.updated_at) }}
        </template>
      </Column>

      <Column header="Documents" style="width: 20%">
        <template #body="slotProps">
          <div class="flex gap-2 flex-wrap">
            <a v-if="slotProps.data.identification" 
               :href="slotProps.data.identification" 
               target="_blank" 
               title="Identification">
              <Tag value="Etude" severity="info" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.convention" 
               :href="slotProps.data.convention" 
               target="_blank" 
               title="Convention">
              <Tag value="Conv." severity="primary" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.convocation" 
               :href="slotProps.data.convocation" 
               target="_blank" 
               title="Convocation">
              <Tag value="Convoc." severity="success" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.livret" 
               :href="slotProps.data.livret" 
               target="_blank" 
               title="Livret d'accueil">
              <Tag value="Livret" severity="warning" icon="pi pi-file-pdf"></Tag>
            </a>
          </div>
        </template>
      </Column>

      <Column header="Actions" style="width: 20%">
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