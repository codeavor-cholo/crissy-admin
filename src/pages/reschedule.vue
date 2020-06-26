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
        <q-table grid :data="Reschedule" :columns="columns" :rows-per-page-options="[0]" hide-bottom :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
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
                            <q-item>
                                <div class="column q-gutter-sm q-pt-sm">
                                    <div style="font-family: 'Montserrat', sans-serif;" class="row justify-between">
                                        <div>from This Date:</div> 
                                        <div>{{$moment(props.row.clientPrevReserveDate).format('LL')}}</div>
                                    </div>
                                    <div style="font-family: 'Montserrat', sans-serif;" class="row justify-between">
                                        <div>to This Date:</div> 
                                        <div>{{$moment(props.row.clientReserveDate).format('LL')}}</div>
                                    </div>
                                    <div style="font-family: 'Montserrat', sans-serif;" class="row justify-between">
                                        <div>from this Time:</div>
                                        <div>{{props.row.clientPrevStartTime}} - {{props.row.clientPrevEndTime}}</div>
                                    </div>
                                    <div style="font-family: 'Montserrat', sans-serif;" class="row justify-between">
                                        <div>to this Time:</div>
                                        <div>{{props.row.clientStartTime}} - {{props.row.clientEndTime}}</div>
                                    </div>
                                    <div style="font-family: 'Montserrat', sans-serif;" class="row justify-between">
                                        <div>Number of Pax:</div>
                                        <div class="q-pl-xl q-ml-xl" v-show="props.row.clientPackageType != 'FIXED'">{{props.row.clientPax}} Guest</div><div><span v-show="props.row.clientPackageType === 'FIXED'">{{props.row.clientPaxDetails}}</span></div>                                 
                                    </div>
                                </div>
                            </q-item>
                            <q-item class="column items-center">
                                <q-item-section>
                                    <q-btn flat label="View Full Details" icon="mdi-pencil" @click="getedit(props.row)" color="green"/>
                                </q-item-section>
                            </q-item>  
                            <q-separator  inset class="q-mt-sm" />           
                            <q-item class="q-mt-sm ">
                            <span class="full-width text-weight-bold">REASON TO RESCHEDULE EVENT</span>
                            </q-item>
                            <q-item class="column items-center">
                                <q-item-section>
                                <q-item-label> {{ props.row.clientReason }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            
                        </q-list>
                        <q-separator  inset class="q-mt-sm" />
                        <q-card-actions align="center">
                            <q-btn flat label="Approve" @click="geteditApprove(props.row)" icon="mdi-check-decagram" color="orange-8"/>
                            <q-separator vertical class="column items-center text-weigth-bold" />
                            <q-btn  flat label="Decline" @click="geteditDecline(props.row)" icon="mdi-close-circle" color="orange-8" />
                        </q-card-actions>
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
        <q-dialog v-model="alert">
            <q-card>
                <q-card-section>
                <div class="text-h6">Reschedule this Event?</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <!-- {{this.reserveID}} -->
                Are You Sure You Want To Approve <b class="q-pa-sm col-12 text-h6 text-orange" color="orange">{{this.selectedReservation.clientFName}} {{this.selectedReservation.clientLName}}</b> Event Rescheduling?
                </q-card-section>

                <q-card-actions align="right">
                <q-btn flat label="Cancel" color="orange-8" v-close-popup />
                <q-btn flat label="OK" color="orange-8" @click="approve" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="decline">
            <q-card>
                <q-card-section>
                <div class="text-h6">Decline this Event?</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <!-- {{this.reserveID}} -->
                Are You Sure You Want To Decline <b class="q-pa-sm col-12 text-h6 text-orange" color="orange">{{this.selectedReservation.clientFName}} {{this.selectedReservation.clientLName}}</b> Event Rescheduling?
                </q-card-section>

                <q-card-actions align="right">
                <q-btn flat label="Cancel" color="orange-8" v-close-popup />
                <q-btn flat label="OK" color="orange-8" @click="declined" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Reschedule', this.$firestoreApp.collection('Reschedule'))
            .then(Reschedule => {
            console.log(Reschedule, 'Reschedule')
            })
    },
    data () {
        return {
            decline: false,
            alert: false,
            paginations: { sortBy: 'clientFName', descending: false, page: 1, rowsPerPage: 1000},
            selectedReservation: [],
            detailsAndPayment: false,
            Reschedule: [],
            filter: '',
            columns: [
                    { name: 'clientFName', required: true, label: 'Client First Name', align: 'left', field: 'clientFName', sortable: true },
                    { name: 'clientLName', required: true, label: 'Client Last Name', align: 'left', field: 'clientLName', sortable: true }
            ]
        }
    },
    methods:{
        geteditApprove (task) {
            this.selectedReservation = task
            this.reserveID = task['.key']
            this.alert = true
        },
        geteditDecline (task) {
            this.selectedReservation = task
            this.reserveID = task['.key']
            this.decline = true
        },
        getedit (task) {
            this.selectedReservation = task
            this.reserveID = task['.key']
            this.detailsAndPayment = true
        },
        approve(){
        var reschedBago = {
                clientSelectTheme: this.selectedReservation.clientSelectTheme,
                clientPaxDetails: this.selectedReservation.clientPaxDetails,
                clientEventType: this.selectedReservation.clientEventType,
                clientAdditionalFood: this.selectedReservation.clientAdditionalFood,
                clientUID: this.selectedReservation.clientUID,
                clientReserveDate: this.selectedReservation.clientReserveDate,
                clientFName: this.selectedReservation.clientFName,
                clientLName: this.selectedReservation.clientLName,
                clientPlace: this.selectedReservation.clientPlace,
                clientCity: this.selectedReservation.clientCity,
                clientEvent: this.selectedReservation.clientEvent,
                clientMotif: this.selectedReservation.clientMotif,
                clientPax: this.selectedReservation.clientPax,
                clientEmail: this.selectedReservation.clientEmail,
                clientStartTime: this.selectedReservation.clientStartTime,
                clientEndTime: this.selectedReservation.clientEndTime,
                clientSelectPackage: this.selectedReservation.clientSelectPackage,
                clientPackageType: this.selectedReservation.clientPackageType,
                clientFoodChoice: this.selectedReservation.clientFoodChoice,
                clientServices: this.selectedReservation.clientServices,
                clientAddons: this.selectedReservation.clientAddons,
                clientTotalPayment: this.selectedReservation.clientTotalPayment,
                clientPaidAmount: this.selectedReservation.clientPaidAmount,
                clientPayDetails: this.selectedReservation.clientPayDetails,
                clientTokenID: this.selectedReservation.clientTokenID,
                clientPaymentType: this.selectedReservation.clientPaymentType,
                clientReserveType: this.selectedReservation.clientReserveType,
                clientDateofReserve: this.selectedReservation.clientDateofReserve,
                // clientReason: this.reason,
                // clientPrevReserveDate: this.selectedReservation.clientReserveDate,
                // clientPrevStartTime: this.selectedReservation.clientStartTime,
                // clientPrevEndTime: this.selectedReservation.clientEndTime,
                // clientDateResched: date.formatDate(new Date(), 'YYYY/MM/DD'),
        }
            this.$q.dialog({
                title: 'Reschedule Event',
                message: 'Reschedule This Event?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => {
            this.$firestoreApp.collection('Reservation').doc(this.reserveID).set(reschedBago)
            .then((ref) =>{
                var id = this.reserveID
                this.$firestoreApp.collection('Reschedule').doc(id).delete()
                this.$q.notify({
                            title: 'Reschedule Event',
                            message: 'Reschedule Approved',
                            color: 'deep-orange',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.medium = false
                        this.reschedCancel = false
                    })
                })
        },
        declined(){
        var reschedBago = {
                clientSelectTheme: this.selectedReservation.clientSelectTheme,
                clientPaxDetails: this.selectedReservation.clientPaxDetails,
                clientEventType: this.selectedReservation.clientEventType,
                clientAdditionalFood: this.selectedReservation.clientAdditionalFood,
                clientUID: this.selectedReservation.clientUID,
                clientReserveDate: this.selectedReservation.clientPrevReserveDate,
                clientFName: this.selectedReservation.clientFName,
                clientLName: this.selectedReservation.clientLName,
                clientPlace: this.selectedReservation.clientPlace,
                clientCity: this.selectedReservation.clientCity,
                clientEvent: this.selectedReservation.clientEvent,
                clientMotif: this.selectedReservation.clientMotif,
                clientPax: this.selectedReservation.clientPax,
                clientEmail: this.selectedReservation.clientEmail,
                clientStartTime: this.selectedReservation.clientPrevStartTime,
                clientEndTime: this.selectedReservation.clientPrevEndTime,
                clientSelectPackage: this.selectedReservation.clientSelectPackage,
                clientPackageType: this.selectedReservation.clientPackageType,
                clientFoodChoice: this.selectedReservation.clientFoodChoice,
                clientServices: this.selectedReservation.clientServices,
                clientAddons: this.selectedReservation.clientAddons,
                clientTotalPayment: this.selectedReservation.clientTotalPayment,
                clientPaidAmount: this.selectedReservation.clientPaidAmount,
                clientPayDetails: this.selectedReservation.clientPayDetails,
                clientTokenID: this.selectedReservation.clientTokenID,
                clientPaymentType: this.selectedReservation.clientPaymentType,
                clientReserveType: this.selectedReservation.clientReserveType,
                clientDateofReserve: this.selectedReservation.clientDateofReserve,
                // clientReason: this.reason,
                // clientPrevReserveDate: this.selectedReservation.clientReserveDate,
                // clientPrevStartTime: this.selectedReservation.clientStartTime,
                // clientPrevEndTime: this.selectedReservation.clientEndTime,
                // clientDateResched: date.formatDate(new Date(), 'YYYY/MM/DD'),
        }
            this.$q.dialog({
                title: 'Declined Event',
                message: 'Declined This Event?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => {
            this.$firestoreApp.collection('Reservation').add(reschedBago)
            .then((ref) =>{
                var id = this.reserveID
                this.$firestoreApp.collection('Reschedule').doc(id).delete()
                this.$q.notify({
                            title: 'Declined Event',
                            message: 'Reschedule Declined',
                            color: 'deep-orange',
                            textColor: 'white',
                            position: 'center'
                        })
                    })
                })
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