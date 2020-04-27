<template>
    <q-page class="q-pt-md q-pa-md">
        <div class="text-right">
            <q-btn dense style="width:100px" color="orange-7" label="Payment" @click="payment = true" />
        </div>
        <div class="q-pt-sm text-weight-bold" style="font-size:25px">    
            <i>{{reservation.clientEvent}}</i>
        </div>
        <div class="column q-pt-sm q-gutter-sm">
            <div>
                <div class="text-weight-bold">Name of Customer: {{reservation.clientFName}} {{reservation.clientLName}}</div>
                <div class="text-weight-bold">Email Address: {{reservation.clientEmail}}</div>
                <div class="text-weight-bold">Date of Event: {{reservation.clientReserveDate}}</div>
                <div class="text-weight-bold">Time Start: {{reservation.clientStartTime}}</div> 
                <div class="text-weight-bold">Time End: {{reservation.clientEndTime}}</div>
                <div class="text-weight-bold">Event Place: {{reservation.clientPlace}} {{reservation.clientCity}}</div>
                <div v-if="reservation.clientPackageType != 'FIXED'" class="text-weight-bold">Pax: {{reservation.clientPax}}Guest</div>
                <div v-else class="text-weight-bold">PAX: {{reservation.clientSelectPackage.adultPax}} Adults & {{reservation.clientSelectPackage.kidPax}} Kids</div>
                <div class="text-weight-bold">Balance Payment: {{ parseInt(reservation.clientTotalPayment) - parseInt(reservation.clientPaidAmount) }}</div>    
                <div class="text-weight-bold">Motif: {{reservation.clientMotif}}</div>
                <!-- <div class="text-weight-bold">Theme: </div> -->
                <div class="text-weight-bold">Package Name: {{reservation.clientPackageType}}</div>
            </div>
        </div>
                <div class="q-pt-sm text-weight-bold">
                    Foods: 
                </div>
                <q-list dense v-for="(c, index) in reservation.clientFoodChoice" :key="index">
                        <q-item>
                            <q-item-section>
                            <div class="text-center">
                                <q-item-label class="text-weight-bold">{{ c.foodName }}</q-item-label>
                            </div>
                            <div class="row items-center justify-around">
                                <div>
                                    <q-item-label caption>{{ c.category }}</q-item-label>
                                </div>
                                <img :src="c.foodPic" style="width:50px;height:45px">
                            </div>
                            </q-item-section>
                        </q-item>
                </q-list>
                <div v-show="reservation.clientAdditionalFood.length != 0">
                    <div class="q-pt-sm text-weight-bold">
                    Additional Foods: 
                    </div>
                    <q-list dense v-for="(a, indexx) in reservation.clientAdditionalFood" :key="indexx">
                            <q-item>
                                <q-item-section>
                                <div class="text-center">
                                    <q-item-label class="text-weight-bold">{{ a.foodName }}</q-item-label>
                                </div>
                                <div class="row items-center justify-around">
                                    <div>
                                        <q-item-label caption>{{ a.category }}</q-item-label>
                                    </div>
                                    <img :src="a.foodPic" style="width:50px;height:45px">
                                </div>
                                </q-item-section>
                            </q-item>
                    </q-list>
                </div>
                <div class="row q-gutter-sm">
                    <div v-show="reservation.clientPackageType != 'CUSTOMIZE'" class="q-pa-sm col-5">
                        <q-item>
                            <span class="full-width text-weight-bold " >INCLUSIONS</span>
                        </q-item>
                            <q-item dense v-for="(price, indexl) in this.returnFree.inclusions" :key="indexl" class="">
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
                    <div v-show="reservation.clientAddons != 0 || reservation.clientServices != 0" class="q-pa-sm col-5">
                        <q-item>
                            <span class="full-width text-weight-bold " >Add-Ons & Services</span>
                        </q-item>
                        <q-item dense v-for="(pricelll, indexlll) in reservation.clientAddons" :key="indexlll" class="">
                            <q-item-section >
                                <li>
                                    {{pricelll.addonsQty}}x {{ pricelll.addons }}
                                </li>
                            </q-item-section>
                        </q-item>
                        <q-item dense v-for="(pricell, indexll) in reservation.clientServices" :key="indexll" class="">
                            <q-item-section >
                                <li>
                                    {{pricell.servicesQty}}x {{ pricell.services }}
                                </li>
                            </q-item-section>
                        </q-item>
                    </div>
                </div>


<!-- PAYMENT DIALOG -->
        <q-dialog v-model="payment" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Payment</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="q-pa-sm col-4">
                            <div class="row">
                                <div class="col-6 row">
                                    <b class="q-pa-sm col-12">Total Payment: <i>P</i> {{reservation.clientTotalPayment}}</b>
                                    <b class="q-pa-sm col-12">Paid Amount: <i>P</i> {{reservation.clientPaidAmount}}</b>
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
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
<!-- END OF PAYMENT -->
    </q-page>
</template>

