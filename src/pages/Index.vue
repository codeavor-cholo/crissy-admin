<template>
    <q-page class="flex flex-center">
        <template>  
            <q-splitter v-model="splitterModel" style="height: 92vh; width: 100%;" :limits="[18, 18]">  
                <template v-slot:before>
                <q-tabs v-model="tab" vertical class="text-grey-8 bg-grey-9 full-height relative-position" :active-color="tab != 'WOPP' ? 'white' : 'teal'" :active-bg-color="tab != 'WOPP' ? 'deep-orange-4' : 'teal-1'">
                    <div class="bg-grey-9 fit">
                        <div class="text-h6 text-center text-white q-py-md">FILTER OPTIONS</div>
                        <q-input v-model="filter" clearable type="text" label="Search Reservation" color="deep-orange-4" class="q-ma-md bg-white" outlined icon="search">
                            <template v-slot:prepend>
                                <q-icon name="search" color="deep-orange-4"/>
                            </template>
                        </q-input>
                    </div>
                    <q-tab name="reservation" style="font-family: 'Roboto Slab', serif;"   class="bg-grey-9 text-white" label="Reservation"></q-tab>
                </q-tabs>
                </template>    
                <template v-slot:after>   
                <q-btn label="ADD NEW RESERVATION" :to="{ name: 'walkinreserve' }" class="bg-deep-orange-4 q-my-md q-ml-md text-white">
                    <q-tooltip>
                                        Add New Reservation
                    </q-tooltip>
                </q-btn>
                    <div class="q-mx-lg" >
                        <q-table grid :data="Reservation" :columns="columns" :filter="filter">
                            <template v-slot:item="props">
                                <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card flat class="my-card" style="border: 2px solid;border-color: #ffdab9" >
                                        <q-card-section side>
                                            <q-list dense>
                                            <q-item>
                                            <div class="full-width text-center text-grey-8 text-h6">
                                                <strong><q-chip class="text-weight-bold" color="deep-orange-3" style="font-size:25px;font-family: 'Simonetta', serif;">{{props.row.clientEvent}}</q-chip></strong>
                                            </div>
                                            <!-- <strong class="row full-width text-center text-grey-8 text-h6 text-weight-bold">{{props.row.clientFName}} {{props.row.clientLName}}'s<q-chip class="text-weight-bold text-h6">{{props.row.clientEvent}}</q-chip></strong>
                                            <q-strong class="text-center text-grey">{{props.row.clientReserveDate}}</q-strong>     -->
                                            </q-item>
                                         
                                            <div class="text-grey-8 column q-gutter-sm">
                                                <div><strong class="q-pb-none q-mb-none text-h6" style="font-family: 'Roboto Slab', serif;">Name: {{props.row.clientFName}} {{props.row.clientLName}}</strong></div>
                                                <div><p class="q-pt-none q-mt-none q-pb-none q-mb-none" style="font-family: 'Roboto Slab', serif;"><b>Date of Event:</b> {{props.row.clientReserveDate}}</p></div>
                                                <div class="row justify-between">
                                                    <p class="q-pt-none q-mt-none q-pb-none q-mb-none" style="font-family: 'Roboto Slab', serif;"><b>From:</b> {{props.row.clientStartTime}}</p>
                                                    <p class="q-pt-none q-mt-none q-pb-none q-mb-none q-pr-xl" style="font-family: 'Roboto Slab', serif;"><b>To:</b> {{props.row.clientEndTime}}</p>
                                                </div>
                                                <div><p class="q-pt-none q-mt-none q-pb-none q-mb-none" style="font-family: 'Roboto Slab', serif;"><b>Where:</b> {{props.row.clientPlace}} {{props.row.clientCity}}</p></div>
                                                <div><p class="q-pt-none q-mt-none q-pb-none q-mb-none" style="font-family: 'Roboto Slab', serif;"><b>Motif:</b> {{props.row.clientMotif}}</p></div>
                                                <div><p class="q-pt-none q-mt-none q-pb-none q-mb-none" style="font-family: 'Roboto Slab', serif;"><b>Guest:</b> {{props.row.clientPax}}</p></div>
                                                <div><p class="q-pt-none q-mt-none q-pb-none q-mb-none" style="font-family: 'Roboto Slab', serif;"><b>Email:</b> {{props.row.clientEmail}}</p></div>
                                                <div><p class="q-pt-none q-mt-none"></p></div>
                                            </div>
                                            
                                            <q-separator/>
                                            <q-slide-transition>
                                                <div v-show="expanded">
                                                <q-separator />
                                                  <q-list dense>
                                                    <q-item class="q-mt-sm text-grey-8" v-show="props.row.clientFoodChoice">
                                                        <span class="full-width text-center text-weight-bold" style="font-family: 'Roboto Slab', serif;">FOOD CATEGORIES</span>
                                                        </q-item>
                                                        <q-item v-for="(i, index) in props.row.clientFoodChoice" :key="index" class="text-grey-8">
                                                            <q-item-section>
                                                            <q-item-label><b>{{ i.category }}</b> - {{i.foodName}}</q-item-label>
                                                            </q-item-section>
                                                        </q-item>
                                                        <q-separator class="q-mt-sm"/>
                                                        <q-item class="q-mt-sm" v-show="props.row.clientSelectPackage.inclusions">
                                                        <span class="full-width text-center text-weight-bold text-grey-8" style="font-family: 'Roboto Slab', serif;">INCLUSIONS</span>
                                                        </q-item>
                                                        <q-item v-for="(price, index) in props.row.clientSelectPackage.inclusions" :key="index" class="text-grey-8">
                                                            <q-item-section>
                                                            <q-item-label> {{ price.inclusion }}</q-item-label>
                                                            </q-item-section>
                                                        </q-item>
                                                        <q-separator class="q-mt-sm"/>
                                                        <q-item class="q-mt-sm" v-show="props.row.clientAddOns.lenght != 0">
                                                        <span class="full-width text-center text-weight-bold text-grey-8" style="font-family: 'Roboto Slab', serif;">ADD-ONS</span>
                                                        </q-item>
                                                        <q-item v-for="(price, index) in props.row.clientAddOns" :key="index" class="text-grey-8">
                                                            <q-item-section>
                                                            <q-item-label>{{ price.addonsQuantities }} {{ price.addonsNames }}</q-item-label>
                                                            </q-item-section>
                                                    </q-item>
                                                  </q-list>
                                                </div>
                                            </q-slide-transition>
                                        </q-list>
                                        </q-card-section>
                                        <!-- color="expanded ? 'grey-8':'pink-3' " -->
                                        <q-card-actions>
                                            <q-btn color="deep-orange-4" @click="paybalance(props.row)" label="Pay Balance" flat dense icon="mdi-paypal" />
                                            <q-space />
                                            <q-btn :color="expanded ? 'grey-8':'deep-orange-4'" :label="expanded ? 'Hide Details' : 'View Details'" flat dense :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" @click="expandeds(props.row)" />
                                        </q-card-actions>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
                    </div>
                </template>
                </q-splitter>
                <q-dialog v-model="paymentDialog">
                    <q-card style="min-width: 1000px">
                        <q-card-section class="items-center">
                            <q-select class="q-pa-md" color="deep-orange-4" dense outlined v-model="selectPay" :options="payoptions" emit-value map-options label="Select Payment" />
                                <q-list bordered dense>
                                    <q-item class="q-mt-none q-pt-none">
                                        <q-item-section class="q-ml-lg"><strong><div>Total Payment:</div></strong></q-item-section>
                                        <q-item-section class="q-mr-lg" side><strong>{{totalclientPayment}}php</strong></q-item-section>
                                    </q-item>
                                    <q-separator/>
                                    <q-item class="q-mt-none q-pt-none">
                                        <q-item-section class="q-ml-lg"><strong><div>Total Paid Amount:</div></strong></q-item-section>
                                        <q-item-section class="q-mr-lg" side><strong>{{clientPaidAmounts}}php</strong></q-item-section>
                                    </q-item>
                                    <q-separator/>
                                    <q-item class="q-mt-none q-pt-none">
                                        <q-item-section class="q-ml-lg"><strong><div>Total Balance:</div></strong></q-item-section>
                                        <q-item-section class="q-mr-lg" side><strong>{{clientBalance}}php</strong></q-item-section>
                                    </q-item>
                                </q-list>
                                <div v-show="this.selectPay === 'CASH'">
                                    <q-list dense>
                                        <q-item>
                                            <q-item-section class="q-ml-lg"><strong><q-radio v-model="paymentMode" val="clientBalance" label="Full Balance" /></strong></q-item-section>
                                            <q-item-section class="q-mr-lg" side><strong>{{clientBalance}}php</strong></q-item-section>
                                        </q-item>
                                        <q-item>
                                            <q-item-section class="q-ml-lg"><strong><b>Enter Amount to Pay:</b></strong></q-item-section>
                                            <q-item-section class="q-mr-lg" side><q-input type="number" style="width: 500px" color="deep-orange-4" outlined dense v-model="enterAmount" label="Enter Amount To Pay"/></q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                                <div v-show="this.selectPay == 'CARD'">
                                    <div>
                                        <q-list dense>
                                          <q-item>
                                              <q-item-section class="q-ml-lg">
                                              <strong>
                                                <!-- <q-checkbox @input="paymentSelect" color="pink-3" v-model="fullPayment" label="Total Payment" /> -->
                                              <q-radio v-model="paymentMode" val="clientBalance" label="Total Balance" />
                                              </strong>
                                              </q-item-section>
                                              <q-item-section class="q-mr-lg" side><strong>{{clientBalance}}php</strong></q-item-section>
                                          </q-item>
                                      </q-list>
                                    </div>
                                    <div class="container row q-mx-md">
                                      <stripe-elements ref="elementsRef" :pk="publishableKey" :amount="amount" @token="tokenCreated" @loading="loading = $event" outline class="col-8 q-mr-md">
                                      </stripe-elements>
                                      <!-- <button @click="submit">Pay ${{amount / 100}}</button> -->
                                    </div>
                              </div>
                        </q-card-section>

                        <q-card-actions align="right">
                        <q-btn v-show="this.selectPay == 'CASH'" label="Pay" color="teal" v-close-popup />
                        <q-btn icon="mdi-paypal" v-show="this.selectPay == 'CARD'" outlined color="teal" size="md" @click="submit">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{amount}}</b></q-btn>
                        <q-btn label="Cancel" flat dense v-close-popup/>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
        </template>
    </q-page>
