<template>
    <q-page padding>
        <template>  
        <!-- <q-page-sticky position="bottom-right" :offset="[80, 50]">
            <q-btn label="Add New Package" icon="add" class="q-my-md q-ml-md" color="orange-8" @click="addPackageDialog = true" />
                <q-tooltip>
                    New Reservation
                </q-tooltip>
        </q-page-sticky> -->
            <div class="q-mx-lg" >
                <q-table grid :data="Reservation" :columns="columns" :filter="filter"  pagination.sync="pagination" class="q-px-sm full-width align-center ">
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
                                            <q-btn flat label="View Full Details And Pay Balance" icon="mdi-pencil" @click="getedit(props.row)" color="green"/>
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
                                <q-card-actions align="center">
                                    <q-btn flat label="Cancel Event" icon="mdi-cancel" color="orange-8"/>
                                    <q-separator vertical class="column items-center text-weigth-bold" />
                                    <q-btn flat label="Reschedule Event" icon="mdi-calendar-edit" color="orange-8" />
                                </q-card-actions>
                                </q-card-section>
                            </q-card>
                        </div>
                    </template>
                </q-table>
            </div>
        </template>
        <q-dialog v-model="detailsAndPayment" full-height full-width >
            <q-card>
                <q-card-section>
                <div class="text-h6"></div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                <div class="row flex flex-center">
                    <q-img src="statics/logo.png" :ratio="1" style="width:3.5em;" class="q-ml-sm"/>
                    <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
                        <strong>Crissy's Meal Magic Catering Services</strong>
                    </q-toolbar-title>
                </div>
                <div class="row">
                    <div class="q-pa-sm column col-9">
                        <b class="col">FULLNAME: <i>{{this.selectedReservation.clientFName}} {{this.selectedReservation.clientLName}}</i></b> 
                        <b class="col">PLACE OF EVENTS: <i>{{this.selectedReservation.clientPlace}} {{this.selectedReservation.clientCity}}</i></b>
                        <b v-if="this.selectedReservation.clientPackageType != 'FIXED'" class="col">PLACE OF EVENTS: <i>{{this.selectedReservation.clientPax}}Guest</i></b>
                        <b v-else class="col">PAX: <i>{{this.selectedReservation.clientSelectPackage.adultPax}} Adults & {{this.selectedReservation.clientSelectPackage.kidPax}} Kids</i></b> 
                        <b class="col">Motif: <i>{{this.selectedReservation.clientMotif}}</i></b>
                        <b class="col">Theme: <i>{{this.selectedReservation.clientMotif}}</i></b>
                    </div>
                    <div class="q-pa-sm column col-3">
                        <b class="col">DATE OF EVENTS: <i>{{this.selectedReservation.clientReserveDate}}</i></b> 
                        <b class="col">TIME: <i>{{this.selectedReservation.clientStartTime}} - {{this.selectedReservation.clientEndTime}}</i></b>
                        <b class="col">EVENT: <i>{{this.selectedReservation.clientEvent}}</i></b>
                        <b class="col">Email: <i>{{this.selectedReservation.clientEmail}}</i></b>
                        <b class="col">Package Type: <i>{{this.selectedReservation.clientPackageType}} PACKAGE</i></b>
                    </div>
                </div>
                <q-separator inset />           
                <div class="row">
                    <div class="q-pa-sm col-2">
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
                        <span class="full-width text-weight-bold">Additional Food</span>
                        <q-list dense v-for="(price, index) in this.selectedReservation.clientAdditionalFood" :key="index">
                            <q-item>
                                <q-item-section>
                                <li> {{ price.foodName }}</li>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div v-show="this.selectedReservation.clientPackageType != 'CUSTOMIZE'" class="q-pa-sm col-3">
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
                    <div v-show="this.selectedReservation.clientAddons != 0 || this.selectedReservation.clientServices != 0" class="q-pa-sm col-3">
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
                    <div class="q-pa-sm col-4">
                            <div class="row">
                                <div class="col-6 row">
                                    <b class="q-pa-sm col-12">Total Payment: <i>P</i> {{this.selectedReservation.clientTotalPayment}}</b>
                                    <b class="q-pa-sm col-12">Paid Amount: <i>P</i> {{this.selectedReservation.clientPaidAmount}}</b>
                                </div>
                                <div class="col-6 row">
                                    <b btnclass="col q-pa-sm">Current Balance: <q-btn flat dense @click="payamount" color="orange-8"><i v-show="this.currentBalance != 0">P&nbsp;</i> {{this.currentBalance === 0 ? 'NO BALANCE' : this.currentBalance,}}</q-btn></b>
                                </div>
                            </div>
                            <div v-show="this.currentBalance != 0" class="q-pa-sm">
                                <q-input type="number" class="col" color="orange-8" outlined v-model="enterAmount" label="Enter Amount To Pay"/>
                            </div>
                            <q-separator inset/>
                            <div v-show="this.currentBalance != 0" class="column items-center">
                                <div class="column items-center text-weight-bold">Pay via Card</div>
                            </div>
                            <div v-show="this.currentBalance != 0" class="container q-pa-sm">
                                <stripe-elements ref="elementsRef" color="orange-8" :pk="publishableKey" :amount="amount" @token="tokenCreated" @loading="loading = $event" outline class="col q-mr-md">
                                </stripe-elements>
                                <q-btn outlined color="orange-8" class="col full-width" @click="submit">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{amountOnCard}}</b></q-btn>
                                <!-- <button @click="submit">Pay ${{amount / 100}}</button> -->
                            </div>
                            <div v-show="this.currentBalance != 0" class="column items-center">
                                <div class="column items-center text-weight-bold">Pay via Cash</div>
                            </div>
                            <div v-show="this.currentBalance != 0" class="q-pa-sm">
                                <q-input type="number" readonly class="q-pa-sm full-width col" color="orange-8" outlined v-model="enterAmount" label="Amount To Pay on Cash"/>
                                <q-btn outlined color="orange-8" class="col full-width" @click="updatePaymentCash">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{enterAmount}}</b></q-btn>
                            </div>
                    </div>
                </div>
                </q-card-section>

                <!-- <q-card-actions align="bottom-left" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
                </q-card-actions> -->
            </q-card>
        </q-dialog>

    </q-page>
