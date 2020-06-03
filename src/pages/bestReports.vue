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
                Most Popular {{returnType}}
            </div>
            <div class="q-pr-md row justify-between">
                <q-btn color="deep-orange-8" icon="print" @click="dialog = true" class="q-mr-md"/>
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
                    {label: 'Packages', value: 'packages'},
                    {label: 'Food Choices', value: 'foods'},
                    ]"
                    @input="changeLabel"
                />    
                <!-- <q-btn class="q-ml-md" color="deep-orange-8" outline="" icon="filter_list" label="filter options" @click="drawerRight = !drawerRight" /> -->
            </div>
        </div>
        <div class="q-pt-md">
        <q-table hide-bottom="" flat :data="returnPopular" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
            <template v-slot:body="props">
                <q-tr :props="props">
                <q-td key="rank" :props="props" class="text-overline text-grey-10">
                    {{props.row.rank}}
                </q-td>
                <q-td key="name" :props="props" class="text-overline text-grey-10">
                   {{props.row.name}}
                </q-td>
                <q-td key="count" :props="props" class="text-overline text-grey-10">
                   {{props.row.count}}
                </q-td>
                </q-tr>
            </template>
        </q-table>
        <!-- <q-card class="my-card q-mt-md" flat>
            <q-card-section class="row justify-between">
                <div class="text-h6">Total Sales</div>
                <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnTotalSales) }}.00</b></div>
            </q-card-section>
        </q-card> -->
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
                <q-table hide-bottom="" dense flat :data="returnPopular" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                        <q-td key="rank" :props="props" class="text-overline text-grey-10">
                            {{props.row.rank}}
                        </q-td>
                        <q-td key="name" :props="props" class="text-overline text-grey-10">
                        {{props.row.name}}
                        </q-td>
                        <q-td key="count" :props="props" class="text-overline text-grey-10">
                        {{props.row.count}}
                        </q-td>
                        </q-tr>
                    </template>
                </q-table>
                <!-- <q-card class="my-card q-mt-md" flat>
                    <q-card-section class="row justify-between">
                        <div class="text-h6">Total Sales</div>
                        <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnTotalSales) }}.00</b></div>
                    </q-card-section>
                </q-card> -->
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
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            })
    },
    data () {
        return {
            dialog: false,
            maximizedToggle: true,
            type: 'packages',
            drawerRight: false,
            Reservation: [],
            filter: '',
            visibleColumns: [ 'date', 'totalSales' ],
            columns: [
                    { name: 'rank', required: true, label: 'Rank', align: 'left', field: 'rank', sortable: true },
                    { name: 'name', required: true, label: 'Package Name', align: 'left', field: 'name', sortable: true},
                    { name: 'count', required: true, label: 'Total Count', align: 'right', field: 'count', sortable: true },
            ],
            pagination: {
                sortBy: 'rank',
                descending: false,
                page: 1,
                rowsPerPage: 0,
            },
        }
    },
    computed:{
        returnType(){
            try {
                let type = this.type
                if(type == 'packages'){
                    return 'Packages'
                } else if (type == 'foods'){
                    return 'Food Choices'
                } else {
                    return ''
                }
            } catch (error) {
                return 'Packages'
            }
        },
        returnPopular(){
            try {
                let reports = []
                if(this.type == 'packages'){

                    let notCustom = []
                    let map = this.Reservation.map(b=>{
                        let base = b
                        if(base.clientSelectPackage !== 'CUSTOMIZE'){
                            notCustom.push({name: base.clientSelectPackage.name})
                        }
                    })
                    console.log(notCustom,'notCustom')
                    let group = this.$lodash.groupBy(notCustom,'name')
                    console.log(group,'group')
                    let mapping = this.$lodash.map(group,function(value,key){
                        return {
                            name: key,
                            array: value,
                            count: value.length
                        }
                    })
                    console.log(mapping,'mapping')
                    let order = this.$lodash.orderBy(mapping,'count','desc')
                    console.log(order,'order')
                    reports = this.returnRanking(order)
                } else {
                    let choices = []
                    let loop = this.Reservation.forEach(a=>{
                        for(var x = 0; x < a.clientFoodChoice.length; x++){
                            choices.push(a.clientFoodChoice[x])
                        }
                    })
                    console.log(choices,'choices')
                    let group2 = this.$lodash.groupBy(choices,'foodName')
                    console.log(group2,'group2')
                    let mapping2 = this.$lodash.map(group2,function(value,key){
                        return {
                            name: key,
                            array: value,
                            count: value.length
                        }
                    })
                    console.log(mapping2,'mapping2')
                    let order2 = this.$lodash.orderBy(mapping2,'count','desc')
                    console.log(order2,'order2')
                    reports = this.returnRanking(order2)
                }

                return reports
            } catch (error) {
                return []
            }
        }
    },
    methods: {
        printNow(){
            window.print();
        },
        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        },
        changeLabel(type){
                if(type == 'packages'){
                    this.columns[1].label = 'Package Name'
                } else if (type == 'foods'){
                    this.columns[1].label = 'Food Name'
                } else {
                    this.columns[1].label = 'Name'
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
        },
        returnRanking(order){
            for(var y = 0; y < order.length; y++){
                order[y].rank = y + 1
            }  
            return order          
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