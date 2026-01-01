<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../../stores/project';
import { useDataStore } from '../../stores/data'; // Pour la liste des clients
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Message from 'primevue/message';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const dataStore = useDataStore();

// --- STATE ---
const projectId = ref(route.params.id || null);

// Données du formulaire mappées EXACTEMENT sur vos balises
const form = ref({
    // Balises Document 1
    date: new Date(),
    client: '',     // Stockera le nom du client
    service_concerne: '',
    contact: '',
    contexte: '',
    objectifs: '',
    public_concerne: '',
    calendrier: '',
    duree: '',
    cout: 0,
    lieu: '',
    autres: '',
    competence: '',
    moyens_materiels: ''
});

// Options pour les listes
const tiersOptions = ref([]);

onMounted(async () => {
    // 1. Charger les clients pour la liste déroulante
    if (dataStore.tiers.length === 0) await dataStore.fetchTiers();
    
    tiersOptions.value = dataStore.tiers.map(t => ({
        label: t.name, 
        value: t.name // On stocke le NOM pour la génération de doc
    }));

    // 2. Si on édite un projet existant, on charge les données
    if (projectId.value) {
        await projectStore.fetchProject(projectId.value);
        if (projectStore.currentProject) {
            // Fusionner les données existantes
            form.value = { ...form.value, ...projectStore.currentProject.form_data };
            // Convertir la string date en objet Date pour le Calendar
            if (form.value.date) form.value.date = new Date(form.value.date);
        }
    }
});

// --- ACTIONS ---

const saveDraft = async () => {
    const result = await projectStore.saveProject({
        id: projectId.value,
        name: `Projet - ${form.value.client || 'Sans titre'}`, // Nom automatique
        form_data: form.value
    }, 1);

    if (result.success) {
        projectId.value = result.id;
        // On remplace l'URL pour rester sur l'édition sans recharger
        router.replace(`/dashboard/projets/edit/${result.id}`);
        alert("Brouillon enregistré avec succès.");
    } else {
        alert("Erreur: " + result.error);
    }
};

const nextStep = async (activateCallback) => {
    await saveDraft(); // Sauvegarde auto avant de passer à la suite
    activateCallback('2'); // Active l'étape 2
    alert("L'étape 2 (Étude Technique) sera développée prochainement.");
};
</script>

<template>
    <div class="max-w-5xl mx-auto pb-20">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nouveau Projet : Étude de Faisabilité</h1>
            <Button label="Quitter" severity="secondary" @click="router.push('/dashboard')" />
        </div>

        <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <Stepper value="1" linear>
                <StepList>
                    <Step value="1">Identification</Step>
                    <Step value="2">Convention de formation</Step>
                    <Step value="3">Programme de formation</Step>
                </StepList>
                
                <StepPanels>
                    <StepPanel v-slot="{ activateCallback }" value="1">
                        <form class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            
                            <div class="md:col-span-2 border-b pb-2 mb-2">
                                <h3 class="font-semibold text-primary">Informations Générales</h3>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{date}</label>
                                <Calendar v-model="form.date" dateFormat="dd/mm/yy" showIcon />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{client}</label>
                                <Dropdown 
                                    v-model="form.client" 
                                    :options="tiersOptions" 
                                    optionLabel="label" 
                                    optionValue="value" 
                                    placeholder="Sélectionner un client existant" 
                                    editable 
                                />
                                <small class="text-gray-500">Sélectionnez ou écrivez un nom libre.</small>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{service_concerne}</label>
                                <InputText v-model="form.service_concerne" placeholder="Ex: DRH, Technique..." />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{contact}</label>
                                <InputText v-model="form.contact" placeholder="Nom du responsable projet" />
                            </div>

                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <h3 class="font-semibold text-primary">Cadrage du projet</h3>
                            </div>

                            <div class="md:col-span-2 flex flex-col gap-2">
                                <label>{contexte}</label>
                                <Textarea v-model="form.contexte" rows="4" placeholder="Décrivez le contexte de la demande..." autoResize />
                            </div>

                            <div class="md:col-span-2 flex flex-col gap-2">
                                <label>{objectifs}</label>
                                <Textarea v-model="form.objectifs" rows="4" placeholder="Quels sont les objectifs attendus ?" autoResize />
                            </div>

                            <div class="md:col-span-2 flex flex-col gap-2">
                                <label>{public_concerne}</label>
                                <InputText v-model="form.public_concerne" placeholder="Ex: 10 Techniciens de maintenance" />
                            </div>

                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <h3 class="font-semibold text-primary">Modalités d'exécution</h3>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{calendrier}</label>
                                <InputText v-model="form.calendrier" placeholder="Dates prévisionnelles" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{duree}</label>
                                <InputText v-model="form.duree" placeholder="Ex: 3 jours / 21 heures" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{lieu}</label>
                                <InputText v-model="form.lieu" placeholder="Sur site ou à distance ?" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label>{cout}</label>
                                <InputNumber v-model="form.cout" mode="currency" currency="EUR" locale="fr-FR" />
                            </div>

                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <h3 class="font-semibold text-primary">Ressources & Moyens</h3>
                            </div>

                            <div class="md:col-span-2 flex flex-col gap-2">
                                <label>{competence}</label>
                                <Textarea v-model="form.competence" rows="2" placeholder="Compétences requises ou à acquérir" />
                            </div>

                            <div class="md:col-span-2 flex flex-col gap-2">
                                <label>{moyens_materiels}</label>
                                <Textarea v-model="form.moyens_materiels" rows="2" placeholder="Salle, projecteur, accès VPN..." />
                            </div>
                             <div class="md:col-span-2 flex flex-col gap-2">
                                <label>{autres}</label>
                                <Textarea v-model="form.autres" rows="2" placeholder="Informations complémentaires" />
                            </div>
                        </form>

                        <div class="flex justify-between pt-8 mt-4 border-t border-gray-100">
                            <Button label="Enregistrer le brouillon" icon="pi pi-save" severity="secondary" outlined @click="saveDraft" />
                            
                            <Button label="Document Suivant" icon="pi pi-arrow-right" iconPos="right" @click="nextStep(activateCallback)" />
                        </div>
                    </StepPanel>
                    
                    <StepPanel v-slot="{ activateCallback }" value="2">
                        <div class="flex flex-col justify-center items-center h-40">
                            <p class="text-gray-500">Document 2 à venir...</p>
                            <div class="flex gap-2 mt-4">
                                <Button label="Retour" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                                <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
                            </div>
                        </div>
                    </StepPanel>

                    <StepPanel v-slot="{ activateCallback }" value="3">
                         <div class="flex flex-col justify-center items-center h-40">
                            <p class="text-gray-500">Document 3 à venir...</p>
                            <div class="flex gap-2 mt-4">
                                <Button label="Retour" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                                <Button label="Générer les documents (n8n)" severity="success" icon="pi pi-check-circle" />
                            </div>
                        </div>
                    </StepPanel>
                </StepPanels>
            </Stepper>
        </div>
    </div>
</template>