</template>
<script>
import { StripeElements } from 'vue-stripe-checkout';
// import moment from 'moment'
        export default {
        components: {
            StripeElements
        },    
        data(){
        return {
            amount: 0,
            publishableKey: 'pk_test_kUO5j8FaZUKitD1Qh3ibZ2HP00YkxaEOOS', 
            token: null,
            charge: null,
            enterAmount: 0,
            paymentDialog: false,
            paymentMode: 'clientBalance',
            clientBalance: false,
            client25balance: false,
            selectPay: '',
            payoptions: [
                {label: 'CASH', value: 'CASH'},
                {label: 'CARD', value: 'CARD'},
            ],
            tab: 'reservation',
            expanded: false,    
            showCompleteBanner: false,
            checkerArray: [],
            filter: '',
            splitterModel: 20,
            Inclusion: [],
            Packages: [],
            viandsArray:[],
            Reservation: [],
            viandsQty: [],
            selection: [],
            selectedInclusions: [],
            hidelabel: true,
            packagePrice: 0,
            Food: [],
            packageName: '',
            addPackageDialog: false,
            FoodCategory: [],
            clientBalance: 0,
            client25Balance: 0,
            filter: '',
            pagination: { sortBy: 'clientReserveDate', descending: false, page: 1, rowsPerPage: 10},
            columns: [
                { name: 'clientFName', required: true, label: 'First Name', align: 'center', field: 'clientFName', sortable: true },
                { name: 'clientLName', align: 'center', label: 'Last Name', field: 'clientLName', sortable: true },
            ]
        }
    },
    mounted () {
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            }),
        this.$binding('FoodCategory', this.$firestoreApp.collection('FoodCategory'))
            .then(FoodCategory => {
            console.log(FoodCategory, 'FoodCategory')
            }),
        this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            console.log(Food, 'Food')
            }),
        this.$binding('Packages', this.$firestoreApp.collection('Packages'))
            .then(Packages => {
            console.log(Packages, 'Packages')
            })
            ,
        this.$binding('Inclusion', this.$firestoreApp.collection('Inclusion'))
            .then(Inclusion => {
            console.log(Inclusion, 'Inclusion')
            })
    },
    computed: {
        // toPayAmount(){
        //     if(this.paymentMode == 'clientBalance'){
        //         this.enterAmount = this.clientBalance
        //         this.amount = this.clientBalance
        //         return this.clientBalance
        //     }if(this.paymentMode == 'client25Balance') {
        //         this.enterAmount = this.client25balance
        //         this.amount = this.client25balance     
        //         return this.client25balance  
        //     }
        // }
    },
    methods:{
        expandeds(props){
            this.expanded = !this.expanded
        },
        paybalance(props){
            this.reserveId = props['.key']
            this.paymentDialog = true
            this.totalclientPayment = props.clientTotalPayment
            this.clientPaidAmounts = props.clientPaidAmount
            this.clientBalance = parseInt(props.clientTotalPayment) - parseInt(props.clientPaidAmount)
            this.client25balance = parseInt(props.clientTotalPayment) * 0.25
            this.enterAmount = this.clientBalance
            this.amount = this.clientBalance
        },
        //PAY
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
                color: 'pink-6',
                textColor: 'grey',
                icon: 'negative',
                ok: 'Ok'
            })
        }else{
            this.paydetails = charge
        }
        }

  
    }
}
</script>