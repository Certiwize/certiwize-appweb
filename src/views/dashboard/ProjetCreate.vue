<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../../stores/project';
import { useDataStore } from '../../stores/data';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useI18n } from 'vue-i18n';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Message from 'primevue/message';
import Tag from 'primevue/tag';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const dataStore = useDataStore();
const { t } = useI18n();

const projectId = ref(route.params.id || null);
const tiersOptions = ref([]);

// --- DATA ---
// Les champs correspondent exactement aux balises des templates n8n
const form = ref({
    // ========== Document 1 : Identification du Projet ==========
    // Balises: {date}, {client}, {service_concerne}, {contact}, {contexte},
    //          {objectifs}, {public_concerne}, {calendrier}, {duree}, {cout},
    //          {lieu}, {autres}, {competence}, {moyens_materiels}
    date: new Date(),
    client: '',
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
    moyens_materiels: '',

    // ========== Document 2 : Convention de Formation ==========
    soussignes: '',
    siret: '',
    formation: '',
    duree_conv: '',
    dates: '',
    horaires: '',
    lieu_conv: '',
    fonction: '',
    cout_ht: 0,
    cout_ttc: 0,
    nom_expert: '',
    expertise: '',
    contenu_forma: '',
    date_now: new Date(),

    // ========== Document 3 : Convocation à la Formation ==========
    // Balises: {nom_formation}, {nom_participant}, {date}, {lieu}, {horaires},
    //          {transport}, {equipement}, {ref_handicap}
    nom_formation: '',      // {nom_formation}
    nom_participant: '',    // {nom_participant}
    date_convoc: '',        // {date} pour convocation
    lieu_convoc: '',        // {lieu} pour convocation
    horaires_convoc: '',    // {horaires} pour convocation
    transport: '',          // {transport}
    equipement: '',         // {equipement}
    ref_handicap: '',       // {ref_handicap}

    // ========== Document 4 : Livret d'Accueil ==========
    // Balises: {date}, {qui}, {accueil_stagiere}, {lieu}, {hebergement},
    //          {restauration}, {moyens_pedagq}, {orga_interne}, {accueil_handicap}
    date_livret: new Date(), // {date} pour livret
    qui: '',                 // {qui}
    accueil_stagiere: '',    // {accueil_stagiere}
    lieu_livret: '',         // {lieu} pour livret
    hebergement: '',         // {hebergement}
    restauration: '',        // {restauration}
    moyens_pedagq: '',       // {moyens_pedagq}
    orga_interne: '',        // {orga_interne}
    accueil_handicap: ''     // {accueil_handicap}
});

// État de chargement pour les boutons de génération
const generatingDoc = ref(null); // 'etude', 'convention', 'convocation', 'livret' ou null
onMounted(async () => {
    // Charger clients
    if (dataStore.tiers.length === 0) await dataStore.fetchTiers();
    tiersOptions.value = dataStore.tiers.map(t => ({ label: t.name, value: t.name }));

    // Charger projet OU réinitialiser pour nouveau projet
    if (projectId.value) {
        await projectStore.fetchProject(projectId.value);
        if (projectStore.currentProject) {
            // Mapping des données
            const savedData = projectStore.currentProject.form_data || {};
            form.value = { ...form.value, ...savedData };
            
            // Conversion sécurisée des dates
            const safeParseDate = (val) => {
                if (!val) return null;
                try {
                    const parsed = new Date(val);
                    return isNaN(parsed.getTime()) ? null : parsed;
                } catch {
                    return null;
                }
            };

            // Tous les champs date du formulaire
            if (savedData.date) form.value.date = safeParseDate(savedData.date) || new Date();
            if (savedData.date_now) form.value.date_now = safeParseDate(savedData.date_now) || new Date();
            if (savedData.date_livret) form.value.date_livret = safeParseDate(savedData.date_livret) || new Date();
        }
    } else {
        // Nouveau projet: réinitialiser le state
        projectStore.currentProject = null;
    }
});

// Computed pour l'état du projet
const status = computed(() => projectStore.currentProject?.status || 'Brouillon');
const isValidated = computed(() => status.value === 'Validé' || status.value === 'Terminé');

