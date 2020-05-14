<template>
    <q-page class="q-pa-xl">
    <div class="row items-start q-gutter-md">
        <q-card bordered class="my-card bg-orange-8 text-white col-sm-12 col-md-auto">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="assignment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Upcoming Events</q-item-label>
                        <q-item-label lines="2" class="text-h6">{{returnNumberOfUpcomingEvents.length}} Events</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 

                <q-btn color="white" label="view reservations" flat @click="$router.push('/reservation')" />
            </q-card-section>
        </q-card>
        


        <q-card bordered class="my-card bg-orange-8 text-white col-sm-12 col-md-auto">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="event" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Unscheduled Events</q-item-label>
                        <q-item-label lines="2" class="text-h6">{{returnNumberOfUnscheduledEvents}} Events</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 
                <q-btn color="white" label="view events" flat @click="$router.push('/staffscheduling')"/>
            </q-card-section>
        </q-card>

        <q-card bordered class="my-card bg-orange-8 text-white col-sm-12 col-md-auto">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="payment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>All Payments of {{$moment().format('MMM')}} </q-item-label>
                        <q-item-label lines="2" class="text-h6">₱ {{formatNumber(returnSumOfConfirmedPayments)}}.00</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 
                <q-btn color="white" label="view payments" flat @click="$router.push('/paymentReports')"/>
            </q-card-section>
        </q-card>

        <!-- <q-card bordered class="my-card bg-orange-8 text-white col-sm-12 col-md-auto">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="assignment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Cancelled</q-item-label>
                        <q-item-label lines="2" class="text-h6">100</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 
                <q-btn color="white" label="view reservations" flat />
            </q-card-section>
        </q-card> -->
    </div>
    <div class="">
        <q-card bordered class="my-card" flat>
            <div class="row q-pt-lg">
                <div class="text-h6 q-mr-md"><span class="text-capitalize">{{type}}</span></div>
                <div><q-select v-model="type" :options="['daily sales','monthly sales','yearly sales']" outlined="" dense style="width:150px;"/></div>
            </div>
            
            <q-card-section>
                <apexcharts width="700" type="line" :options="returnOptions" :series="returnSeries"></apexcharts>
            </q-card-section>
        </q-card>
        <!-- <q-card bordered class="my-card">
            <q-card-section class="center" style="height: 327px; width: 420px">
                <apexcharts width="400" type="donut" :options="doptions" :series="dseries"></apexcharts>
            </q-card-section>
        </q-card> -->
    </div>
    </q-page>

</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import VueChart from 'vue-chart-js'
import { date } from 'quasar'
export default { 
    components:{
      VueChart,
      apexcharts: VueApexCharts,
    },  
    data () {
        return {
            type: 'daily sales',
            options: {
                chart: {
                id: 'vuechart-example'
                },
                xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                }
            },
            series: [{
                name: 'series-1',
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }],
            doptions: {},
            dseries: [44, 55, 41, 17, 15],
            Reservation: [],
            Payments: [],
            StaffSchedules: []
        }
    },
    mounted(){
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
        this.$binding('Payments', this.$firestoreApp.collection('Payments'))
        this.$binding('StaffSchedules', this.$firestoreApp.collection('StaffSchedules'))
    },
    computed:{
        returnNumberOfUpcomingEvents(){
            try {
                let today = date.formatDate(new Date(),'MM-DD-YYYY')
                return this.Reservation.filter(a=>{
                    return today <= date.formatDate(a.clientReserveDate,'MM-DD-YYYY')
                })
            } catch (error) {
                return 0
            }
        },
        returnNumberOfConfirmedPayments(){
            try {
                let today = date.formatDate(new Date(),'MM-DD-YYYY')
                let month = today.split('-')[0]

                let base = date.formatDate(new Date(2020,month-1,1),'MM-DD-YYYY')
                return this.Payments.filter(a=>{
                    return base <= date.formatDate(a.clientPaymentDate,'MM-DD-YYYY')
                })
            } catch (error) {
                return 0
            }
        },
        returnSumOfConfirmedPayments(){
            try {
                return this.$lodash.sumBy(this.returnNumberOfConfirmedPayments,a=>{
                    return parseInt(a.clientPayDetails.amount)
                })
            } catch (error) {
                return 0
            }
        },
        returnNumberOfUnscheduledEvents(){
            try {
                let count = 0
                this.returnNumberOfUpcomingEvents.forEach(a=>{
                    let filter = this.StaffSchedules.filter(b=>{
                        return b.reservationKey == a['.key']
                    })

                    if(filter.length == 0){
                        count = count + 1
                    }
                })
                return count
            } catch (error) {
                return 0
            }
        },
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
                if(this.type == 'daily sales'){
                    let reMap = map.map(a=>{
                        a.basis = this.$moment(a.date).format('LL')
                        return a
                    })
                    console.log(reMap,'reMap')
                    reports = reMap
                } else if (this.type == 'monthly sales'){
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
                } else if (this.type == 'yearly sales'){
                    let map3 = this.$lodash.map(map,a=>{
                        let date = this.$moment(a.date).format('LL')
                        let string = date.split(' ')
                        a.basis = string[2]
                        a.year = string[2]
                        return a
                    })
                    console.log(map3,'yearly sales')

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
        returnOptions(){
            try {
                let options= {
                    chart: {
                    id: 'vuechart-example'
                    },
                    xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                    }
                }

                let categ = []
                let order = this.$lodash.orderBy(this.returnReports,a=>{
                    return new Date(a.date)
                },'desc')
                console.log(order,'order')

                order.forEach(a=>{
                    categ.push(a.date)
                })

                if(this.type == 'yearly sales'){
                    categ.push('2019')
                }



                options.xaxis.categories = categ.slice(0,8)

                console.log(this.returnReports,'sales')
                return options
            } catch (error) {
                return []
            }
        },
        returnSeries(){
            try {
                let series = [{
                    name: this.type,
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                }]
                
                let data = []
                let order = this.$lodash.orderBy(this.returnReports,a=>{
                    return new Date(a.date)
                },'desc')
                console.log(order,'order')

                order.forEach(a=>{
                    data.push(a.totalSales)
                })        
                
                if(this.type == 'yearly sales'){
                    data.push(0)
                }
                
                series[0].data = data.slice(0,8)

                return series
            } catch (error) {
                return []
            }
        }
    },
    methods:{
        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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