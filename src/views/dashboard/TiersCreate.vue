<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const form = ref({
  // General
  name: '',
  altName: '',
  types: {
    prospect: false,
    client: false,
    supplier: false
  },
  clientCode: 'CU2512-00038', // Mock auto-gen
  supplierCode: 'SU2512-00001', // Mock auto-gen
  status: 'Open',
  barcode: '',
  
  // Contact
  address: '',
  zip: '',
  city: '',
  country: 'FR',
  department: '',
  phone: '',
  mobile: '',
  fax: '',
  website: '',
  email: '',
  refuseMassEmail: 'No',
  socialNetworks: false,
  
  // Legal
  siren: '',
  siret: '',
  naf: '',
  rcs: '',
  eori: '',
  rna: '',
  vatSubject: false,
  vatNumber: '',
  tierType: '',
  legalEntityType: '',
  workforce: null,
  capital: 0,
  
  // Financial
  defaultLanguage: 'fr',
  paymentTerms: '',
  paymentMode: '',
  clientTags: [],
  supplierTags: [],
  currency: 'EUR',
  
  // Attachments
  parentCompany: null,
  salesReps: [],
  logo: null
});

// Sales Rep Logic
const newSalesRep = ref('');
const addSalesRep = () => {
  if (newSalesRep.value.trim()) {
    form.value.salesReps.push(newSalesRep.value.trim());
    newSalesRep.value = '';
  }
};
const removeSalesRep = (index) => {
  form.value.salesReps.splice(index, 1);
};

// Mock lists
const countries = [
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'CA', name: 'Canada' },
];

const currencies = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
];

const cancel = () => {
  router.push('/dashboard/tiers');
};

const save = () => {
  console.log('Saving tiers:', form.value);
  alert(t('tiers.create') + ' (Simulation)');
  router.push('/dashboard/tiers');
};

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.logo = file;
  }
};
</script>

