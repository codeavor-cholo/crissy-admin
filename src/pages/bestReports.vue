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
                <q-btn color="deep-orange-8" icon="print" class="q-mr-md"/>
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
        <q-table hide-bottom=""  flat :data="returnPopular" :binary-state-sort="true" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
        </q-table>
        <!-- <q-card class="my-card q-mt-md" flat>
            <q-card-section class="row justify-between">
                <div class="text-h6">Total Sales</div>
                <div class="text-h6 text-deep-orange-8"><b>₱ {{ formatNumber(returnTotalSales) }}.00</b></div>
            </q-card-section>
        </q-card> -->
        </div>

    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            })
    },
    data () {
        return {
            type: 'packages',
            drawerRight: false,
            Reservation: [],
            filter: '',
            visibleColumns: [ 'date', 'totalSales' ],
            columns: [
                    { name: 'rank', required: true, label: 'Rank', align: 'left', field: 'rank', sortable: true },
                    { name: 'name', required: true, label: 'Name', align: 'left', field: 'name', sortable: true},
                    { name: 'total count', required: true, label: 'Total Count', align: 'right', field: 'total count', sortable: true },
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
                return []
            } catch (error) {
                return []
            }
        }
    },
    methods: {
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