<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase';
import { useAuthStore } from '../../stores/auth';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const router = useRouter();
const auth = useAuthStore();
const projects = ref([]);
const loading = ref(true);

const fetchProjects = async () => {
  loading.value = true;
  try {
    const checkAdmin = auth.userRole === 'admin';
    console.log("Récupération projets... (userRole:", auth.userRole, ")");

    let query = supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    // Filtrer par user_id sauf si admin
    if (!checkAdmin) {
      query = query.eq('user_id', auth.user?.id);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    projects.value = data;
  } catch (e) {
    console.error('Erreur chargement projets:', e);
  } finally {
    loading.value = false;
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
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestion des Projets</h1>
      <Button label="Nouveau Projet" icon="pi pi-plus" @click="router.push('/dashboard/projets/create')" />
    </div>

    <DataTable :value="projects" :loading="loading" paginator :rows="10" 
               tableStyle="min-width: 50rem" dataKey="id">
      
      <template #empty>Aucun projet créé</template>
      <template #loading>Chargement...</template>

      <Column field="name" header="Nom du Projet" sortable style="width: 30%"></Column>
      
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
            <a v-if="slotProps.data.documents?.etude" 
               :href="slotProps.data.documents.etude" 
               target="_blank" 
               title="Étude">
              <Tag value="Etude" severity="info" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.documents?.convention" 
               :href="slotProps.data.documents.convention" 
               target="_blank" 
               title="Convention">
              <Tag value="Conv." severity="primary" icon="pi pi-file-pdf"></Tag>
            </a>
            <a v-if="slotProps.data.documents?.convocation" 
               :href="slotProps.data.documents.convocation" 
               target="_blank" 
               title="Convocation">
              <Tag value="Convoc." severity="success" icon="pi pi-file-pdf"></Tag>
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