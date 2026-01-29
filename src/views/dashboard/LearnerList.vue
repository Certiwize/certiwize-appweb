<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase';
import { useAuthStore } from '../../stores/auth';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Message from 'primevue/message';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const confirmDialog = useConfirm();
const toast = useToast();

const learners = ref([]);
const loading = ref(true);
const selectedLearner = ref(null);
const showSendDialog = ref(false);
const sendingDoc = ref(false);
const sendError = ref('');
const sendSuccess = ref('');

// Document types for webhook - mapped to project fields
const documentTypes = [
  { label: 'Livret d\'accueil', value: 'livret', icon: 'pi-book', projectField: 'livret' },
  { label: 'Convocation', value: 'convocation', icon: 'pi-calendar', projectField: 'convocation' },
  { label: 'Enquête satisfaction', value: 'satisfaction_survey', icon: 'pi-chart-bar', projectField: null }, // Always available
  { label: 'Attestation de fin', value: 'completion_certificate', icon: 'pi-verified', projectField: null }, // Always available
  { label: 'Quiz positionnement', value: 'positioning_quiz', icon: 'pi-question-circle', projectField: null }, // Always available
  { label: 'Quiz évaluation', value: 'evaluation_quiz', icon: 'pi-check-square', projectField: null }, // Always available
];

