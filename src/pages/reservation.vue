<template>
    <q-page padding>
        <template>  
                <q-page-sticky position="bottom-right" :offset="[80, 50]">
                    <q-btn label="Add New Package" icon="add" class="q-my-md q-ml-md" color="orange-8" @click="addPackageDialog = true" />
                        <q-tooltip>
                            New Reservation
                        </q-tooltip>
                </q-page-sticky>
                    <div class="q-mx-lg" >
                        <q-table grid :data="Reservation" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card"  style="border-radius:20px" >
                                        <q-card-section class="text-grey-8">
                                            <q-list dense>
                                            <q-item class="q-mt-sm">
                                                <q-item-section>
                                                    <span class="full-width text-h6  text-weight-bold">{{props.row.clientFName}} {{props.row.clientLName}}</span>
                                                </q-item-section>
                                                 <q-item-section side>
                                                    <span class="text-h6 text-weight-bold text-orange-8">{{props.row.clientReserveDate}}</span>
                                                 </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section lines="1">
                                                    <span class="full-width text-weight-bold flex flex-center">{{props.row.clientPlace}} {{props.row.clientCity}}</span>
                                                </q-item-section>
                                            </q-item>     
                                            <q-separator  inset class="q-mt-sm" />           
                                            <q-item class="q-mt-sm " v-show="props.row.clientFoodChoice">
                                            <span class="full-width text-weight-bold">FOOD Choices</span>
                                            </q-item>
                                            <q-item v-for="(price, index) in props.row.clientFoodChoice" :key="index" class="">
                                                <q-item-section>
                                                <q-item-label> {{ price.foodName }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
            
                                            <q-item class="q-mt-sm" v-show="props.row.clientSelectPackage">
                                            <span class="full-width text-weight-bold " >INCLUSIONS</span>
                                            </q-item>
                                            <q-item v-for="(price, index) in props.row.clientSelectPackage.inclusions" :key="index" class="">
                                                <q-item-section >
                                                <q-item-label> {{ price.inclusion }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
            
                                        <!-- <q-card-actions align="center">
                                            <q-btn flat label="Edit" icon="edit" color="green"/>
                                            <q-btn flat label="Delete" icon="delete" color="grey-8" />
                                        </q-card-actions> -->
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
                    </div>
        </template>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            Reservation: [],
            filter: '',
            pagination: { sortBy: 'clientFname', descending: false, page: 1, rowsPerPage: 10},
            columns: [
                { name: 'clientFname', required: true, label: 'First Name', align: 'center', field: 'clientFname', sortable: true },
                { name: 'clientEvent', align: 'center', label: 'Event', field: 'clientEvent', sortable: true },
            ]
        }
    },
    mounted () {
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            })
    },
    computed: {
    },
    methods:{
    }
}
</script>