<script>
import { date } from 'quasar'
import { StripeElements } from 'vue-stripe-checkout';
export default {
     components: {
         StripeElements
     },
  data () {
    return {
      enterAmount: 0,
      loading: false,
      amount: 0,
      publishableKey: 'pk_test_kUO5j8FaZUKitD1Qh3ibZ2HP00YkxaEOOS', 
      token: null,
      charge: null,
      payment: false,
      orderId: '',
      reservation: [],
      Reservation: [],
    }
  },
  created(){
    this.orderId = this.$route.params.id
  },
  computed:{
    addTotalPaid(){
            try {
                let totalpack =  parseInt(this.reservation.clientPaidAmount) + parseInt(this.enterAmount)
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
    currentBalance(){
            try {
                let totalpack =  parseInt(this.reservation.clientTotalPayment) - parseInt(this.reservation.clientPaidAmount)
                return totalpack
            } catch(err){
                return 0
            }
        },  
    returnFree(){
        if(this.reservation === []){
            return []
        } else {
            let data = {...this.reservation.clientSelectPackage}
            var key = data['.key']
            delete data.__index
            delete data['.key']
            console.log(data, 'datas')
            return data
        }
    }
  },
  mounted(){
    this.$binding('reservation', this.$firestoreApp.collection('Reservation').doc(this.orderId))
    .then(reservation => {
    console.log(reservation, 'reservation')
    })
  },
  methods:{
      updatePaymentCard(){
            var PaymentBago = {
                clientSelectTheme: this.reservation.clientSelectTheme,
                clientPaxDetails: this.reservation.clientPaxDetails,
                clientEventType: this.reservation.clientEventType,
                clientAdditionalFood: this.reservation.clientAdditionalFood,
                clientUID: this.reservation.clientUID,
                clientReserveDate: this.reservation.clientReserveDate,
                clientFName: this.reservation.clientFName,
                clientLName: this.reservation.clientLName,
                clientPlace: this.reservation.clientPlace,
                clientCity: this.reservation.clientCity,
                clientEvent: this.reservation.clientEvent,
                clientMotif: this.reservation.clientMotif,
                clientPax: this.reservation.clientPax,
                clientEmail: this.reservation.clientEmail,
                clientStartTime: this.reservation.clientStartTime,
                clientEndTime: this.reservation.clientEndTime,
                clientSelectPackage: this.reservation.clientSelectPackage,
                clientPackageType: this.reservation.clientPackageType,
                clientFoodChoice: this.reservation.clientFoodChoice,
                clientServices: this.reservation.clientServices,
                clientAddons: this.reservation.clientAddons,
                clientTotalPayment: this.reservation.clientTotalPayment,
                clientPaidAmount: this.addTotalPaid,
                clientPayDetails: this.reservation.clientPayDetails,
                clientTokenID: this.reservation.clientTokenID,
                clientPaymentType: this.reservation.clientPaymentType,
                clientReserveType: this.reservation.clientReserveType,
                clientDateofReserve: this.reservation.clientDateofReserve,
                }
                    this.$firestoreApp.collection('Reservation').doc(this.orderId).set(PaymentBago)
                    .then((ref) =>{
                        let paymentDetails = {
                            clientReservationKey: this.orderId,
                            clientPayDetails: this.paydetails,
                            clientTokenID: this.token.id,
                            clientPaymentType: 'CARD',
                            clientUID: this.reservation.clientUID,
                            transactionType: 'WALK-IN',
                            clientEmail: this.reservation.clientEmail,
                            clientPaymentDate: date.formatDate(new Date(), 'YYYY-MM-DD')
                        }
                        console.log(paymentDetails, 'detailspayment')
                        this.$firestoreApp.collection('Payments').add(paymentDetails)
                        .then(()=>{
                            this.$q.notify({
                                message: 'Payments Updated!',
                                icon: 'mdi-folder-plus-outline',
                                color: 'orange-8',
                                textColor: 'white',
                                position: 'center'
                                })
                                this.payment = false
                                this.enterAmount = 0
                            })  
                        })
        },
      updatePaymentCash(){
            var PaymentBago = {
                clientSelectTheme: this.reservation.clientSelectTheme,
                clientPaxDetails: this.reservation.clientPaxDetails,
                clientEventType: this.reservation.clientEventType,
                clientAdditionalFood: this.reservation.clientAdditionalFood,
                clientUID: this.reservation.clientUID,
                clientReserveDate: this.reservation.clientReserveDate,
                clientFName: this.reservation.clientFName,
                clientLName: this.reservation.clientLName,
                clientPlace: this.reservation.clientPlace,
                clientCity: this.reservation.clientCity,
                clientEvent: this.reservation.clientEvent,
                clientMotif: this.reservation.clientMotif,
                clientPax: this.reservation.clientPax,
                clientEmail: this.reservation.clientEmail,
                clientStartTime: this.reservation.clientStartTime,
                clientEndTime: this.reservation.clientEndTime,
                clientSelectPackage: this.reservation.clientSelectPackage,
                clientPackageType: this.reservation.clientPackageType,
                clientFoodChoice: this.reservation.clientFoodChoice,
                clientServices: this.reservation.clientServices,
                clientAddons: this.reservation.clientAddons,
                clientTotalPayment: this.reservation.clientTotalPayment,
                clientPaidAmount: this.addTotalPaid,
                clientPayDetails: this.reservation.clientPayDetails,
                clientTokenID: this.reservation.clientTokenID,
                clientPaymentType: this.reservation.clientPaymentType,
                clientReserveType: this.reservation.clientReserveType,
                clientDateofReserve: this.reservation.clientDateofReserve
                }
                this.$q.dialog({
                        title: 'Update Payment',
                        message: 'Update This Payment?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => { 
                    this.$firestoreApp.collection('Reservation').doc(this.orderId).set(PaymentBago)
                    .then((ref) =>{
                        let paymentDetails = {
                            clientReservationKey: this.orderId,
                            clientPayDetails: {
                                amount: this.enterAmount,
                                source: 'CASH'
                            },
                            clientTokenID: 'CASH',
                            clientPaymentType: 'CASH',
                            clientUID: this.reservation.clientUID,
                            transactionType: 'WALK-IN',
                            clientEmail: this.reservation.clientEmail,
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
                                this.payment = false
                                this.enterAmount = 0
                            })  
                        })
                    })
        },
      payamount(){
            this.enterAmount = this.currentBalance
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
     }
  }
}
</script>
