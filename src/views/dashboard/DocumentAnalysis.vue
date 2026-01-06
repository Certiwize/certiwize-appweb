<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';

const auth = useAuthStore();
const selectedType = ref(null);
const file = ref(null);
const loading = ref(false);
const success = ref(false);
const error = ref(null);
const analysisResult = ref('');

const docTypes = [
    { name: 'Déclaration d\'activité', code: 'DECLARATION_ACTIVITE' },
    { name: 'Certificat Qualiopi', code: 'CERTIFICAT_QUALIOPI' },
    { name: 'Bilan Pédagogique et Financier', code: 'BPF_BILAN_PEDAGOGIQUE_FINANCIER' },
    { name: 'KBIS', code: 'KBIS' },
    { name: 'Programme de formation', code: 'PROGRAMME_FORMATION' },
    { name: 'Feuille d\'émargement', code: 'FEUILLE_EMARGEMENT' },
    { name: 'Attestation de formation', code: 'ATTESTATION_FORMATION' },
    { name: 'Certificat de réalisation', code: 'CERTIFICAT_REALISATION' },
    { name: 'Contrat de formation', code: 'CONTRAT_FORMATION' },
    { name: 'Convention de formation', code: 'CONVENTION_FORMATION' },
    { name: 'CV Formateur', code: 'CV_FORMATEUR' },
    { name: 'Justificatif de compétences', code: 'JUSTIFICATIF_COMPETENCES' },
    { name: 'Facture', code: 'FACTURE_FORMATION' },
    { name: 'Règlement Intérieur', code: 'REGLEMENT_INTERIEUR' }
];

const onFileSelect = (event) => {
    file.value = event.files[0];
    error.value = null;
    success.value = false;
    analysisResult.value = '';
};

const sendDocument = async () => {
    if (!file.value || !selectedType.value) return;

    loading.value = true;
    error.value = null;
    success.value = false;
    analysisResult.value = '';

    try {
        const formData = new FormData();
        formData.append('file', file.value);
        formData.append('docType', selectedType.value.code);

        // Appel à notre API intermédiaire
        const response = await fetch('/api/analyze-doc', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.session?.access_token}`
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || "Erreur lors de l'envoi");

        success.value = true;
        
        // Afficher le résultat renvoyé par n8n (supposons que c'est dans result.text ou result.output)
        // Sinon, on affiche tout le JSON pour le debug
        analysisResult.value = result.text || JSON.stringify(result, null, 2);
        
        // On garde le fichier sélectionné pour référence ou on reset ?
        // Reset pour nouvelle analyse
        // file.value = null; 
        // selectedType.value = null; 
    } catch (err) {
        console.error('Erreur analyze:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <!-- Colonne Gauche : Upload -->
        <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-fit">
            <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Analyse de Document</h1>

            <div class="flex flex-col gap-6">
                <!-- Sélection du type -->
                <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700 dark:text-gray-300">Type de document</label>
                    <Dropdown v-model="selectedType" :options="docTypes" optionLabel="name" placeholder="Sélectionnez un type" 
                        class="w-full" :disabled="loading" filter />
                </div>

                <!-- Upload Fichier (Drag & Drop) -->
                <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700 dark:text-gray-300">Document (PDF, JPG, PNG)</label>
                    <FileUpload name="docs[]" url="/api/upload" @select="onFileSelect" :maxFileSize="10000000" accept=".pdf,.jpg,.jpeg,.png"
                        :auto="false" :customUpload="true" @uploader="() => {}"
                        chooseLabel="Choisir ou Glisser" cancelLabel="Annuler" 
                        class="w-full" :disabled="loading">
                        <template #empty>
                            <div class="flex flex-col items-center justify-center p-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                                <i class="pi pi-cloud-upload text-4xl mb-3 text-slate-400"></i>
                                <p>Glissez-déposez votre fichier ici</p>
                            </div>
                        </template>
                    </FileUpload>
                </div>

                <!-- Bouton Envoyer -->
                <Button label="Lancer l'analyse" icon="pi pi-bolt" @click="sendDocument" 
                    :loading="loading" :disabled="!file || !selectedType" severity="primary" size="large" />

                <!-- Messages -->
                <Message v-if="success" severity="success" :closable="false">Analyse terminée avec succès !</Message>
                <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
            </div>
        </div>

        <!-- Colonne Droite : Résultat -->
        <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col h-full" v-if="analysisResult || loading">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <i class="pi pi-file-edit text-primary"></i> Résultat de l'analyse
            </h2>
            
            <div v-if="loading" class="flex-1 flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
                <i class="pi pi-spin pi-spinner text-4xl mb-4 text-primary"></i>
                <p>Analyse en cours via n8n...</p>
            </div>

            <div v-else class="flex-1 flex flex-col min-h-[300px]">
                <Textarea v-model="analysisResult" rows="15" class="w-full h-full font-mono text-sm bg-gray-50 dark:bg-gray-900" readonly />
                <div class="flex justify-end mt-4">
                    <Button icon="pi pi-copy" label="Copier" severity="secondary" @click="navigator.clipboard.writeText(analysisResult)" />
                </div>
            </div>
        </div>
        
        <!-- Placeholder col droite si vide -->
        <div v-else class="card bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
            <i class="pi pi-sparkles text-4xl mb-4"></i>
            <p>Le résultat de l'IA s'affichera ici</p>
        </div>
    </div>
</template>
