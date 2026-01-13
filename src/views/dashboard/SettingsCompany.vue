<script setup>
import { ref, onMounted } from 'vue';
import { useCompanyStore } from '../../stores/company';
import { supabase } from '../../supabase';

// PrimeVue Imports
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import Message from 'primevue/message';

const store = useCompanyStore();
const saving = ref(false);
const message = ref(null);

// Données locales du formulaire
const form = ref({
    // A. Général
    name: '', currency: 'EUR', country: 'FR', address: '', zip_code: '', city: '', 
    department: '', phone: '', mobile: '', fax: '', email: '', website: '', 
    barcode: '', logo_url: '', logo_square_url: '', note: '',
    handicap_referent: '', // Ajout Référent Handicap
    
    // B. Identifiants
    manager_name: '', dpo_name: '', capital: 0, legal_entity_type: '', 
    activity_object: '', vat_number: '', siren: '', siret: '', naf_ape: '', 
    rcs_rm: '', eori_number: '', rna_number: '', 
    id_prof_7: '', id_prof_8: '', id_prof_9: '', id_prof_10: '',
    fiscal_year_start_month: 'Janvier',

    // C. Taxes
    taxes_config: { vat_subject: true, tax_2: false, tax_3: false, fiscal_stamp: false },

    // D. Sociaux
    socials: { x: '', instagram: '', facebook: '', bluesky: '', autres: '' },

    // E. Horaires
    opening_hours: { lundi: '', mardi: '', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: '' },

    // F. Comptable
    accountant_info: { name: '', address: '', zip: '', city: '', country: 'FR', phone: '', email: '', web: '', code: '', note: '' }
});

// Options Listes
const currencies = ['EUR', 'USD', 'GBP', 'CHF'];
const countries = [
    {label: 'France', value: 'FR'}, {label: 'Belgique', value: 'BE'}, 
    {label: 'Suisse', value: 'CH'}, {label: 'Canada', value: 'CA'}
];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const legalEntities = ['SAS', 'SASU', 'SARL', 'EURL', 'Auto-Entrepreneur', 'SA', 'SCI', 'Association'];
const departments = ['75 - Paris', '92 - Hauts-de-Seine', '69 - Rhône', '33 - Gironde']; // À compléter ou via API

onMounted(async () => {
    await store.fetchCompany();
    if (store.company) {
        // Fusionner les données existantes avec le formulaire par défaut
        form.value = { ...form.value, ...store.company };
        // S'assurer que les objets imbriqués existent (au cas où la DB renvoie null)
        form.value.taxes_config = store.company.taxes_config || { vat_subject: true };
        form.value.socials = store.company.socials || {};
        form.value.opening_hours = store.company.opening_hours || {};
        form.value.accountant_info = store.company.accountant_info || {};
    }
});

const handleSave = async () => {
    saving.value = true;
    message.value = null;
    const res = await store.saveCompany(form.value);
    if (res.success) {
        message.value = { severity: 'success', text: 'Configuration enregistrée avec succès.' };
    } else {
        message.value = { severity: 'error', text: 'Erreur: ' + res.error };
    }
    saving.value = false;
};

// Upload Logo
const uploadLogo = async (event, type) => {
    const file = event.files[0];
    const fileName = `${Date.now()}-${type}-${file.name}`;
    const { data, error } = await supabase.storage.from('company-logos').upload(fileName, file);
    
    if (!error) {
        const { data: urlData } = supabase.storage.from('company-logos').getPublicUrl(fileName);
        if (type === 'main') form.value.logo_url = urlData.publicUrl;
        else form.value.logo_square_url = urlData.publicUrl;
    }
};
</script>