const fetchLearners = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('learners')
      .select(`
        *,
        projects(id, name, livret, convocation, convention),
        tiers(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    learners.value = data || [];
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur chargement apprenants', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const navigate = (path) => {
  router.push(path);
};

const confirmDelete = (id) => {
  confirmDialog.require({
    message: t('learner.delete_confirm'),
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        const { error } = await supabase.from('learners').delete().eq('id', id);
        if (error) throw error;
        await fetchLearners();
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Apprenant supprimé', life: 3000 });
      } catch (err) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur suppression', life: 3000 });
      }
    }
  });
};

const openSendDialog = (learner) => {
  selectedLearner.value = learner;
  sendError.value = '';
  sendSuccess.value = '';
  showSendDialog.value = true;
};

// Check if a document is ready to be sent
const isDocReady = (docType) => {
  if (!selectedLearner.value) return false;
  
  const doc = documentTypes.find(d => d.value === docType);
  
  // If no projectField mapping, it's always available (like surveys/quizzes)
  if (!doc?.projectField) return true;
  
  // If no project linked, document is not available
  if (!selectedLearner.value.projects) return false;
  
  // Check if the project has the document generated
  const docUrl = selectedLearner.value.projects[doc.projectField];
  return !!docUrl && docUrl.trim() !== '';
};

// Send document via n8n webhook
const sendDocument = async (docType) => {
  if (!selectedLearner.value) return;
  if (!isDocReady(docType)) return;
  
  sendingDoc.value = true;
  sendError.value = '';
  sendSuccess.value = '';

  try {
    // 1. Create a pending record in learner_documents
    const { data: docRecord, error: insertError } = await supabase
      .from('learner_documents')
      .insert({
        learner_id: selectedLearner.value.id,
        doc_type: docType,
        webhook_status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Call n8n webhook (user will configure this URL)
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
    
    if (!webhookUrl) {
      // No webhook configured, just mark as pending
      sendSuccess.value = t('learner.webhook_pending');
    } else {
      const payload = {
        learner: {
          id: selectedLearner.value.id,
          first_name: selectedLearner.value.first_name,
          last_name: selectedLearner.value.last_name,
          email: selectedLearner.value.email,
          phone: selectedLearner.value.phone
        },
        doc_type: docType,
        project: selectedLearner.value.projects,
        tier: selectedLearner.value.tiers,
        document_id: docRecord.id
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 3. Update status based on response
      const webhookResponse = await response.json().catch(() => ({}));
      
      await supabase
        .from('learner_documents')
        .update({
          sent_at: new Date().toISOString(),
          webhook_status: response.ok ? 'sent' : 'error',
          webhook_response: webhookResponse
        })
        .eq('id', docRecord.id);

      if (response.ok) {
        sendSuccess.value = t('learner.send_success');
      } else {
        throw new Error('Webhook returned an error');
      }
    }
  } catch (err) {
    sendError.value = t('learner.send_error') + ': ' + err.message;
  } finally {
    sendingDoc.value = false;
  }
};

// Send all available documents at once
const sendAllDocuments = async () => {
  if (!selectedLearner.value) return;
  
  sendingDoc.value = true;
  sendError.value = '';
  sendSuccess.value = '';

  try {
    // Get all ready document types
    const readyDocs = documentTypes.filter(doc => isDocReady(doc.value)).map(doc => doc.value);
    
    if (readyDocs.length === 0) {
      sendError.value = t('learner.no_docs_available');
      return;
    }

    // Create records for all documents
    const { data: docRecords, error: insertError } = await supabase
      .from('learner_documents')
      .insert(
        readyDocs.map(docType => ({
          learner_id: selectedLearner.value.id,
          doc_type: docType,
          webhook_status: 'pending'
        }))
      )
      .select();

    if (insertError) throw insertError;

    // Call n8n webhook with all documents
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
    
    if (!webhookUrl) {
      sendSuccess.value = t('learner.webhook_pending');
    } else {
      const payload = {
        learner: {
          id: selectedLearner.value.id,
          first_name: selectedLearner.value.first_name,
          last_name: selectedLearner.value.last_name,
          email: selectedLearner.value.email,
          phone: selectedLearner.value.phone
        },
        doc_types: readyDocs,
        send_all: true,
        project: selectedLearner.value.projects,
        tier: selectedLearner.value.tiers,
        document_ids: docRecords.map(r => r.id)
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const webhookResponse = await response.json().catch(() => ({}));
      
      // Update all records
      await supabase
        .from('learner_documents')
        .update({
          sent_at: new Date().toISOString(),
          webhook_status: response.ok ? 'sent' : 'error',
          webhook_response: webhookResponse
        })
        .in('id', docRecords.map(r => r.id));

      if (response.ok) {
        sendSuccess.value = t('learner.send_all_success', { count: readyDocs.length });
      } else {
        throw new Error('Webhook returned an error');
      }
    }
  } catch (err) {
    sendError.value = t('learner.send_error') + ': ' + err.message;
  } finally {
    sendingDoc.value = false;
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Inscrit': return 'info';
    case 'En cours': return 'warning';
    case 'Terminé': return 'success';
    default: return 'secondary';
  }
};

onMounted(fetchLearners);
</script>

<template>
  <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('learner.list_title') }}</h1>
        <p class="text-gray-500 text-sm">{{ t('learner.list_subtitle') }}</p>
      </div>
      
      <Button :label="t('learner.new_learner_btn')" icon="pi pi-plus" @click="navigate('/dashboard/learners/create')" />
    </div>

    <DataTable 
      :value="learners" 
      :loading="loading" 
      paginator 
      :rows="10" 
      tableStyle="min-width: 50rem"
      dataKey="id"
    >
      <template #empty>{{ t('learner.empty_list') }}</template>
      <template #loading>{{ t('learner.loading_data') }}</template>

      <Column field="last_name" :header="t('learner.columns.name')" sortable style="width: 20%">
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.last_name }} {{ slotProps.data.first_name }}</span>
        </template>
      </Column>
      <Column field="email" :header="t('learner.columns.email')" style="width: 20%"></Column>
      <Column field="phone" :header="t('learner.columns.phone')" style="width: 15%"></Column>
      <Column :header="t('learner.columns.project')" style="width: 15%">
        <template #body="slotProps">
          <span class="text-sm">{{ slotProps.data.projects?.name || '-' }}</span>
        </template>
      </Column>
      <Column :header="t('learner.columns.tier')" style="width: 15%">
        <template #body="slotProps">
          <span class="text-sm">{{ slotProps.data.tiers?.name || '-' }}</span>
        </template>
      </Column>
      <Column field="status" :header="t('learner.columns.status')" sortable style="width: 10%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
        </template>
      </Column>
      <Column :header="t('learner.columns.actions')" style="width: 15%">
        <template #body="slotProps">
          <div class="flex gap-1">
            <Button icon="pi pi-send" text rounded severity="success" v-tooltip="t('learner.send_docs')" @click="openSendDialog(slotProps.data)" />
            <Button icon="pi pi-pencil" text rounded severity="info" @click="navigate(`/dashboard/learners/edit/${slotProps.data.id}`)" />
            <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data.id)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Send Document Dialog -->
    <Dialog v-model:visible="showSendDialog" :header="t('learner.send_dialog_title')" :style="{ width: '550px' }" modal>
      <div v-if="selectedLearner" class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p class="font-semibold">{{ selectedLearner.first_name }} {{ selectedLearner.last_name }}</p>
          <p class="text-sm text-gray-500">{{ selectedLearner.email }}</p>
          <p v-if="selectedLearner.projects" class="text-xs text-primary mt-1">
            <i class="pi pi-briefcase mr-1"></i>{{ selectedLearner.projects.name }}
          </p>
          <p v-else class="text-xs text-orange-500 mt-1">
            <i class="pi pi-exclamation-triangle mr-1"></i>{{ t('learner.no_project_warning') }}
          </p>
        </div>

        <Message v-if="sendError" severity="error" :closable="false">{{ sendError }}</Message>
        <Message v-if="sendSuccess" severity="success" :closable="false">{{ sendSuccess }}</Message>

        <div class="grid grid-cols-2 gap-3">
          <Button 
            v-for="doc in documentTypes" 
            :key="doc.value"
            :label="doc.label"
            :icon="`pi ${doc.icon}`"
            outlined
            :loading="sendingDoc"
            :disabled="!isDocReady(doc.value)"
            @click="sendDocument(doc.value)"
            class="justify-start"
            :class="{ 'opacity-50 cursor-not-allowed': !isDocReady(doc.value) }"
          >
            <template #default>
              <span class="flex items-center gap-2 w-full">
                <i :class="`pi ${doc.icon}`"></i>
                <span class="flex-1 text-left text-sm">{{ doc.label }}</span>
                <i v-if="!isDocReady(doc.value)" class="pi pi-lock text-xs text-gray-400"></i>
                <i v-else class="pi pi-check-circle text-xs text-green-500"></i>
              </span>
            </template>
          </Button>
        </div>

        <!-- Send All Button -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <Button 
            :label="t('learner.send_all_btn')"
            icon="pi pi-send"
            severity="success"
            class="w-full"
            :loading="sendingDoc"
            @click="sendAllDocuments"
          />
        </div>

        <p class="text-xs text-gray-500 text-center mt-2">
          <i class="pi pi-info-circle mr-1"></i>{{ t('learner.doc_ready_hint') }}
        </p>
      </div>
    </Dialog>
  </div>
</template>