</template>
<script>
import { date } from 'quasar'
import { StripeElements } from 'vue-stripe-checkout';
export default {
     components: {
         StripeElements
     },
      data(){
        return {
            enterAmount: 0,
            loading: false,
            amount: 0,
            publishableKey: 'pk_test_kUO5j8FaZUKitD1Qh3ibZ2HP00YkxaEOOS', 
            token: null,
            charge: null,
            options: [
                { label: 'Full Payment', value: 'Full Payment' },
                { label: 'Down Payment', value: 'Down Payment' },
                { label: 'Reservation Fee', value: 'Reservation Fee' }
            ],
            detailsAndPayment: false,
            Reservation: [],
            selectedReservation: [],
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
        currentBalance(){
            try {
                let totalpack =  parseInt(this.selectedReservation.clientTotalPayment) - parseInt(this.selectedReservation.clientPaidAmount)
                return totalpack
            } catch(err){
                return 0
            }
        },
        addTotalPaid(){
            try {
                let totalpack =  parseInt(this.selectedReservation.clientPaidAmount) + parseInt(this.enterAmount)
                return totalpack
            } catch(err){
                return 0
            }
        },
        amountOnCard(){
            if(this.enterAmount === 0 || this.enterAmount === ''){
                return this.amount = 0 
            }else{
                return this.amount = this.enterAmount
            }
        },
        returnTheme(){
            if(this.selectedReservation === []){
                return []
            }else{
                let sr = this.selectedReservation
                return sr.clientSelectTheme
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
        }
    },
    methods:{
        updatePaymentCard(){
            var PaymentBago = {
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
                clientPaidAmount: this.addTotalPaid,
                clientPayDetails: this.selectedReservation.clientPayDetails,
                clientTokenID: this.selectedReservation.clientTokenID,
                clientPaymentType: this.selectedReservation.clientPaymentType,
                clientReserveType: 'WALK-IN',
                clientDateofReserve: this.selectedReservation.clientDateofReserve
                }
                    this.$firestoreApp.collection('Reservation').doc(this.reserveID).set(PaymentBago)
                    .then((ref) =>{
                        let paymentDetails = {
                            clientReservationKey: this.reserveID,
                            clientPayDetails: this.paydetails,
                            clientTokenID: this.token.id,
                            clientPaymentType: 'CARD',
                            clientPaymentDate: date.formatDate(new Date(), 'YYYY-MM-DD')
                        }
                        this.$firestoreApp.collection('Payments').add(paymentDetails)
                        .then(()=>{
                            this.$q.notify({
                                message: 'Payments Updated!',
                                icon: 'mdi-folder-plus-outline',
                                color: 'orange-8',
                                textColor: 'white',
                                position: 'center'
                                })
                            })  
                        })
                        this.detailsAndPayment = false
                        this.enterAmount = 0
        },
        updatePaymentCash(){
            var PaymentBago = {
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
                clientPaidAmount: this.addTotalPaid,
                clientPayDetails: this.selectedReservation.clientPayDetails,
                clientTokenID: this.selectedReservation.clientTokenID,
                clientPaymentType: this.selectedReservation.clientPaymentType,
                clientReserveType: this.selectedReservation.clientReserveType,
                clientDateofReserve: this.selectedReservation.clientDateofReserve
                }
                this.$q.dialog({
                        title: 'Update Payment',
                        message: 'Update This Payment?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => { 
                    this.$firestoreApp.collection('Reservation').doc(this.reserveID).set(PaymentBago)
                    .then((ref) =>{
                        let paymentDetails = {
                            clientReservationKey: this.reserveID,
                            clientPayDetails: 'CASH',
                            clientTokenID: 'CASH',
                            clientPaymentType: 'CASH',
                            clientPaymentDate: date.formatDate(new Date(), 'YYYY-MM-DD')
                        }
                        this.$firestoreApp.collection('Payments').add(paymentDetails)
                        .then(()=>{
                            this.$q.notify({
                                message: 'Payments Updated!',
                                icon: 'mdi-folder-plus-outline',
                                color: 'orange-8',
                                textColor: 'white',
                                position: 'center'
                                })
                            })  
                        })
                        this.detailsAndPayment = false
                        this.enterAmount = 0
                    })
        },
        payamount(){
            this.enterAmount = this.currentBalance
        },
        getedit (task) {
            this.selectedReservation = task
            this.reserveID = task['.key']
            this.detailsAndPayment = true
        },
        submit () {
        this.$refs.elementsRef.submit();
        },
        tokenCreated (token) {
        this.token = token;
        console.log(token,'token')
        // for additional charge objects go to https://stripe.com/docs/api/charges/object
        this.charge = {
            source: token.card,
            amount: this.amount,
        }
        this.sendTokenToServer(this.charge);
        },
        sendTokenToServer (charge) {
        // Send to server
        console.log(charge,'charge')
        if(this.amount === 0){
            this.$q.dialog({
                title: `Unable to Continue??`,
                message: 'Please Select Payment Type??',
                color: 'orange-8',
                textColor: 'grey',
                icon: 'negative',
                ok: 'Ok'
            })
        }else{
            this.$q.dialog({
                        title: 'Update Payment',
                        message: 'Update This Payment?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => {
                        this.paydetails = charge
                        this.updatePaymentCard()
                    })
        }
        },
    }
}
</script>