<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('tiers.title') }}</h1>
        <p class="text-gray-500 mt-1">{{ t('tiers.subtitle') }}</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="cancel"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          {{ t('tiers.cancel') }}
        </button>
        <button 
          @click="save"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-lg shadow-primary/25"
        >
          {{ t('tiers.create') }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="space-y-6">
      
      <!-- 1. Informations Générales -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <i class="pi pi-id-card text-primary"></i>
          {{ t('tiers.general.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-full md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.general.name') }} *</label>
            <input v-model="form.name" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" :placeholder="t('tiers.general.name_placeholder')">
          </div>
          <div class="col-span-full md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.general.alt_name') }}</label>
            <input v-model="form.altName" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" :placeholder="t('tiers.general.alt_name_placeholder')">
          </div>
          
          <div class="col-span-full">
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tiers.general.type') }}</label>
             <div class="flex gap-6">
               <label class="flex items-center gap-2 cursor-pointer">
                 <input v-model="form.types.prospect" type="checkbox" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                 <span class="text-gray-700 dark:text-gray-300">{{ t('tiers.general.prospect') }}</span>
               </label>
               <label class="flex items-center gap-2 cursor-pointer">
                 <input v-model="form.types.client" type="checkbox" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                 <span class="text-gray-700 dark:text-gray-300">{{ t('tiers.general.client') }}</span>
               </label>
               <label class="flex items-center gap-2 cursor-pointer">
                 <input v-model="form.types.supplier" type="checkbox" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                 <span class="text-gray-700 dark:text-gray-300">{{ t('tiers.general.supplier') }}</span>
               </label>
             </div>
          </div>

          <div v-if="form.types.client" class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.general.client_code') }}</label>
             <div class="relative">
              <input v-model="form.clientCode" type="text" disabled class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 text-gray-500 cursor-not-allowed">
              <i class="pi pi-lock absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>
          <div v-if="form.types.supplier" class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.general.supplier_code') }}</label>
             <div class="relative">
              <input v-model="form.supplierCode" type="text" disabled class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 text-gray-500 cursor-not-allowed">
              <i class="pi pi-lock absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.general.status') }}</label>
            <select v-model="form.status" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
              <option value="Open">{{ t('tiers.general.status_open') }}</option>
              <option value="Closed">{{ t('tiers.general.status_closed') }}</option>
            </select>
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.general.barcode') }}</label>
            <input v-model="form.barcode" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
        </div>
      </section>

      <!-- 2. Coordonnées -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <i class="pi pi-map-marker text-primary"></i>
          {{ t('tiers.contact.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="col-span-full">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.address') }}</label>
            <textarea v-model="form.address" rows="2" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition"></textarea>
          </div>
          
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.zip') }}</label>
            <input v-model="form.zip" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.city') }}</label>
            <input v-model="form.city" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
          
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.country') }}</label>
            <select v-model="form.country" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
              <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.department') }}</label>
            <input v-model="form.department" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
          
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.phone') }}</label>
            <input v-model="form.phone" type="tel" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.mobile') }}</label>
            <input v-model="form.mobile" type="tel" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
          
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.email') }}</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.website') }}</label>
            <input v-model="form.website" type="url" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="https://">
          </div>
          
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.contact.refuse_mass_email') }}</label>
            <select v-model="form.refuseMassEmail" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
              <option value="No">Non</option>
              <option value="Yes">Oui</option>
            </select>
          </div>
          
           <div class="md:col-span-1 flex items-end mb-2">
              <button 
                @click="form.socialNetworks = !form.socialNetworks"
                class="text-primary hover:underline text-sm font-medium flex items-center gap-1"
              >
                <i class="pi" :class="form.socialNetworks ? 'pi-angle-up' : 'pi-angle-down'"></i>
                {{ form.socialNetworks ? t('tiers.contact.hide_socials') : t('tiers.contact.show_socials') }}
              </button>
          </div>
        </div>
      </section>

      <!-- 3. Informations Légales -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <i class="pi pi-building text-primary"></i>
          {{ t('tiers.legal.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.siren') }}</label>
            <input v-model="form.siren" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.siret') }}</label>
            <input v-model="form.siret" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.naf') }}</label>
            <input v-model="form.naf" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.rcs') }}</label>
            <input v-model="form.rcs" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.eori') }}</label>
            <input v-model="form.eori" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.rna') }}</label>
            <input v-model="form.rna" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          </div>
          
           <div class="col-span-full">
               <label class="flex items-center gap-2 cursor-pointer mb-2">
                 <input v-model="form.vatSubject" type="checkbox" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary">
                 <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('tiers.legal.vat_subject') }}</span>
               </label>
               <div v-if="form.vatSubject" class="flex gap-2 max-w-md">
                 <input v-model="form.vatNumber" type="text" :placeholder="t('tiers.legal.vat_number')" class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                 <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition">
                   {{ t('tiers.legal.check_vat') }}
                  </button>
               </div>
          </div>
          
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.legal.capital') }}</label>
            <div class="relative">
              <input v-model.number="form.capital" type="number" class="w-full pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
              <span class="absolute right-3 top-2 text-gray-500">€</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 4. Paramètres Commerciaux -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <i class="pi pi-briefcase text-primary"></i>
          {{ t('tiers.financial.title') }}
        </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.financial.currency') }}</label>
            <select v-model="form.currency" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
               <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }} - {{ c.name }}</option>
            </select>
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.financial.payment_terms') }}</label>
            <select v-model="form.paymentTerms" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
               <option value="">{{ t('tiers.financial.select') }}</option>
               <option value="30days">{{ t('tiers.financial.days_30') }}</option>
               <option value="receipt">{{ t('tiers.financial.receipt') }}</option>
            </select>
          </div>
        </div>
      </section>
      
       <!-- 5. Rattachements -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <i class="pi pi-link text-primary"></i>
          {{ t('tiers.attachments.title') }}
        </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.attachments.logo') }}</label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer relative">
               <input type="file" @change="handleLogoUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
               <i class="pi pi-image text-3xl text-gray-400 mb-2"></i>
               <p class="text-sm text-gray-500" v-if="!form.logo">{{ t('tiers.attachments.logo_placeholder') }}</p>
               <p class="text-sm text-primary font-medium" v-else>{{ form.logo.name }}</p>
            </div>
          </div>
           <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('tiers.attachments.assign_reps') }}</label>
            
            <!-- List of assigned reps -->
            <div class="flex flex-wrap gap-2 mb-3">
              <div v-for="(rep, index) in form.salesReps" :key="index" class="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                 <div class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{{ rep.charAt(0).toUpperCase() }}</div>
                 <span class="text-sm font-medium">{{ rep }}</span>
                 <button @click="removeSalesRep(index)" class="text-red-500 hover:text-red-700 ml-1">
                   <i class="pi pi-times text-xs"></i>
                 </button>
              </div>
            </div>

            <!-- Add rep input -->
            <div class="flex gap-2">
              <input 
                v-model="newSalesRep" 
                @keyup.enter="addSalesRep"
                type="text" 
                class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
                :placeholder="t('tiers.attachments.add_rep_placeholder')">
              <button @click="addSalesRep" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition">
                {{ t('tiers.attachments.add') }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    
     <div class="flex justify-end gap-3 mt-8">
        <button 
          @click="cancel"
          class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          {{ t('tiers.cancel') }}
        </button>
        <button 
          @click="save"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-lg shadow-primary/25 font-medium"
        >
          {{ t('tiers.create') }}
        </button>
      </div>
  </div>
</template>
