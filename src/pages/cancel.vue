<template>
    <q-page padding>
        <div class="row justify-between q-pt-md">
            <div class="q-pr-xl">
                <q-input dense v-model="filter" clearable type="text" label="Search Reservation" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
            </div>
        </div>
        <div class="q-pt-md">
        <q-table grid :data="Cancelled" :columns="columns" :rows-per-page-options="[0]" hide-bottom :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
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
                            <q-item class="column items-center">
                                <q-item-section>
                                    <q-btn flat label="View Full Details" icon="mdi-pencil" @click="getedit(props.row)" color="green"/>
                                </q-item-section>
                            </q-item>  
                            <q-separator  inset class="q-mt-sm" />           
                            <q-item class="q-mt-sm " v-show="props.row.clientFoodChoice">
                            <span class="full-width text-weight-bold">FOOD Choices</span>
                            </q-item>
                            <q-item v-for="(price, index) in props.row.clientFoodChoice" :key="index" class="column items-center">
                                <q-item-section>
                                <q-item-label> {{ price.foodName }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item v-for="(price, index) in props.row.clientAdditionalFood" :key="index" class="column items-center">
                                <q-item-section>
                                <q-item-label> {{ price.foodName }}</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item class="q-mt-sm" v-show="props.row.clientSelectPackage.type != 'CUSTOMIZE'">
                            <span class="full-width text-weight-bold " >INCLUSIONS</span>
                            </q-item>
                            <q-item v-for="(price, index) in props.row.clientSelectPackage.inclusions" :key="index" class="column items-center">
                                <q-item-section >
                                <q-item-label> {{ price.inclusion }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item v-for="(prices, indexes) in props.row.clientSelectPackage.addons" :key="indexes" class="column items-center">
                                <q-item-section >
                                <q-item-label> {{prices.addOnsQty}}x {{ prices.addons }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item v-for="(priceses, indexeses) in props.row.clientSelectPackage.services" :key="indexeses" class="column items-center">
                                <q-item-section >
                                <q-item-label> {{priceses.serviceQty}}x {{ priceses.services }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item v-show="props.row.clientAddons != 0 && props.row.clientServices != 0" class="q-mt-sm">
                            <span class="full-width text-weight-bold" >Add-Ons & Services</span>
                            </q-item>
                            <q-item v-for="(price, index) in props.row.clientAddons" :key="index" class="column items-center">
                                <q-item-section >
                                <q-item-label>{{price.addonsQty}}x {{ price.addons }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item v-for="(prices, indexes) in props.row.clientServices" :key="indexes" class="column items-center">
                                <q-item-section >
                                <q-item-label>{{prices.servicesQty}}x {{ prices.services }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <q-separator  inset class="q-mt-sm" />
                        <!-- <q-card-actions align="center">
                            <q-btn flat label="Cancel Event" @click="geteditCancel(props.row)" icon="mdi-cancel" color="orange-8"/>
                            <q-separator vertical class="column items-center text-weigth-bold" />
                            <q-btn @click="geteditResched(props.row)" flat label="Reschedule Event" icon="mdi-calendar-edit" color="orange-8" />
                        </q-card-actions> -->
                        </q-card-section>
                    </q-card>
                </div>
            </template>
        </q-table>
        </div>
        <q-dialog v-model="detailsAndPayment" full-height >
            <q-card class="shadow-0" style="width: 1000px; max-width: 100vw;">
                <q-card-section>
                <div class="text-h6"></div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                <div class="row flex flex-center">
                    <q-img src="statics/pics/logo.png" :ratio="1" style="width:3.5em;" class="q-ml-sm"/>
                    <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
                        <strong>Crissy's Meal Magic Catering Services</strong>
                    </q-toolbar-title>
                </div>
                <div class="row">
                    <div class="q-pa-sm column col-7">
                        <b class="col">FULLNAME: <i>{{this.selectedReservation.clientFName}} {{this.selectedReservation.clientLName}}</i></b> 
                        <b class="col">Place: <i>{{this.selectedReservation.clientPlace}} {{this.selectedReservation.clientCity}}</i></b>
                        <b v-if="this.selectedReservation.clientPackageType != 'FIXED'" class="col">PAX: <i>{{this.selectedReservation.clientPax}}Guest</i></b>
                        <b v-else class="col">PAX: <i>{{this.selectedReservation.clientSelectPackage.adultPax}} Adults & {{this.selectedReservation.clientSelectPackage.kidPax}} Kids</i></b> 
                        <b class="col">Motif: <i>{{this.selectedReservation.clientMotif}}</i></b>
                        <div v-if="this.selectedReservation.clientSelectTheme != ''">
                        <b v-for="(price, index) in this.selectedReservation.clientSelectTheme" :key="index" class="col">Theme: <i>{{price.themeName}}</i></b>
                        </div>
                        <div v-else>
                        <b class="col">Theme: <i>NONE</i></b>
                        </div>
                    </div>
                    <div class="q-pa-sm column col-5">
                        <b class="col">DATE OF EVENTS: <i>{{this.selectedReservation.clientReserveDate}}</i></b> 
                        <b class="col">TIME: <i>{{this.selectedReservation.clientStartTime}} - {{this.selectedReservation.clientEndTime}}</i></b>
                        <b class="col">EVENT: <i>{{this.selectedReservation.clientEvent}}</i></b>
                        <b class="col">Email: <i>{{this.selectedReservation.clientEmail}}</i></b>
                        <b class="col">Package Type: <i>{{this.selectedReservation.clientPackageType}} PACKAGE</i></b>
                    </div>
                </div>
                <q-separator inset />           
                <div class="row">
                    <div class="q-pa-sm col-4">
                        <q-item>
                        <span class="full-width text-weight-bold">FOOD CHOICES</span>
                        </q-item>
                        <q-list dense v-for="(price, index) in this.selectedReservation.clientFoodChoice" :key="index">
                            <q-item>
                                <q-item-section>
                                <li> {{ price.foodName }}</li>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <span v-show="this.selectedReservation.clientAdditionalFood != ''" class="full-width text-weight-bold">Additional Food</span>
                        <q-list dense v-for="(price, index) in this.selectedReservation.clientAdditionalFood" :key="index">
                            <q-item>
                                <q-item-section>
                                <li> {{ price.foodName }}</li>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div v-show="this.selectedReservation.clientPackageType != 'CUSTOMIZE'" class="q-pa-sm col-4">
                        <q-item>
                            <span class="full-width text-weight-bold " >INCLUSIONS</span>
                        </q-item>
                            <q-item dense v-for="(price, index) in this.returnFree.inclusions" :key="index" class="">
                                <q-item-section >
                                    <li>
                                        {{ price.inclusion }}
                                    </li>
                                </q-item-section>
                            </q-item>
                            <q-item dense v-for="(prices, indexes) in this.returnFree.addons" :key="indexes" class="">
                                <q-item-section >
                                <li> {{prices.addOnsQty}}x {{ prices.addons }}</li>
                                </q-item-section>
                            </q-item>
                            <q-item dense v-for="(priceses, indexeses) in this.returnFree.services" :key="indexeses" class="">
                                <q-item-section >
                                <li> {{priceses.serviceQty}}x {{ priceses.services }}</li>
                                </q-item-section>
                        </q-item>
                    </div>
                    <div v-show="this.selectedReservation.clientAddons != 0 || this.selectedReservation.clientServices != 0" class="q-pa-sm col-4">
                        <q-item>
                            <span class="full-width text-weight-bold " >Add-Ons & Services</span>
                        </q-item>
                        <q-item dense v-for="(price, index) in this.selectedReservation.clientAddons" :key="index" class="">
                            <q-item-section >
                                <li>
                                    {{price.addonsQty}}x {{ price.addons }}
                                </li>
                            </q-item-section>
                        </q-item>
                        <q-item dense v-for="(price, index) in this.selectedReservation.clientServices" :key="index" class="">
                            <q-item-section >
                                <li>
                                    {{price.servicesQty}}x {{ price.services }}
                                </li>
                            </q-item-section>
                        </q-item>
                    </div>
                </div>
                <div>
                    <div class="column">
                        <b class="col-12">Total Payment: <i>P</i> {{this.selectedReservation.clientTotalPayment}}</b>
                        <b class="col-12">Paid Amount: <i>P</i> {{this.selectedReservation.clientPaidAmount}}</b>
                        <b btnclass="col-12">Current Balance: <q-btn flat dense @click="payamount" color="orange-8"><i v-show="this.currentBalance != 0">P&nbsp;</i> {{this.currentBalance === 0 ? 'NO BALANCE' : this.currentBalance,}}</q-btn></b>
                    </div>
                </div>
                </q-card-section>
                <!-- <q-separator inset /> -->
                <!-- <q-card-actions v-show="this.tab != 'cancel'" class="q-pa-xl" align="center">
                    <q-btn dense class="bg-orange-4 bodyText" text-color="white" @click="medium = true" icon="mdi-calendar" label="Reschedule Event" />
                    <q-btn dense class="bg-orange-4 bodyText" text-color="white" @click="printNow" icon="print" label="Print Contract" />
                    <q-btn dense class="bg-orange-4 bodyText" text-color="white" @click="cancelNow" icon="cancel" label="Cancel Event" />
                </q-card-actions> -->
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Cancelled', this.$firestoreApp.collection('Cancelled'))
            .then(Cancelled => {
            console.log(Cancelled, 'Cancelled')
            })
    },
    data () {
        return {
            paginations: { sortBy: 'clientFName', descending: false, page: 1, rowsPerPage: 1000},
            selectedReservation: [],
            detailsAndPayment: false,
            Cancelled: [],
            filter: '',
            columns: [
                    { name: 'clientFName', required: true, label: 'Client First Name', align: 'left', field: 'clientFName', sortable: true },
                    { name: 'clientLName', required: true, label: 'Client Last Name', align: 'left', field: 'clientLName', sortable: true }
            ]
        }
    },
    methods:{
        getedit (task) {
            this.selectedReservation = task
            this.reserveID = task['.key']
            this.detailsAndPayment = true
        },
    },
    computed:{
        currentBalance(){
            try {
                let totalpack =  parseInt(this.selectedReservation.clientTotalPayment) - parseInt(this.selectedReservation.clientPaidAmount)
                return totalpack
            } catch(err){
                return 0
            }
        },
        returnFree(){
         if(this.selectedReservation === []){
                return []
            } else {
                let data = {...this.selectedReservation.clientSelectPackage}
                var key = data['.key']
                delete data.__index
                delete data['.key']
                console.log(data, 'datas')
                return data
            }
        },
    }
}
</script>