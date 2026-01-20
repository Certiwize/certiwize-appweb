<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrainingStore } from '../../stores/training';
import { supabase } from '../../supabase';
import { useI18n } from 'vue-i18n';

// Imports PrimeVue
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Message from 'primevue/message';

const router = useRouter();
const route = useRoute();
const trainingStore = useTrainingStore();
const { t } = useI18n();

// État
const trainingId = ref(route.params.id || null); // ID de la formation en base
const pdfUrl = ref(null); // Si rempli, on affiche le PDF
const submitting = ref(false);
const isEditMode = computed(() => !!route.params.id);

// Validation du formulaire
const isFormValid = computed(() => {
    return form.value.titre?.trim() !== '';
});

// Formulaire mappé sur vos balises
const form = ref({
    titre: '',
    maj: new Date(), // Date de mise à jour
    public_vise: '',
    grp_max: 10,
    prerequis: '',
    objc_pedagq: '',
    duree: '', // ex: "2 jours / 14h"
    dates: '', // Texte libre ou range de dates
    horaires: '09h00 - 17h00',
    lieu: '',
    num: '', // Numéro de téléphone ou référence
    mail: '',
    tarif: 0,
    ref_handi: '',
    prgm: `1er Jour :
I. Clarifier le rôle du formateur

Workshop 1 :

- Objectif :

2ème Jour : ...
`,

    moyens_pedagq: '',
    modalités_eval: ''
});

// Charger la formation si on est en mode édition
onMounted(async () => {
    if (trainingId.value) {
        try {
            const { data, error } = await supabase
                .from('formations')
                .select('*')
                .eq('id', trainingId.value)
                .single();

            if (error) throw error;
            
            // Charger les données du contenu dans le formulaire
            if (data.content) {
                form.value = { ...form.value, ...data.content };
                // Convertir la date si elle existe
                if (data.content.maj) {
                    form.value.maj = new Date(data.content.maj);
                }
            }
        } catch (err) {
            console.error('Erreur chargement formation:', err);
            alert(t('training.error_load'));
            router.push('/dashboard/catalogue');
        }
    }
});

// Actions
const handleGenerate = async () => {
    submitting.value = true;
    
    // 1. Sauvegarde d'abord
    const saveResult = await trainingStore.saveTraining(form.value, trainingId.value);
    
    if (!saveResult.success) {
        alert(t('training.error_save') + saveResult.error);
        submitting.value = false;
        return;
    }
    
    trainingId.value = saveResult.data.id; // On récupère l'ID créé

    // 2. Lancement de la génération (n8n)
    const genResult = await trainingStore.generatePdf(trainingId.value, form.value);

    if (genResult.success) {
        pdfUrl.value = genResult.pdfUrl; // Affichage du PDF
        
        // 3. Sauvegarder l'URL du PDF dans la base de données
        await trainingStore.saveTraining(form.value, trainingId.value, genResult.pdfUrl);
    } else {
        alert(t('training.error_gen') + genResult.error);
    }
    
    submitting.value = false;
};

const resetForm = () => {
    if(confirm(t('training.confirm_reset'))) {
        pdfUrl.value = null;
    }
};

const goBack = () => {
    window.location.href = '/dashboard/catalogue';
};
</script>

<template>
    <div class="max-w-5xl mx-auto pb-20">
        
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ isEditMode ? t('training.edit_title') : t('training.new_title') }}
            </h1>
            <Button :label="t('training.back')" text @click="goBack" />
        </div>

        <div v-if="pdfUrl" class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-[80vh] flex flex-col">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2 text-green-600">
                    <i class="pi pi-check-circle text-xl"></i>
                    <span class="font-bold">{{ t('training.success_doc') }}</span>
                </div>
                <div class="flex gap-2">
                    <Button :label="t('training.edit_data')" icon="pi pi-pencil" severity="secondary" @click="resetForm" />
                    <a :href="pdfUrl" target="_blank" rel="noopener">
                        <Button :label="t('training.download')" icon="pi pi-external-link" />
                    </a>
                </div>
            </div>
            <iframe :src="pdfUrl" class="w-full flex-grow rounded border border-gray-200" title="Aperçu PDF"></iframe>
        </div>

        <div v-else class="card bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
            <form @submit.prevent="handleGenerate" class="space-y-8">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="font-semibold block mb-2">{{ t('training.fields.title') }}</label>
                        <InputText v-model="form.titre" class="w-full text-lg" :placeholder="t('training.placeholders.title')" required />
                    </div>
                    <div>
                        <label class="block mb-2">{{ t('training.fields.updated_at') }}</label>
                        <Calendar v-model="form.maj" dateFormat="dd/mm/yy" showIcon class="w-full" />
                    </div>
                     <div>
                        <label class="block mb-2">{{ t('training.fields.location') }}</label>
                        <InputText v-model="form.lieu" class="w-full" :placeholder="t('training.placeholders.location')" />
                    </div>
                </div>

                <div class="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block mb-2 text-sm">{{ t('training.fields.duration') }}</label>
                        <InputText v-model="form.duree" class="w-full" :placeholder="t('training.placeholders.duration')" />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm">{{ t('training.fields.dates') }}</label>
                        <InputText v-model="form.dates" class="w-full" :placeholder="t('training.placeholders.dates')" />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm">{{ t('training.fields.schedule') }}</label>
                        <InputText v-model="form.horaires" class="w-full" />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm">{{ t('training.fields.price') }}</label>
                        <InputNumber v-model="form.tarif" mode="currency" currency="EUR" class="w-full" />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm">{{ t('training.fields.max_group') }}</label>
                        <InputNumber v-model="form.grp_max" showButtons :min="1" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="font-semibold block mb-2">{{ t('training.fields.target_audience') }}</label>
                        <Textarea v-model="form.public_vise" rows="2" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="font-semibold block mb-2">{{ t('training.fields.prerequisites') }}</label>
                        <Textarea v-model="form.prerequis" rows="2" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="font-semibold block mb-2">{{ t('training.fields.objectives') }}</label>
                        <Textarea v-model="form.objc_pedagq" rows="4" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="font-semibold block mb-2">{{ t('training.fields.program') }}</label>
                        <Textarea v-model="form.prgm" rows="6" class="w-full" :placeholder="t('training.placeholders.program')" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="font-semibold block mb-2">{{ t('training.fields.methods') }}</label>
                        <Textarea v-model="form.moyens_pedagq" rows="3" class="w-full" />
                    </div>
                    <div>
                        <label class="font-semibold block mb-2">{{ t('training.fields.evaluation') }}</label>
                        <Textarea v-model="form.modalités_eval" rows="3" class="w-full" />
                    </div>
                </div>

                <div class="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block mb-2">{{ t('training.fields.contact_num') }}</label>
                        <InputText v-model="form.num" class="w-full" />
                    </div>
                    <div>
                        <label class="block mb-2">{{ t('training.fields.contact_email') }}</label>
                        <InputText v-model="form.mail" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="font-semibold block mb-2">{{ t('training.fields.handicap_referent') }}</label>
                        <Textarea v-model="form.ref_handi" rows="2" class="w-full" />
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <Button 
                        :label="t('training.save_generate')" 
                        icon="pi pi-file-pdf" 
                        size="large" 
                        :loading="trainingStore.loading" 
                        :disabled="!isFormValid || trainingStore.loading"
                        @click="handleGenerate" 
                    />
                    <p v-if="!isFormValid" class="text-sm text-orange-500 mt-2">
                        <i class="pi pi-exclamation-triangle mr-1"></i>
                        {{ t('training.validation_warning') }}
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>