<template>
    <div class="max-w-6xl mx-auto pb-20">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configuration Société</h1>
            <Button label="Enregistrer" icon="pi pi-save" :loading="saving" @click="handleSave" />
        </div>

        <Message v-if="message" :severity="message.severity" class="mb-4">{{ message.text }}</Message>

        <div class="card bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <TabView>
                
                <TabPanel header="Identité & Coordonnées">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <div class="flex flex-col gap-2"><label>Raison sociale</label><InputText v-model="form.name" /></div>
                        <div class="flex flex-col gap-2"><label>Devise</label><Dropdown v-model="form.currency" :options="currencies" /></div>
                        
                        <div class="md:col-span-2 flex flex-col gap-2"><label>Adresse</label><Textarea v-model="form.address" rows="2" /></div>
                        
                        <div class="flex flex-col gap-2"><label>Code postal</label><InputText v-model="form.zip_code" maxlength="5" /></div>
                        <div class="flex flex-col gap-2"><label>Ville</label><InputText v-model="form.city" /></div>
                        
                        <div class="flex flex-col gap-2"><label>Pays</label><Dropdown v-model="form.country" :options="countries" optionLabel="label" optionValue="value" /></div>
                        <div class="flex flex-col gap-2"><label>Département</label><Dropdown v-model="form.department" :options="departments" editable placeholder="Sélectionner ou taper" /></div>

                        <div class="flex flex-col gap-2"><label>Téléphone</label><InputText v-model="form.phone" /></div>
                        <div class="flex flex-col gap-2"><label>Portable</label><InputText v-model="form.mobile" /></div>
                        <div class="flex flex-col gap-2"><label>Email</label><InputText v-model="form.email" /></div>
                        <div class="flex flex-col gap-2"><label>Site web</label><InputText v-model="form.website" placeholder="https://" /></div>

                        <div class="border p-4 rounded border-dashed opacity-75">
                            <label class="block mb-2 font-bold flex items-center gap-2">
                                Logo Principal 
                                <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">En cours de dev</span>
                            </label>
                            <img v-if="form.logo_url" :src="form.logo_url" class="h-16 mb-2 object-contain" />
                            <FileUpload mode="basic" name="logo" accept="image/*" disabled chooseLabel="Bientôt disponible" />
                        </div>
                        
                        <div class="md:col-span-2 flex flex-col gap-2"><label>Note interne</label><Textarea v-model="form.note" rows="3" /></div>
                    </div>
                </TabPanel>

                <TabPanel header="Juridique & Fiscal">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                        <div class="flex flex-col gap-2"><label>Gestionnaire(s)</label><InputText v-model="form.manager_name" /></div>
                        <div class="flex flex-col gap-2"><label>Délégué DPO</label><InputText v-model="form.dpo_name" /></div>
                        <div class="flex flex-col gap-2"><label>Référent handicap</label><InputText v-model="form.handicap_referent" placeholder="Nom du référent" /></div>
                        <div class="flex flex-col gap-2"><label>Capital social (€)</label><InputNumber v-model="form.capital" mode="currency" currency="EUR" /></div>
                        
                        <div class="flex flex-col gap-2"><label>Entité légale</label><Dropdown v-model="form.legal_entity_type" :options="legalEntities" editable /></div>
                        <div class="flex flex-col gap-2"><label>Début exercice</label><Dropdown v-model="form.fiscal_year_start_month" :options="months" /></div>
                        <div class="flex flex-col gap-2"><label>Numéro de TVA</label><InputText v-model="form.vat_number" /></div>

                        <div class="md:col-span-3 flex flex-col gap-2"><label>Objet social</label><Textarea v-model="form.activity_object" rows="2" /></div>

                        <div class="flex flex-col gap-2"><label>SIREN (9 chiffres)</label><InputText v-model="form.siren" maxlength="9" /></div>
                        <div class="flex flex-col gap-2"><label>SIRET (14 chiffres)</label><InputText v-model="form.siret" maxlength="14" /></div>
                        <div class="flex flex-col gap-2"><label>NAF / APE</label><InputText v-model="form.naf_ape" maxlength="5" /></div>
                        <div class="flex flex-col gap-2"><label>RCS / RM</label><InputText v-model="form.rcs_rm" /></div>
                        <div class="flex flex-col gap-2"><label>Numéro EORI</label><InputText v-model="form.eori_number" /></div>
                        <div class="flex flex-col gap-2"><label>Numéro RNA</label><InputText v-model="form.rna_number" /></div>
                    </div>
                </TabPanel>

                <TabPanel header="Gestion Taxes">
                    <div class="flex flex-col gap-6 p-4">
                        <div class="flex items-center gap-4">
                            <span class="font-bold w-40">Assujetti TVA :</span>
                            <div class="flex gap-4">
                                <div class="flex items-center"><RadioButton v-model="form.taxes_config.vat_subject" :value="true" /><label class="ml-2">Oui</label></div>
                                <div class="flex items-center"><RadioButton v-model="form.taxes_config.vat_subject" :value="false" /><label class="ml-2">Non</label></div>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <Checkbox v-model="form.taxes_config.tax_2" :binary="true" />
                            <label>Gestion 2ème type de taxe</label>
                        </div>
                        
                        <div class="flex items-center gap-4">
                            <Checkbox v-model="form.taxes_config.tax_3" :binary="true" />
                            <label>Gestion 3ème type de taxe</label>
                        </div>

                        <div class="flex items-center gap-4">
                            <Checkbox v-model="form.taxes_config.fiscal_stamp" :binary="true" />
                            <label>Timbre Fiscal</label>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Réseaux Sociaux">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <div class="flex flex-col gap-2">
                            <label><i class="pi pi-twitter mr-2"></i>X (Twitter)</label>
                            <InputText v-model="form.socials.x" placeholder="https://x.com/..." />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label><i class="pi pi-instagram mr-2"></i>Instagram</label>
                            <InputText v-model="form.socials.instagram" placeholder="https://instagram.com/..." />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label><i class="pi pi-facebook mr-2"></i>Facebook</label>
                            <InputText v-model="form.socials.facebook" placeholder="https://facebook.com/..." />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label><i class="pi pi-cloud mr-2"></i>Bluesky</label>
                            <InputText v-model="form.socials.bluesky" placeholder="https://bsky.app/..." />
                        </div>
                        <div class="flex flex-col gap-2 md:col-span-2">
                            <label><i class="pi pi-globe mr-2"></i>Autres</label>
                            <InputText v-model="form.socials.autres" placeholder="Autres liens..." />
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Heures d'ouverture">
                    <div class="grid grid-cols-1 gap-4 p-4 max-w-lg">
                        <div v-for="(hours, day) in form.opening_hours" :key="day" class="flex items-center gap-4">
                            <label class="capitalize w-24 font-semibold">{{ day }}</label>
                            <InputText v-model="form.opening_hours[day]" placeholder="Ex: 09:00 - 18:00" class="flex-1" />
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Expert Comptable">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        <div class="flex flex-col gap-2"><label>Cabinet / Nom</label><InputText v-model="form.accountant_info.name" /></div>
                        <div class="flex flex-col gap-2"><label>Code Comptable</label><InputText v-model="form.accountant_info.code" /></div>
                        
                        <div class="md:col-span-2 flex flex-col gap-2"><label>Adresse</label><Textarea v-model="form.accountant_info.address" rows="2" /></div>
                        
                        <div class="flex flex-col gap-2"><label>CP</label><InputText v-model="form.accountant_info.zip" /></div>
                        <div class="flex flex-col gap-2"><label>Ville</label><InputText v-model="form.accountant_info.city" /></div>
                        
                        <div class="flex flex-col gap-2"><label>Email</label><InputText v-model="form.accountant_info.email" /></div>
                        <div class="flex flex-col gap-2"><label>Téléphone</label><InputText v-model="form.accountant_info.phone" /></div>
                        
                        <div class="md:col-span-2 flex flex-col gap-2"><label>Note</label><Textarea v-model="form.accountant_info.note" rows="2" /></div>
                    </div>
                </TabPanel>

            </TabView>
        </div>
    </div>
</template>