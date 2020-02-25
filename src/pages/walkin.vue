<template>
    <q-page class="row">
          <div class="q-pa-sm col-8">
              <q-stepper header-nav v-model="step" ref="stepper" color="deep-orange-4" vertical falt active-color="orange-8" inactive-color="blue-10" animated>
                <q-step :name="1" title="Select Available Date" icon="settings" :done="step > 1">
                  <div class="column items-center">
                     <q-date v-model="date" minimal class="shadow-0" mask="YYYY-MM-DD" color="orange-8" ></q-date> 
                  </div>
                </q-step>

                <q-step :name="2" title="Fill up Information" icon="create_new_folder" :done="step > 2">
                  <div class="row col-12">
                    <q-input filled color="orange-8" outlined class="col-4 q-pa-sm" v-model="fname" label="Enter First Name" />
                    <q-input filled color="orange-8" outlined class="col-4 q-pa-sm" v-model="lname" label="Enter Last Name" />
                    <div class="q-pa-sm col-4">
                      <q-input filled color="orange-8" outlined v-model="date" mask="date">
                        <template v-slot:append>
                          <q-icon name="event" color="orange-8" class="cursor-pointer">
                            <q-tooltip>
                              Select New Date
                            </q-tooltip>
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="date" mask="YYYY-MM-DD" @input="() => $refs.qDateProxy.hide()" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                      <q-input type="number" filled color="orange-8" outlined class="col-4 q-pa-sm" v-model="pax" label="Enter Guest" />
                    <div class="q-pa-sm col-4">
                      <q-input label="Start Time" filled v-model="starttime" mask="time">
                        <template v-slot:append>
                          <q-icon color="orange-8" name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time v-model="starttime" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class="q-pa-sm col-4">
                      <q-input label="End Time" filled v-model="endtime" mask="time">
                        <template v-slot:append>
                          <q-icon color="orange-8" name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time v-model="endtime" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div>
                    <q-input filled color="orange-8" outlined class="col-12 q-pa-sm" v-model="place" label="Enter Event Place" />
                  </div>
                  <div class="row">
                    <q-select filled class="q-pa-sm col-4" color="orange-8" outlined v-model="selectMotif" :options="motifOpt" emit-value map-options label="Select Motif" />
                    <q-select filled class="q-pa-sm col-4" color="orange-8" outlined v-model="selectEvent" :options="eventOpt" emit-value map-options label="Select Event" />
                    <q-input filled color="orange-8" outlined class="col-4 q-pa-sm" v-model="email" label="Enter Email Address" />
                  </div>  
                </q-step>

                <q-step :name="3" title="Select Package" icon="assignment" :done="step > 3">
                  <q-table grid :data="eventpackages" :columns="columns" :filter="filter" row-key=".key" selection="single" :selected.sync="selected">
                      <template v-slot:item="props">
                          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition" color="deep-orange-4" :style="props.selected ? 'transform: scale(0.95);' : ''">
                              <q-card class="my-card" style="border: 2px solid;border-color: grey;" :class="props.selected ? 'bg-grey-2' : ''">
                                  <q-card-section side>
                                      <q-list dense>
                                      <q-item class="q-mt-sm">
                                      <span class="full-width text-center text-teal text-h6 text-weight-bold">
                                          <q-checkbox color="deep-orange-4" dense v-model="props.selected" :label="props.row.name" />
                                          <br>
                                          <q-chip class="text-center">{{props.row.price}}php per pax</q-chip>
                                      </span>
                                      </q-item>     
                                      <q-separator class="q-mt-sm"/>
                                      <q-item class="q-mt-sm text-grey-8" v-show="props.row.category">
                                      <span class="full-width text-center text-weight-bold">FOOD CATEGORIES</span>
                                      </q-item>
                                      <q-item v-for="(price, index) in props.row.category" :key="index" class="text-grey-8">
                                          <q-item-section>
                                          <q-item-label> {{ price.viandsQty }} <span v-show="price.viandsQty != '1'"></span> {{ price.category }}</q-item-label>
                                          </q-item-section>
                                      </q-item>
                                      <q-separator class="q-mt-sm"/>
                                      <q-item class="q-mt-sm" v-show="props.row.inclusions">
                                      <span class="full-width text-center text-weight-bold text-grey-8" >INCLUSIONS</span>
                                      </q-item>
                                      <q-item v-for="(price, index) in props.row.inclusions" :key="index" class="text-grey-8">
                                          <q-item-section>
                                          <q-item-label> {{ price.inclusion }}</q-item-label>
                                          </q-item-section>
                                      </q-item>
                                  </q-list>
                                  </q-card-section>
                              </q-card>
                          </div>
                      </template>
                  </q-table>
                </q-step>

                <q-step :name="4" title="Create an ad" icon="add_comment">
                  Try out different ad text to see what brings in the most customers, and learn how to
                  enhance your ads using features like ad extensions. If you run into any problems with
                  your ads, find out how to tell if they're running and how to resolve approval issues.
                </q-step>

                <template v-slot:navigation>
                  <q-stepper-navigation>
                    <q-btn @click="$refs.stepper.next()" color="orange-8" :label="step === 4 ? 'Finish' : 'Continue'" />
                    <q-btn v-if="step > 1" flat style="color: #010A43" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                  </q-stepper-navigation>
                </template>
              </q-stepper>
            </div>
            <div class="q-pa-sm col-4">
              <q-page-sticky position="top-right" :offset="[10, 8]">
                <q-card class="my-card" style="height: 540px; width: 440px">
                    <q-card-section>
                      <div class="column items-center q-pb-sm q-pt-none q-mt-none">
                          <div class="column items-center text-h6">Order Details</div>
                      </div>
                      <div class="row">
                      </div>
                    </q-card-section>
                </q-card>
              </q-page-sticky>
            </div>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
  data () {
    return {
        pax: 0,
        endtime: date.formatDate(new Date(), '10:50'),
        starttime: date.formatDate(new Date(), '12:50'),
        Motif: [],
        selected: [],
        Packages: [],
        Event: [],
        selectEvent: '',
        selectMotif: '',
        place: '',
        email: '',
        lname: '',
        fname: '',
        step: 1,
        splitterModel: 50,
        date: date.formatDate(new Date(),'YYYY-MM-DD'),
        columns: [
          { name: 'name', required: true, label: 'Package name', align: 'center', field: 'name', sortable: true },
          { name: 'price', align: 'center', label: 'Package Per Head Price', field: 'price', sortable: true },
        ]
    }
  },
  mounted(){
        this.$binding('Motif', this.$firestoreApp.collection('Motif'))
            .then(Motif => {
            console.log(Motif, 'Motif')
            }),
        this.$binding('Event', this.$firestoreApp.collection('Event'))
            .then(Event => {
            console.log(Event, 'Event')
            }),
        this.$binding('Packages', this.$firestoreApp.collection('Packages'))
            .then(Packages => {
            console.log(Packages, 'Packages')
            })
  },
  computed: {
      eventpackages(){ 
            let optionss = this.$lodash.filter(this.Packages, m => {
						return m.event == this.selectEvent
                    })    
                return optionss
      },
      returnDate(){
        let now = date.formatDate(new Date(),'YYYY-MM-DD')
        if(this.date == now){
          return 'Select Date'
        } else {
          return ''
        }
      },
      motifOpt(){
                let optionss = this.Motif.map(m => {
                    return {
                        label: m.motif,
                        value: m.motif
                    }
                })
                return optionss
        },
      eventOpt(){
                let optionss = this.Event.map(m => {
                    return {
                        label: m.event,
                        value: m.event
                    }
                })

                return optionss
        },
  },
  methods: {

  }
}
</script>