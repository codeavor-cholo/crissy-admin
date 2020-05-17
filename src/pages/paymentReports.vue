<template>
    <q-page padding>
        <q-drawer
            side="right"
            v-model="drawerRight"
            :width="350"
            :breakpoint="700"
            content-class="bg-white text-grey-8"
        >
            <q-scroll-area class="fit">
            <div class="q-pa-md">
                <div class="text-h6 q-mb-md">Filter Options</div>    
                <q-select v-model="type" :options="['All','Fully Paid','Due Payments','W/ Balance']" label="Filter Results" filled color="deep-orange-8" @input="change"/>
                    
            </div>
            </q-scroll-area>
        </q-drawer>


        <div class="row justify-between q-pt-md">
            <div class="q-pl-md text-h6">
                {{returnType}} Reports
            </div>
            <div class="q-pr-md row justify-between">
                <q-btn color="deep-orange-8" icon="print" @click="dialog = true" class="q-mr-md"/>
                <q-input dense v-model="filter" clearable type="text" label="Search Records" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
 
                <q-btn class="q-ml-md" color="deep-orange-8" outline="" icon="filter_list" label="filter options" @click="drawerRight = !drawerRight" />
            </div>
        </div>
        <div class="q-pt-md">
        <q-table hide-bottom="" dense flat :data="returnReports" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
            <template v-slot:body="props">
                <q-tr :props="props" @click="props.expand = !props.expand" class="cursor-pointer">
                    <q-td key="id" :props="props" class="text-overline text-grey-10">
                        {{props.row.id}}
                    </q-td>
                    <q-td key="clientReserveDate" :props="props">
                        {{$moment(props.row.clientReserveDate).format('LL')}}
                    </q-td>
                    <q-td key="clientName" :props="props" class="text-capitalize">
                        {{props.row.clientName}}
                    </q-td>
                    <q-td key="toPayAmount" :props="props"  class="text-overline text-grey-10">
                        <b>₱ {{ formatNumber(props.row.toPayAmount)}}.00</b>
                    </q-td>
                    <q-td key="totalPaid" :props="props"  class="text-overline text-grey-10">
                        ₱ {{ formatNumber(props.row.totalPaid)}}.00
                    </q-td>
                    <q-td key="balance" :props="props" :class="props.row.balance !== 0 ? 'text-deep-orange-8' : 'text-grey-10'"  class="text-overline">
                        <b>₱ {{ formatNumber(props.row.balance)}}.00</b>
                    </q-td>
                    <q-td key="status" :props="props">
                        <q-chip :color="returnColor(props.row.status)" :label="props.row.status" text-color="white"/>
                    </q-td>                                                            
                </q-tr>
                <q-tr v-show="props.expand" :props="props" class="bg-grey-4 cursor-pointer">
                <q-td colspan="100%">
                    <div class="row justify-between text-overline" v-for="(pay,i) in props.row.allPayments" :key="pay['.key']">
                        <div class="q-ml-xl text-uppercase">PAYMENT #{{i+1}} : {{pay['.key'].substr(10)}}</div>
                        <div>TRANSACTION DATE: {{$moment(pay.clientPaymentDate).format('LL')}}</div>
                        <div>TRANSACTION TYPE: {{pay.clientPaymentType}}</div>
                        <div class="q-mr-xl">PAID AMOUNT: ₱ {{formatNumber(pay.clientPayDetails.amount)}}.00</div>
                    </div>

                </q-td>
                </q-tr>
            </template>
        </q-table>
        <q-card class="my-card q-mt-md" flat>
            <q-card-section class="row justify-between">
                <div class="text-h6">Total Expected Revenue</div>
                <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnToPay) }}.00</b></div>
            </q-card-section>
            
            <q-card-section class="row justify-between">
                <div class="text-h6">Total Paid Amount</div>
                <div class="text-h6 text-teal"><b> - ₱ {{ formatNumber(returnTotalPaid) }}.00</b></div>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
                <div class="text-h6">Unpaid Balances</div>
                <div class="text-h6 text-amber"><b>₱ {{ formatNumber(returnToPay - returnTotalPaid) }}.00</b></div>
            </q-card-section>

        </q-card>
        <q-card class="my-card q-mt-md" flat>

        </q-card>
        </div>
        <q-dialog
        v-model="dialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-right"
        transition-hide="slide-left"
        >
        <q-card class="shadow-0">
            <q-bar>
            <q-space />
            <q-btn dense flat icon="close" class="bodyText" v-close-popup>
                <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
            </q-bar>

            <q-card-section>
                <div class="row flex flex-center">
                    <q-img src="statics/logo.png" :ratio="1" style="width:3.5em;" class="q-ml-sm"/>
                    <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
                        <strong>Crissy's Meal Magic Catering Services</strong>
                    </q-toolbar-title>
                </div>
            </q-card-section>
                
            <q-card-section class="q-pt-none">
                <div class="q-pt-md">
                <q-table hide-bottom="" dense flat :data="returnReports" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="full-width align-center ">
                    <template v-slot:body="props">
                        <q-tr :props="props" @click="props.expand = !props.expand" class="cursor-pointer">
                            <q-td key="id" :props="props" class="text-overline text-grey-10">
                                {{props.row.id}}
                            </q-td>
                            <q-td key="clientReserveDate" :props="props">
                                {{$moment(props.row.clientReserveDate).format('LL')}}
                            </q-td>
                            <q-td key="clientName" :props="props" class="text-capitalize">
                                {{props.row.clientName}}
                            </q-td>
                            <q-td key="toPayAmount" :props="props"  class="text-overline text-grey-10">
                                <b>₱ {{ formatNumber(props.row.toPayAmount)}}.00</b>
                            </q-td>
                            <q-td key="totalPaid" :props="props"  class="text-overline text-grey-10">
                                ₱ {{ formatNumber(props.row.totalPaid)}}.00
                            </q-td>
                            <q-td key="balance" :props="props" :class="props.row.balance !== 0 ? 'text-deep-orange-8' : 'text-grey-10'"  class="text-overline">
                                <b>₱ {{ formatNumber(props.row.balance)}}.00</b>
                            </q-td>
                            <q-td key="status" :props="props">
                                <q-chip :color="returnColor(props.row.status)" :label="props.row.status" text-color="white"/>
                            </q-td>                                                            
                        </q-tr>
                        <q-tr v-show="props.expand" :props="props" class="bg-grey-4 cursor-pointer">
                        <q-td colspan="100%">
                            <div class="row justify-between text-overline" v-for="(pay,i) in props.row.allPayments" :key="pay['.key']">
                                <div class="q-ml-xl text-uppercase">PAYMENT #{{i+1}} : {{pay['.key'].substr(10)}}</div>
                                <div>TRANSACTION DATE: {{$moment(pay.clientPaymentDate).format('LL')}}</div>
                                <div>TRANSACTION TYPE: {{pay.clientPaymentType}}</div>
                                <div class="q-mr-xl">PAID AMOUNT: ₱ {{formatNumber(pay.clientPayDetails.amount)}}.00</div>
                            </div>

                        </q-td>
                        </q-tr>
                    </template>
                </q-table>
                <q-card class="my-card q-mt-md" flat>
                    <q-card-section class="row justify-between">
                        <div class="text-h6">Total Expected Revenue</div>
                        <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnToPay) }}.00</b></div>
                    </q-card-section>
                    
                    <q-card-section class="row justify-between">
                        <div class="text-h6">Total Paid Amount</div>
                        <div class="text-h6 text-teal"><b> - ₱ {{ formatNumber(returnTotalPaid) }}.00</b></div>
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section class="row justify-between">
                        <div class="text-h6">Unpaid Balances</div>
                        <div class="text-h6 text-amber"><b>₱ {{ formatNumber(returnToPay - returnTotalPaid) }}.00</b></div>
                    </q-card-section>

                </q-card>
                <q-card class="my-card q-mt-md" flat>

                </q-card>
                </div>
                <div class="col q-pa-md">
                    <div class="text-h6">Prepared By:</div>
                    <br>
                    <div style="margin-top: -20px" class="q-pl-xl q-ml-xl text-h6">{{userEmail.toUpperCase()}}</div>
                </div>
                <div class="row flex flex-center">
                    <q-page-sticky position="bottom" :offset="[18, 18]">
                        <q-btn class="bodyText" label="Print" color="deep-orange-8" @click="printNow" icon="print" />
                    </q-page-sticky>
                </div>
            </q-card-section>
        </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    created() {
        let self = this
        this.$firebase.auth().onAuthStateChanged(function(user) {
            
            if (user) {
            let gg = {...user}
            console.log('createdUser',user)
            console.log('createdUser',user.uid)
            let username = gg.email.toString().split('@')
            self.userEmail = username[0]
            self.accountLoggedIn = gg

            } else {
                self.$router.push('/')
            }
        })
    },
    mounted () {
        this.$binding('Payments', this.$firestoreApp.collection('Payments'))
            .then(Payments => {
            console.log(Payments, 'Payments')
            }),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            })
    },
    data () {
        return {
            dialog: false,
            maximizedToggle: true,
            type: 'All',
            drawerRight: false,
            Payments: [],
            Reservation: [],
            filter: '',
            columns: [
                    { name: 'id', required: true, label: 'Reservation ID', align: 'left', field: 'id', sortable: true },
                    { name: 'clientReserveDate', required: true, label: 'Client Reserved Date', align: 'left', field: 'clientReserveDate', sortable: true },
                    { name: 'clientName', required: true, label: 'Client Name', align: 'left', field: 'clientName', sortable: true },
                    { name: 'toPayAmount', required: true, label: 'To Pay', align: 'right', field: 'toPayAmount', sortable: true },
                    { name: 'totalPaid', required: true, label: 'Total Paid', align: 'right', field: 'totalPaid', sortable: true },
                    { name: 'balance', required: true, label: 'Balance', align: 'right', field: 'balance', sortable: true },
                    { name: 'status', required: true, label: 'Status', align: 'right', field: 'status', sortable: true },
            ],
            pagination: {
                sortBy: 'clientReserveDate',
                descending: false,
                page: 1,
                rowsPerPage: 0,
            },
        }
    },
    computed:{
        returnReports(){
            try {
                let reports = []
                let loop = this.Reservation.map(a=>{
                    let payments = []
                    for(var x = 0; x < this.Payments.length; x++){
                        if(a['.key'] == this.Payments[x].clientReservationKey){
                            payments.push(this.Payments[x])
                        }
                    }
                    a.clientReserveDate = date.formatDate(a.clientReserveDate,'YYYY-MM-DD')
                    a.id = a['.key'].substr(8).toUpperCase()
                    a.clientName = a.clientFName+' '+a.clientLName
                    a.totalPaid = this.$lodash.sumBy(payments, a=>{
                        return parseInt(a.clientPayDetails.amount)})
                    a.toPayAmount = a.clientTotalPayment
                    a.balance = a.clientTotalPayment - a.totalPaid
                    a.allPayments = payments
                    a.status = this.returnStatus(a)

                    return a
                })

                console.log(loop,'loop')

                let type = this.type
                if(type == 'Fully Paid'){
                    return loop.filter(a=>{return a.status == 'FULLY PAID'})
                } else if(type == 'W/ Balance'){
                    return loop.filter(a=>{return a.status == 'W/ BALANCE'})
                } else if(type == 'All'){
                    return loop
                } else {
                    return loop.filter(a=>{return a.status == 'DUE DATE' || a.status == 'OVERDUE'})
                }



            } catch (error) {
                return []
            }

        },
        returnTotalPaid(){
            try {
                return this.$lodash.sumBy(this.returnReports,'totalPaid')
            } catch (error) {
                return 0
            }
        },
        returnToPay(){
            try {
                return this.$lodash.sumBy(this.returnReports,'toPayAmount')
            } catch (error) {
                return 0
            }
        },
        returnType(){
            try {
                let type = this.type
                if(type == 'All'){
                    return 'All Payments'
                } else if (type == 'W/ Balance'){
                    return 'With Balances'
                } else if (type == 'Fully Paid'){
                    return 'Fully Paid Payment'
                } else {
                    return 'Due Payment'
                }
            } catch (error) {
                return 'All Payments'
            }
        },
    },
    methods: {
        printNow(){
            window.print();
        },
        returnStatus(details){
            let status = ''
            let today = this.$moment(new Date()).format('L')
            let string1 = today.split('/')
            let dateBasis = this.$moment(details.clientReserveDate).format('L')
            let string = dateBasis.split('/')

            let newDateToday = new Date(string1[2], parseInt(string1[0]) - 1, string1[1]) 
            let newDateBasis = new Date(string[2], parseInt(string[0]) - 1, string[1]) 
            let diff = date.getDateDiff( newDateBasis, newDateToday, 'days')

            if(details.balance == 0){
                status = 'FULLY PAID'
            } else if(dateBasis < today){
                status = 'OVERDUE' 
            } else if(diff <= 14){
                status = 'DUE DATE'                 
            } else {
                status = 'W/ BALANCE'
            }
            return status
        },
        returnColor(status){
            if(status == 'FULLY PAID'){
                return 'teal'
            } else if (status == 'W/ BALANCE') {
                return 'blue-10'
            } else if ( status == 'DUE DATE'){
                return 'warning'
            } else {
                return 'red'
            }
        },
        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        },
        changeLabel(type){
                if(type == 'day'){
                    this.columns[0].label = 'Date'
                } else if (type == 'month'){
                    this.columns[0].label = 'Month'
                } else {
                    this.columns[0].label = 'Year'
                }            
        },
        returnSales(group){
            let map3 = this.$lodash.map(group,function(value,key){
                // console.log(data,'data')
                return {
                    date: key,
                    dataArray: value
                }
            })

            for(var y = 0; y < map3.length; y++){
                let sum = this.$lodash.sumBy(map3[y].dataArray, a=>{
                    return a.totalSales
                })
                map3[y].totalSales = sum
            }

            return map3
        }

    }
}
</script>
<style type = "text/css">
      @media print {
        .bodyText {
            display: none;
          }
        ::-webkit-scrollbar {
            display: none;
        }
      }
</style>