// Documents disponibles (colonnes individuelles dans la table)
const docs = computed(() => ({
    etude: projectStore.currentProject?.identification,
    convention: projectStore.currentProject?.convention,
    convocation: projectStore.currentProject?.convocation,
    livret: projectStore.currentProject?.livret
}));

// Phase 1 verrouillée après soumission (En attente ou Validé)
const isPhase1Locked = computed(() => status.value !== 'Brouillon');

// Vérifier que les 2 documents Phase 1 sont générés
const bothDocsGenerated = computed(() => !!docs.value.etude && !!docs.value.convention);

// Validation Document 1 : Identification du Projet
const isDoc1Valid = computed(() => {
    // Validation relaxée : on vérifie juste que le client est rempli pour le nom du projet
    return form.value.client?.trim() !== '';
});

// Validation Document 2 : Convention
const isDoc2Valid = computed(() => {
    return true; // Validation relaxée
});

// Peut soumettre Phase 1 seulement si les 2 docs sont générés
const canSubmitPhase1 = computed(() => isDoc1Valid.value && isDoc2Valid.value && bothDocsGenerated.value);

// Validation Document 3 : Convocation
const isDoc3Valid = computed(() => {
    return true; // Validation relaxée
});

// Validation Document 4 : Livret
const isDoc4Valid = computed(() => {
    return true; // Validation relaxée
});

// --- ACTIONS ---

const save = async () => {
    const res = await projectStore.saveProject({
        id: projectId.value,
        name: `Projet ${form.value.client}`,
        form_data: form.value
    });
    if(res.success && !projectId.value) {
        projectId.value = res.id;
        router.replace(`/dashboard/projets/edit/${res.id}`);
    }
    return res.success;
};

// Génération générique
const generate = async (docType) => {
    generatingDoc.value = docType;
    try {
        await save(); // Toujours sauvegarder avant
        const res = await projectStore.generateDoc(docType, form.value);
        if(!res.success) {
            alert(t('dashboard.error', { error: res.error }));
        }
        // Pas besoin d'alert succès, le ✅ apparaît automatiquement
    } finally {
        generatingDoc.value = null;
    }
};

const submitForValidation = async () => {
    await save();
    if(confirm(t('project.warnings.phase1_locked_confirm') || "Confirmer l'étude de faisabilité ?")) {
        await projectStore.updateStatus('En attente');
    }
};

const goBack = () => {
    window.location.href = '/dashboard/projets';
};
</script>

