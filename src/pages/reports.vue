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
                <div class="text-h6 q-mb-md">Report Type</div>
                <q-btn-toggle
                    v-model="type"
                    toggle-color="deep-orange-8"
                    :options="[
                    {label: 'Daily', value: 'day'},
                    {label: 'Monthly', value: 'month'},
                    {label: 'Yearly', value: 'year'}
                    ]"
                    @input="changeLabel"
                />    
                <div class="text-h6 q-my-md">Filter Options</div>        
            </div>
            </q-scroll-area>
        </q-drawer>


        <div class="row justify-between q-pt-md">
            <div class="q-pl-md text-h6">
                {{returnType}} Sales Reports
            </div>
            <div class="q-pr-md row justify-between">
                <q-btn color="deep-orange-8" @click="dialog = true" icon="print" class="q-mr-md"/>
                <q-input dense v-model="filter" clearable type="text" label="Search Records" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
                <q-btn-toggle
                    class="q-ml-md"
                    v-model="type"
                    toggle-color="deep-orange-8"
                    :options="[
                    {label: 'Daily', value: 'day'},
                    {label: 'Monthly', value: 'month'},
                    {label: 'Yearly', value: 'year'}
                    ]"
                    @input="changeLabel"
                />    
                <!-- <q-btn class="q-ml-md" color="deep-orange-8" outline="" icon="filter_list" label="filter options" @click="drawerRight = !drawerRight" /> -->
            </div>
        </div>
        <div class="q-pt-md">
        <q-table hide-bottom=""  flat :data="returnReports" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
            <template v-slot:body="props">
                <q-tr :props="props">
                <q-td key="date" :props="props">
                    {{type == 'day' ? $moment(props.row.date).format('LL') : props.row.date }}
                </q-td>
                <q-td key="totalSales" :props="props" class="text-overline text-grey-10">
                   ₱ {{ formatNumber(props.row.totalSales) }}.00
                </q-td>
                </q-tr>
            </template>
            <template v-slot:header="props">
            <q-tr :props="props">
            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                v-show="col.name !== 'basis'"
            >
                {{ col.label }}
            </q-th>
            </q-tr>
      </template>
        </q-table>
        <q-card class="my-card q-mt-md" flat>
            <q-card-section class="row justify-between">
                <div class="text-h6">Total Sales</div>
                <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnTotalSales) }}.00</b></div>
            </q-card-section>
        </q-card>
        </div>
        <!-- Print -->
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
                <q-table hide-bottom="" flat dense :data="returnReports" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                        <q-td key="date" :props="props">
                            {{type == 'day' ? $moment(props.row.date).format('LL') : props.row.date }}
                        </q-td>
                        <q-td key="totalSales" :props="props" class="text-overline text-grey-10">
                        ₱ {{ formatNumber(props.row.totalSales) }}.00
                        </q-td>
                        </q-tr>
                    </template>
                    <template v-slot:header="props">
                    <q-tr :props="props">
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        v-show="col.name !== 'basis'"
                    >
                        {{ col.label }}
                    </q-th>
                    </q-tr>
                    </template>
                </q-table>
                <q-card class="my-card q-mt-md" flat>
                    <q-card-section class="row justify-between">
                        <div class="text-h6">Total Sales</div>
                        <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnTotalSales) }}.00</b></div>
                    </q-card-section>
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
            })
    },
    data () {
        return {
            dialog: false,
            maximizedToggle: true,
            type: 'day',
            drawerRight: false,
            Payments: [],
            filter: '',
            visibleColumns: [ 'date', 'totalSales' ],
            columns: [
                    { name: 'date', required: true, label: 'Date', align: 'left', field: 'date', sortable: true },
                    { name: 'basis', label: 'basis', align: 'left', field: 'basis', sortable: true},
                    { name: 'totalSales', required: true, label: 'Total Sales', align: 'right', field: 'totalSales', sortable: true },
            ],
            pagination: {
                sortBy: 'date',
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
                let group = this.$lodash.groupBy(this.Payments,'clientPaymentDate')
                console.log(group,'group')

                let map = this.$lodash.map(group,function(value,key){
                    return {
                        date: key,
                        paymentArray: value,
                    }
                })

                for(var x = 0; x < map.length; x++){
                    let sum = this.$lodash.sumBy(map[x].paymentArray, a=>{
                        return parseInt(a.clientPayDetails.amount)
                    })
                    map[x].totalSales = sum
                }

                console.log(map,'map')
                if(this.type == 'day'){
                    let reMap = map.map(a=>{
                        a.basis = this.$moment(a.date).format('LL')
                        return a
                    })
                    console.log(reMap,'reMap')
                    reports = reMap
                } else if (this.type == 'month'){
                    let map2 = this.$lodash.map(map,a=>{
                        let date = this.$moment(a.date).format('LL')
                        let orderBase = this.$moment(a.date).format('YYYYM')
                        let string = date.split(' ')
                        a.basis = orderBase
                        a.month = string[0] + ' ' + string[2]
                        return a
                    })
                    console.log(map2,'map2')

                    let group2 = this.$lodash.groupBy(map2,'month')
                    console.log(group2,'group2')

                    reports = this.returnSales(group2)
                } else if (this.type == 'year'){
                    let map3 = this.$lodash.map(map,a=>{
                        let date = this.$moment(a.date).format('LL')
                        let string = date.split(' ')
                        a.year = string[2]
                        return a
                    })
                    console.log(map3,'year')

                    let group3 = this.$lodash.groupBy(map3,'year')
                    console.log(group3,'group3') 
                    
                    reports = this.returnSales(group3)

                } else {
                    reports = []
                }
                return reports 

            } catch (error) {
                return []
            }

        },
        returnTotalSales(){
            try {
                return this.$lodash.sumBy(this.returnReports,'totalSales')
            } catch (error) {
                return 0
            }
        },
        returnType(){
            try {
                let type = this.type
                if(type == 'day'){
                    return 'Daily'
                } else if (type == 'month'){
                    return 'Monthly'
                } else {
                    return 'Yearly'
                }
            } catch (error) {
                return 'Daily'
            }
        },
    },
    methods: {
        printNow(){
            window.print();
        },
        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        },
        changeLabel(type){
                if(type == 'day'){
                    this.columns[0].label = 'Date'
                    this.pagination.sortBy = 'date'
                } else if (type == 'month'){
                    this.columns[0].label = 'Month'
                    this.pagination.sortBy = 'basis'
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
                map3[y].basis = map3[y].dataArray[0].basis
            }
            console.log(map3,'map3')
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