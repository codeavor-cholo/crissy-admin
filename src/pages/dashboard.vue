<template>
    <q-page class="q-pa-xl">
    <div class="row items-start q-gutter-md">
        <q-card bordered class="my-card bg-orange-8 text-white col">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="assignment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Reservations</q-item-label>
                        <q-item-label lines="2" class="text-h6">100</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 
                <q-btn color="white" label="view reservations" flat @click="onClick" />
            </q-card-section>
        </q-card>
        
        <q-card bordered class="my-card bg-orange-8 text-white col">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="payment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Payments</q-item-label>
                        <q-item-label lines="2" class="text-h6">P100,000</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 
                <q-btn color="white" label="view payments" flat @click="onClick" />
            </q-card-section>
        </q-card>

        <q-card bordered class="my-card bg-orange-8 text-white col">
            <div class="q-pa-md row items-start q-gutter-md">
                <q-item>
                    <q-item-section top avatar>
                        <q-avatar color="white" text-color="orange-8" icon="assignment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Ongoing</q-item-label>
                        <q-item-label lines="2" class="text-h6">4</q-item-label>
                    </q-item-section>
                </q-item>
            </div>
            <q-separator inset />
            <q-card-section class="text-center q-py-sm"> 
                <q-btn color="white" label="view reservations" flat @click="onClick" />
            </q-card-section>
        </q-card>

        <q-card bordered class="my-card bg-orange-8 text-white col">
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
                <q-btn color="white" label="view reservations" flat @click="onClick" />
            </q-card-section>
        </q-card>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
        <!-- <q-card bordered class="my-card">
            <q-card-section>
                <apexcharts width="450" type="line" :options="options" :series="series"></apexcharts>
            </q-card-section>
        </q-card>
        <q-card bordered class="my-card">
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
            dseries: [44, 55, 41, 17, 15]
        }
    },
}
</script>