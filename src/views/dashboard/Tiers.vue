<script setup>
import { onMounted, ref } from 'vue';
import { useDataStore } from '../../stores/data'; // Import du nouveau store
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const dataStore = useDataStore();
const { tiers, loading } = storeToRefs(dataStore); // Réactivité directe
const filters = ref({});
const { t } = useI18n();

// Chargement initial des données
onMounted(() => {
    dataStore.fetchTiers();
});

const getSeverity = (state) => {
    switch (state) {
        case 'Ouvert': return 'success';
        case 'En sommeil': return 'warning';
        case 'Fermé': return 'danger';
        default: return null;
    }
};

const confirmDelete = (id) => {
    if (confirm(t('tiers.delete_confirm'))) {
        dataStore.deleteTier(id);
    }
};

const editTier = (id) => {
    router.push(`/dashboard/tiers/edit/${id}`);
};
</script>

<template>
    <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('tiers.list_title') }}</h1>
            <Button :label="$t('tiers.new_client_btn')" icon="pi pi-plus" @click="router.push('/dashboard/tiers/create')" />
        </div>

        <DataTable :value="tiers" :loading="loading" paginator :rows="10" tableStyle="min-width: 50rem"
            dataKey="id" :globalFilterFields="['name', 'email', 'siret']">
            
            <template #empty>{{ $t('tiers.empty_list') }}</template>
            <template #loading>{{ $t('tiers.loading_data') }}</template>

            <Column field="name" :header="$t('tiers.columns.company')" sortable style="width: 25%"></Column>
            <Column field="city" :header="$t('tiers.columns.city')" sortable style="width: 20%"></Column>
            <Column field="email" :header="$t('tiers.columns.email')" style="width: 25%"></Column>
            <Column field="state" :header="$t('tiers.columns.status')" sortable style="width: 15%">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.state" :severity="getSeverity(slotProps.data.state)" />
                </template>
            </Column>
            <Column :header="$t('tiers.columns.actions')" style="width: 15%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" text rounded severity="info" @click="editTier(slotProps.data.id)" />
                        <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>