<template>
    <div class="max-w-6xl mx-auto pb-20">
        
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    {{ t('project.title') }} {{ form.client || t('project.new') }}
                    <Tag :value="status" :severity="status === 'Validé' ? 'success' : (status === 'En attente' ? 'warn' : 'secondary')" />
                </h1>
            </div>
            <div class="flex gap-2">
                <Button :label="t('project.buttons.back')" severity="secondary" text @click="goBack" />
                <Button v-if="status === 'Brouillon'" :label="t('project.buttons.save')" icon="pi pi-save" @click="save" />
            </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border-l-4 border-blue-500">
            <h2 class="text-xl font-bold mb-4 flex justify-between">
                {{ t('project.phases.phase1') }}
                <i v-if="isValidated" class="pi pi-check-circle text-green-500"></i>
                <i v-else-if="isPhase1Locked" class="pi pi-lock text-yellow-500"></i>
            </h2>

            <!-- Bannière Phase 1 verrouillée (seulement en attente, pas après validation) -->
            <div v-if="status === 'En attente'" class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p class="text-yellow-700 dark:text-yellow-300 text-sm">
                    <i class="pi pi-lock mr-2"></i>
                    <strong>{{ t('project.warnings.phase1_locked') }}</strong>
                </p>
            </div>

            <Accordion :multiple="true" :activeIndex="[0, 1]">
                
                <AccordionPanel value="0">
                    <AccordionHeader>{{ t('project.sections.id') }}</AccordionHeader>
                    <AccordionContent>
                        <p class="text-sm text-gray-500 mb-4 italic">Document 1 — Toutes les balises seront envoyées à n8n</p>
                        
                        <fieldset :disabled="isPhase1Locked" class="contents">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Informations générales -->
                            <div class="md:col-span-2 border-b pb-2 mb-2">
                                <span class="font-semibold text-primary">{{ t('project.fields.general_info') }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Date</label>
                                <Calendar v-model="form.date" dateFormat="dd/mm/yy" showIcon />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Client</label>
                                <Dropdown v-model="form.client" :options="tiersOptions" optionLabel="label" optionValue="value" editable placeholder="Sélectionner ou saisir" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Service concerné</label>
                                <InputText v-model="form.service_concerne" placeholder="Ex: DRH, Technique..." />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Contact</label>
                                <InputText v-model="form.contact" placeholder="Nom du responsable" />
                            </div>
                            
                            <!-- Cadrage du projet -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.scoping') }}</span>
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Contexte</label>
                                <Textarea v-model="form.contexte" rows="3" placeholder="Décrivez le contexte de la demande..." />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Objectifs</label>
                                <Textarea v-model="form.objectifs" rows="3" placeholder="Quels sont les objectifs attendus ?" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Public concerné</label>
                                <InputText v-model="form.public_concerne" placeholder="Ex: 10 Techniciens de maintenance" />
                            </div>
                            
                            <!-- Modalités d'exécution -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.execution') }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Calendrier</label>
                                <InputText v-model="form.calendrier" placeholder="Dates prévisionnelles" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Durée</label>
                                <InputText v-model="form.duree" placeholder="Ex: 3 jours / 21 heures" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Lieu</label>
                                <InputText v-model="form.lieu" placeholder="Sur site ou à distance ?" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Coût estimé</label>
                                <InputNumber v-model="form.cout" mode="currency" currency="EUR" locale="fr-FR" />
                            </div>
                            
                            <!-- Ressources & Moyens -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.resources') }}</span>
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Compétences requises</label>
                                <Textarea v-model="form.competence" rows="2" placeholder="Compétences requises ou à acquérir" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Moyens matériels</label>
                                <Textarea v-model="form.moyens_materiels" rows="2" placeholder="Salle, projecteur, accès VPN..." />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Autres informations</label>
                                <Textarea v-model="form.autres" rows="2" placeholder="Informations complémentaires" />
                            </div>
                        </div>
                        </fieldset>
                        
                        <div class="mt-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                            <span class="text-sm text-gray-500" v-if="docs.etude">{{ t('project.status.generated') }}</span>
                            <span v-else class="text-sm text-gray-400">{{ t('project.status.not_generated') }}</span>
                            
                            <div class="flex gap-2">
                                <a v-if="docs.etude" :href="docs.etude" target="_blank"><Button icon="pi pi-eye" :label="t('project.buttons.view_pdf')" severity="secondary" /></a>
                                <Button :label="t('project.buttons.generate_doc') + ' 1'" icon="pi pi-file-pdf" 
                                        @click="generate('etude')" 
                                        :disabled="status !== 'Brouillon' || !isDoc1Valid || generatingDoc !== null" 
                                        :loading="generatingDoc === 'etude'" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="1">
                    <AccordionHeader>{{ t('project.sections.convention') }}</AccordionHeader>
                    <AccordionContent>
                        <p class="text-sm text-gray-500 mb-4 italic">Document 2 — Convention de formation professionnelle</p>
                        
                        <fieldset :disabled="isPhase1Locked" class="contents">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Identification des parties -->
                            <div class="md:col-span-2 border-b pb-2 mb-2">
                                <span class="font-semibold text-primary">{{ t('project.fields.parties_id') }}</span>
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Soussignés</label>
                                <InputText v-model="form.soussignes" placeholder="Raison sociale de l'entreprise cliente" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">SIRET</label>
                                <InputText v-model="form.siret" placeholder="N° SIRET" />
                            </div>
                            
                            <!-- Formation -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.training') }}</span>
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Intitulé de la formation</label>
                                <InputText v-model="form.formation" placeholder="Titre de la formation" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Durée</label>
                                <InputText v-model="form.duree_conv" placeholder="Ex: 14h (2 jours)" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Dates</label>
                                <InputText v-model="form.dates" placeholder="Ex: Du 15 au 17 janvier 2026" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Horaires</label>
                                <InputText v-model="form.horaires" placeholder="Ex: 9h00 - 17h00" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Lieu</label>
                                <InputText v-model="form.lieu_conv" placeholder="Adresse ou 'Distanciel'" />
                            </div>
                            
                            <!-- Participant -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.participant') }}</span>
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Fonction des stagiaires</label>
                                <InputText v-model="form.fonction" placeholder="Ex: Techniciens, Managers..." />
                            </div>
                            
                            <!-- Prix -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.price') }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Coût HT</label>
                                <InputNumber v-model="form.cout_ht" mode="currency" currency="EUR" locale="fr-FR" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Coût TTC</label>
                                <InputNumber v-model="form.cout_ttc" mode="currency" currency="EUR" locale="fr-FR" />
                            </div>
                            
                            <!-- Moyens pédagogiques -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.pedagogical_means') }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Nom de l'expert</label>
                                <InputText v-model="form.nom_expert" placeholder="Nom du formateur" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Expertise / Qualification</label>
                                <Textarea v-model="form.expertise" rows="2" placeholder="Qualifications et expérience du formateur" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">Contenu de la formation</label>
                                <Textarea v-model="form.contenu_forma" rows="4" placeholder="Programme détaillé de la formation..." />
                            </div>
                            
                            <!-- Signatures / Date -->
                            <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                                <span class="font-semibold text-primary">{{ t('project.fields.signatures') }}</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">Date du jour</label>
                                <Calendar v-model="form.date_now" dateFormat="dd/mm/yy" showIcon />
                            </div>
                        </div>
                        </fieldset>

                        <div class="mt-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                            <span class="text-sm text-gray-500" v-if="docs.convention">{{ t('project.status.generated') }}</span>
                            <span v-else class="text-sm text-gray-400">{{ t('project.status.not_generated') }}</span>
                            
                            <div class="flex gap-2">
                                <a v-if="docs.convention" :href="docs.convention" target="_blank"><Button icon="pi pi-eye" :label="t('project.buttons.view_pdf')" severity="secondary" /></a>
                                <Button :label="t('project.buttons.generate_doc') + ' 2'" icon="pi pi-file-pdf" 
                                        @click="generate('convention')" 
                                        :disabled="status !== 'Brouillon' || !isDoc2Valid || generatingDoc !== null" 
                                        :loading="generatingDoc === 'convention'" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

            <div class="mt-6 flex flex-col items-end gap-2" v-if="status === 'Brouillon'">
                <Button :label="t('project.buttons.submit_validation')" icon="pi pi-send" severity="warning" @click="submitForValidation" :disabled="!canSubmitPhase1" />
                <p v-if="!bothDocsGenerated" class="text-sm text-orange-500">
                    <i class="pi pi-exclamation-triangle mr-1"></i>
                    {{ t('project.warnings.generate_phase1') }}
                </p>
            </div>
            <div v-else-if="status === 'En attente'" class="mt-4 text-center p-4 bg-yellow-50 text-yellow-700 rounded">
                <i class="pi pi-clock mr-2"></i> {{ t('project.warnings.waiting_validation') }}
            </div>
        </div>

        <div v-if="isValidated" class="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500 animate-fade-in">
            <h2 class="text-xl font-bold mb-4">
                {{ t('project.phases.phase2') }}
                <i class="pi pi-check-circle text-green-500 ml-2"></i>
            </h2>
            
            <Accordion :multiple="true" :activeIndex="[0, 1]">
                <!-- Document 3 : Convocation -->
                <AccordionPanel value="0">
                    <AccordionHeader>{{ t('project.sections.convocation') }}</AccordionHeader>
                    <AccordionContent>
                        <p class="text-sm text-gray-500 mb-4 italic">Document 3 — Convocation à la formation</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.training_name') }}</label>
                                <InputText v-model="form.nom_formation" placeholder="Intitulé de la formation" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.participant_name') }}</label>
                                <InputText v-model="form.nom_participant" placeholder="Nom et prénom du stagiaire" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.date') }}</label>
                                <InputText v-model="form.date_convoc" placeholder="Ex: Lundi 15 janvier 2026" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.location') }}</label>
                                <InputText v-model="form.lieu_convoc" placeholder="Adresse du lieu de formation" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.hours') }}</label>
                                <InputText v-model="form.horaires_convoc" placeholder="Ex: 9h00 - 17h00" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.transport') }}</label>
                                <InputText v-model="form.transport" placeholder="Informations transport / accès" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.equipment') }}</label>
                                <Textarea v-model="form.equipement" rows="2" placeholder="Matériel à apporter, tenue, EPI..." />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.handicap_ref') }}</label>
                                <Textarea v-model="form.ref_handicap" rows="2" placeholder="Contact du référent handicap" />
                            </div>
                        </div>

                        <div class="mt-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                            <span class="text-sm text-gray-500" v-if="docs.convocation">{{ t('project.status.generated') }}</span>
                            <span v-else class="text-sm text-gray-400">{{ t('project.status.not_generated') }}</span>
                            
                            <div class="flex gap-2">
                                <a v-if="docs.convocation" :href="docs.convocation" target="_blank"><Button icon="pi pi-eye" :label="t('project.buttons.view_pdf')" severity="secondary" /></a>
                                <Button :label="t('project.buttons.generate_doc') + ' 3'" icon="pi pi-file-pdf" 
                                        @click="generate('convocation')" 
                                        :disabled="!isDoc3Valid || generatingDoc !== null" 
                                        :loading="generatingDoc === 'convocation'" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <!-- Document 4 : Livret d'Accueil -->
                <AccordionPanel value="1">
                    <AccordionHeader>{{ t('project.sections.welcome_booklet') }}</AccordionHeader>
                    <AccordionContent>
                        <p class="text-sm text-gray-500 mb-4 italic">Document 4 — Livret d'accueil des stagiaires</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.date') }}</label>
                                <Calendar v-model="form.date_livret" dateFormat="dd/mm/yy" showIcon />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.who_are_we') }}</label>
                                <InputText v-model="form.qui" placeholder="Présentation de l'organisme" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.trainee_welcome') }}</label>
                                <Textarea v-model="form.accueil_stagiere" rows="2" placeholder="Modalités d'accueil" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.training_location') }}</label>
                                <InputText v-model="form.lieu_livret" placeholder="Adresse complète" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.accommodation') }}</label>
                                <InputText v-model="form.hebergement" placeholder="Infos hébergement (si applicable)" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.catering') }}</label>
                                <InputText v-model="form.restauration" placeholder="Infos restauration" />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.pedagogical_means') }}</label>
                                <Textarea v-model="form.moyens_pedagq" rows="2" placeholder="Matériel, supports, outils..." />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.internal_org') }}</label>
                                <Textarea v-model="form.orga_interne" rows="2" placeholder="Règlement intérieur, consignes..." />
                            </div>
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="text-sm font-medium">{{ t('project.fields.handicap_access') }}</label>
                                <Textarea v-model="form.accueil_handicap" rows="2" placeholder="Accessibilité, aménagements..." />
                            </div>
                        </div>

                        <div class="mt-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                            <span class="text-sm text-gray-500" v-if="docs.livret">{{ t('project.status.generated') }}</span>
                            <span v-else class="text-sm text-gray-400">{{ t('project.status.not_generated') }}</span>
                            
                            <div class="flex gap-2">
                                <a v-if="docs.livret" :href="docs.livret" target="_blank"><Button icon="pi pi-eye" :label="t('project.buttons.view_pdf')" severity="secondary" /></a>
                                <Button :label="t('project.buttons.generate_doc') + ' 4'" icon="pi pi-file-pdf" severity="info" 
                                        @click="generate('livret')" 
                                        :disabled="!isDoc4Valid || generatingDoc !== null" 
                                        :loading="generatingDoc === 'livret'" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>

    </div>
</template>