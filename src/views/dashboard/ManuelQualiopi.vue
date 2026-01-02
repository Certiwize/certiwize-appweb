<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../../supabase';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';

const resources = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const error = ref(null);

// Récupération des données triées par Code
const fetchResources = async () => {
    try {
        const { data, error: supabaseError } = await supabase
            .from('resources')
            .select('*')
            // Tri principal par le code (c2i8, c3i9...), puis par ordre d'affichage
            .order('code', { ascending: true })
            .order('display_order', { ascending: true });
            
        if (supabaseError) throw supabaseError;
        
        console.log('📚 Resources chargées:', data.length);
        console.log('📋 Détails:', data);
        
        resources.value = data;
    } catch (e) {
        console.error("❌ Erreur chargement:", e.message);
        error.value = e.message;
    } finally {
        loading.value = false;
    }
};

// Logique de filtrage (Recherche + Type)
const filteredResources = computed(() => {
    if (!searchQuery.value) return resources.value;
    const lowerQuery = searchQuery.value.toLowerCase();
    return resources.value.filter(r => 
        (r.title && r.title.toLowerCase().includes(lowerQuery)) || 
        (r.code && r.code.toLowerCase().includes(lowerQuery))
    );
});

const manuels = computed(() => {
    const result = filteredResources.value.filter(r => r.type === 'Manuel');
    console.log('📖 Manuels trouvés:', result.length, result);
    return result;
});

const outils = computed(() => {
    const result = filteredResources.value.filter(r => r.type === 'Outil');
    console.log('🔧 Outils trouvés:', result.length, result);
    return result;
});

const openFile = (url) => {
    if(url) window.open(url, '_blank');
};

// Fonction pour donner une couleur au Tag selon le Critère (C2, C3...)
const getSeverity = (code) => {
    if (!code) return 'secondary';
    if (code.startsWith('c2')) return 'info';    // Bleu
    if (code.startsWith('c3')) return 'success'; // Vert
    if (code.startsWith('c4')) return 'warn';    // Jaune/Orange
    if (code.startsWith('c5')) return 'danger';  // Rouge
    if (code.startsWith('c6')) return 'contrast'; // Noir/Blanc
    return 'primary'; // Par défaut
};

onMounted(() => {
    fetchResources();
});
</script>

<template>
    <div class="max-w-7xl mx-auto pb-20">
        <!-- Message d'erreur -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-center gap-2 text-red-800 dark:text-red-200">
                <i class="pi pi-exclamation-triangle"></i>
                <span class="font-semibold">Erreur de chargement:</span>
                <span>{{ error }}</span>
            </div>
        </div>

        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manuel Qualité & Outils</h1>
                <p class="text-gray-500">Documents classés par indicateurs Qualiopi.</p>
            </div>
            <span class="p-input-icon-left w-full md:w-64">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" placeholder="Rechercher (ex: c4i17)" class="w-full" />
            </span>
        </div>

        <TabView class="w-full">
            
            <TabPanel header="Manuel Qualité">
                <div v-if="loading" class="text-center py-10">Chargement des documents...</div>
                
                <div v-else-if="manuels.length === 0" class="text-center py-10 text-gray-500">
                    Aucun document trouvé.
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card 
                        v-for="doc in manuels" 
                        :key="doc.id" 
                        class="hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 cursor-pointer group" 
                        @click="openFile(doc.file_url)"
                    >
                        <template #header>
                            <div class="h-1 w-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary transition-colors"></div>
                        </template>
                        
                        <template #title>
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between items-start">
                                    <Tag :value="doc.code.toUpperCase()" :severity="getSeverity(doc.code)" class="font-mono text-sm" v-if="doc.code" />
                                    <i class="pi pi-file-pdf text-red-500 text-xl opacity-80 group-hover:opacity-100"></i>
                                </div>
                                <span class="text-lg font-semibold leading-tight mt-1">{{ doc.title }}</span>
                            </div>
                        </template>
                        
                        <template #content>
                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                                {{ doc.description || "Document de conformité Qualiopi." }}
                            </p>
                        </template>
                    </Card>
                </div>
            </TabPanel>

            <TabPanel header="Boîte à Outils (Excel)">
                <div class="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                    <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                        <i class="pi pi-download text-primary"></i>
                        Fichiers Excel à télécharger
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="tool in outils" :key="tool.id" class="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary transition">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                                    <i class="pi pi-file-excel text-xl"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <Tag :value="tool.code.toUpperCase()" severity="success" class="text-xs" v-if="tool.code" />
                                        <h4 class="font-semibold text-gray-900 dark:text-white">{{ tool.title }}</h4>
                                    </div>
                                    <p class="text-xs text-gray-500">{{ tool.description || 'Format Excel (.xlsx)' }}</p>
                                </div>
                            </div>
                            <Button icon="pi pi-download" text rounded severity="secondary" @click="openFile(tool.file_url)" />
                        </div>
                    </div>
                </div>
            </TabPanel>

        </TabView>
    </div>
</template>