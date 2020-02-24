<template>
    <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
        <q-card bordered class="my-card">
            <div class="q-pa-md row items-start q-gutter-md">
            <q-card-section>
                <q-icon name="mdi-view-dashboard" style="font-size: 30px;" />
            </q-card-section>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <q-card-section style="margin-top: 30px">
                <q-item-label caption>
                    Capacity
                </q-item-label>
                <q-item-label>105GB</q-item-label>
            </q-card-section>
            </div>
            <q-separator inset />
            <q-card-section class="text-center"> 
                <q-icon name="mdi-update" style="font-size: 20px;" />updated now
            </q-card-section>
        </q-card>
        
        <q-card bordered class="my-card">
            <div class="q-pa-md row items-start q-gutter-md">
            <q-card-section>
                <q-icon name="mdi-view-dashboard" style="font-size: 30px;" />
            </q-card-section>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <q-card-section style="margin-top: 30px">
                <q-item-label caption>
                    Capacity
                </q-item-label>
                <q-item-label>105GB</q-item-label>
            </q-card-section>
            </div>
            <q-separator inset />
            <q-card-section class="text-center"> 
                <q-icon name="mdi-update" style="font-size: 20px;" />updated now
            </q-card-section>
        </q-card>

        <q-card bordered class="my-card">
            <div class="q-pa-md row items-start q-gutter-md">
            <q-card-section>
                <q-icon name="mdi-view-dashboard" style="font-size: 30px;" />
            </q-card-section>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <q-card-section style="margin-top: 30px">
                <q-item-label caption>
                    Capacity
                </q-item-label>
                <q-item-label>105GB</q-item-label>
            </q-card-section>
            </div>
            <q-separator inset />
            <q-card-section class="text-center"> 
                <q-icon name="mdi-update" style="font-size: 20px;" />updated now
            </q-card-section>
        </q-card>

        <q-card bordered class="my-card">
            <div class="q-pa-md row items-start q-gutter-md">
            <q-card-section>
                <q-icon name="mdi-view-dashboard" style="font-size: 30px;" />
            </q-card-section>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <q-card-section style="margin-top: 30px">
                <q-item-label caption>
                    Capacity
                </q-item-label>
                <q-item-label>105GB</q-item-label>
            </q-card-section>
            </div>
            <q-separator inset />
            <q-card-section class="text-center"> 
                <q-icon name="mdi-update" style="font-size: 20px;" />updated now
            </q-card-section>
        </q-card>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
        <q-card bordered class="my-card">
            <q-card-section>
                <apexcharts width="450" type="bar" :options="options" :series="series"></apexcharts>
            </q-card-section>
        </q-card>
        <q-card bordered class="my-card">
            <q-card-section class="center" style="height: 327px; width: 420px">
                <apexcharts width="400" type="donut" :options="doptions" :series="dseries"></apexcharts>
            </q-card-section>
        </q-card>
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