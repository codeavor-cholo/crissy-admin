<template>
    <q-page class="bg-grey-4">
        <div class="row">
<!-- LEFT PART -->
            <div class="col-8">
                <q-card class="my-card shadow-0" style="border-radius:20px;">
                    <q-card-section>
                        <div class="q-pa-md row" style="font-size:30px;font-family: 'Montserrat', sans-serif;">
                        <q-input v-model="reservation.clientEvent" type="text" label="Event Name" size="lg" outlined color="orange-8" class="col q-mr-md" rounded/>
                        <q-select v-model="reservation.clientEventType" :options="mapEvent" emit-value label="Event Type" outlined color="orange-8 " class="col-3" rounded/>
                        </div>
                        <q-stepper
                            v-model="step"
                            vertical
                            done-color="teal"
                            active-color="orange-8"
                            animated
                            flat
                            >
                            <q-step
                                :name="1"
                                title="Choose Date Of Your Event"
                                icon="calendar_today"
                                :done="step > 1"
                            >
                                <div class="row justify-center">
                                <q-date v-model="reservedate" color="orange-4" landscape="" flat :options="date => dateToday(date)"/>
                                </div>
                                <q-stepper-navigation>
                                <q-btn @click="step = 2" color="orange-8" label="Continue" rounded/>
                                </q-stepper-navigation>
                            </q-step>

                            <q-step
                                :name="2"
                                title="Fill up Reservation Form"
                                icon="assignment"
                                :done="step > 2"
                            >
                                <div class="column q-gutter-sm">

                                    <div class="row q-gutter-md q-pt-md q-pl-sm q-mb-sm">
                                        <div>    
                                            <q-input dense outlined style="width:300px" v-model="fname" label="First Name" color="orange-8" rounded/>
                                        </div>
                                        <div>
                                            <q-input dense outlined style="width:300px" v-model="lname" label="Last Name" color="orange-8" rounded/>        
                                        </div>
                                    </div>

                                    <div class="q-mb-sm">
                                        <q-input outlined v-model="place" type="textarea" style="width:615px" label="Event Adrress" color="orange-8" rounded/>
                                    </div>

                                    <div class="q-mb-sm">
                                        <q-select dense outlined v-model="city" :options="mapCity" emit-value style="width:615px" label="Select City" color="orange-8"  rounded/>
                                    </div>
                                    <div class="column q-gutter-sm q-mb-sm">
                                        <div class="row q-gutter-md">
                                            <div>
                                                <q-input dense outlined style="width:300px" type="text" v-model="pax" label="Pax" color="orange-8" rounded/>
                                            </div>
                                            <div>
                                                <q-select dense outlined style="width:300px" v-model="motif" label="Motif" :options="mapMotif" emit-value color="orange-8" rounded/>
                                            </div>
                                        </div>

                                        <div class="row q-gutter-md q-pt-md">
                                            <div>
                                                <q-input dense outlined style="width:300px" v-model="sTime" label="start time" type="time" color="orange-8" rounded/>
                                            </div>
                                            <div>
                                                <q-input dense outlined style="width:300px" v-model="eTime" label="end time" type="time" color="orange-8" rounded/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <q-stepper-navigation>
                                <q-btn @click="step = 3" color="orange-8" label="Continue" />
                                <q-btn flat @click="step = 1" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                            <q-step
                                :name="3"
                                title="Package Selection"
                                icon="assignment"
                                :done="step > 3"
                            >
                                <q-tabs
                                    v-model="tab"
                                    class="text-orange-8 bg-grey-2"
                                    align="justify"
                                >
                                    <q-tab name="PER PAX"  label="PER PAX PACKAGES" />
                                    <q-tab name="FIXED" label="FIXED PAX PACKAGES" />
                                </q-tabs>
                                <q-separator  />
                                        <h6 class="q-my-sm text-weight-light full-width text-center" style="font-size:1.2em;">Click the card to select package.</h6>
                                        <q-table grid :data="tab == 'PER PAX' ? returnPerPax : returnFixed" :columns="columns" :filter="filter" class="full-width align-center " :selected.sync="selectedPackage" row-key="name" selection="single">
                                        <template v-slot:item="props">
                                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''" >
                                                <q-card class="my-card cursor-pointer"  style="border-radius:20px" @click.native="props.selected = !props.selected" :class="props.selected ? 'bg-orange-8 text-white' : 'text-grey-8'">
                                                    <q-card-section class="">
                                                        <q-list dense>
                                                        <q-item class="q-mt-sm">
                                                            <q-item-section>
                                                                <span class="full-width text-h6  text-weight-bold">{{props.row.name}}</span>
                                                            </q-item-section>
                                                            <q-item-section side :class="props.selected ? 'bg-orange-8 text-white' : 'text-orange-8'">
                                                                <span class="text-h6 text-weight-bold">P {{props.row.price}}.00</span><span></span>
                                                                
                                                                <span class="" v-show="tab == 'FIXED'">for <span class="text-weight-bold">{{props.row.adultPax}}</span>
                                                                     
                                                                    <span v-show="props.row.withKid"> adults</span>
                                                                    <span v-show="props.row.withKid == false">PAX</span>
                                                                </span> 
                                                                <span class="" v-show="props.row.withKid">& <span class="text-weight-bold">{{props.row.kidPax}}</span> kids</span> 
                                                                <span class="" v-show="tab == 'PER PAX'">per pax</span> 
                                                            </q-item-section>
                                                        
                                                        </q-item>     
                                                        <q-separator  inset class="q-mt-sm" />           
                                                        <q-item class="q-mt-sm " v-show="props.row.category">
                                                        <span class="full-width text-weight-bold">FOOD CATEGORIES</span>
                                                        </q-item>
                                                        <q-item v-for="(price, index) in props.row.category" :key="index" class="">
                                                            <q-item-section>
                                                            <q-item-label> {{ price.viandsQty }}&nbsp;{{ price.category }}</q-item-label>
                                                            </q-item-section>
                                                        </q-item>
                        
                                                        <q-item class="q-mt-sm" v-show="props.row.inclusions">
                                                        <span class="full-width text-weight-bold " >INCLUSIONS</span>
                                                        </q-item>
                                                        <q-item v-for="(price, index) in props.row.inclusions" :key="index" class="">
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
  
                                
                                <q-stepper-navigation>
                                <q-btn @click="step = 4" color="orange-8" label="Continue" />
                                <q-btn flat @click="step = 2" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                            <q-step
                                :name="4"
                                title="Food Selection"
                                icon="fastfood"
                            >

                                <div v-for="(food,i) in foodChoice" :key="i" v-show="selectedPackage != null">
                                  <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Select <span class="text-orange-8 text-h6">{{returnLimit(food.category)}}</span> Choice<span v-show="returnLimit(food.category) > 1">s</span> of {{food.category}}  </span>
                                  <div class="row q-mt-md q-mb-md">
                                        <q-card class="my-card col-4 q-ma-sm cursor-pointer" v-for="(choice,j) in food.foodChoices" :key="j" :style="returnSelectedStatus(choice) ? 'transform: scale(0.95);' : ''" :class="returnSelectedStatus(choice) ? 'bg-orange text-white' : ''" style="border-radius:20px;" @click.native="clickUnclick(choice),checkQty(choice,returnLimit(food.category),food.category)">
                                        <q-img 
                                          :src="choice.foodPic"
                                          :ratio="3/2" />

                                        <q-card-section>


                                          <div class="row no-wrap items-center">
                                            <q-checkbox color="orange-8" v-model="choiceOfFood" :val="choice" @input="checkQty(choice,returnLimit(food.category),food.category)"/>
                                            <div class="col text-subtitle2 ellipsis">
                                              {{choice.foodName}}
                                            </div>
                                          </div>
                                        </q-card-section>
                                        </q-card>

                                  </div>
                                </div>
                                <q-stepper-navigation>
                                <q-btn color="orange-8" label="Finish" />
                                <q-btn flat @click="step = 3" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>
                        </q-stepper>
                    
                    </q-card-section>
                    </q-card>

            </div>
<!-- END OF LEFT PART -->

<!-- RIGHT PART -->
            <div class="col-4 q-pl-md">
                <q-card class="my-card shadow-0" style="border-radius:20px;">
                    <q-card-section>
                       
                        <div class="column items-center q-pa-sm">
                             <q-card flat class="my-card bg-grey-3" style="width:300px">
                                <q-card-section>
                                    <div class="column items-center">Order Summary - #04b7643</div>
                                </q-card-section>
                              </q-card>
                        </div>
       
                        <div class="q-pa-sm row justify-between">
                            <div>Date</div>
                            <div>27 Jul 2019</div>
                        </div>
                        <div class="q-pa-sm row justify-between">
                            <div>Time</div>
                            <div>04:36 PM</div>
                        </div>
                        <div class="q-pa-sm row justify-between">
                            <div>Total Number of People</div>
                            <div>45</div>
                        </div>
                        
                        <div> 
                        <q-separator inset class="black"/>
                        </div>
                    
                        <div class="q-pa-sm"><b>Items</b></div>
                        <div class="q-pa-sm">Mutton Fry</div>
                        <div class="q-pa-sm">Chicken Fried Rice</div>
                        <div class="q-pa-sm">Chili Prawn</div>
                        <div class="q-pa-sm">Ghost Chicken</div>
                        <div class="q-pa-sm">Chicken G5</div>
                        <div class="q-pa-sm">Fish Gravy</div>

                        <div> 
                        <q-separator inset class="black"/>
                        </div>

                        <div class="q-pa-sm"><b>Add-ons</b></div>
                        <div class="q-pa-sm row justify-between">
                            <div>Tattoo Artists</div>
                            <div>3,000</div>
                        </div>
                        <div class="q-pa-sm row justify-between">
                            <div>Hair Braiding</div>
                            <div>3,500</div>
                        </div>
                        <div class="q-pa-sm row justify-between">
                            <div>Master of Ceremony</div>
                            <div>3500</div>
                        </div>

                    </q-card-section>
                 </q-card>
            </div>    
<!-- END OF RIGHT PART -->

        </div>
    </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
    choiceOfFood: [],
    selectedPackage: [],
     tab: 'PER PAX',   
     step: 3,
     fname: '',
     lname: '',
     pax: '', 
     place: '',
     city: '',
     motif: '',
     sTime: '09:00',
     eTime: '13:00',
     reservation: {},
     Event: [],
     City: [],
     Motif: [],
     Packages: [],
    filter: '',
    pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
    columns: [
        { name: 'name', required: true, label: 'Package name', align: 'center', field: 'name', sortable: true },
        { name: 'price', align: 'center', label: 'Package Per Head Price', field: 'price', sortable: true },
    ],
     reservedate: '' 
     
    }
  },
  created(){
      this.reservation = this.$q.localStorage.getItem(this.$route.params.id)
  },
  mounted(){
    this.$binding('Event', this.$firestoreApp.collection('Event'))
      .then(Event => {
      console.log(Event, 'Event')
      }),
    this.$binding('City', this.$firestoreApp.collection('City'))
      .then(City => {
      console.log(City, 'City')
      }),
    this.$binding('Motif', this.$firestoreApp.collection('Motif'))
      .then(Motif => {
      console.log(Motif, 'Motif')
      }),
    this.$binding('Packages', this.$firestoreApp.collection('Packages'))
        .then(Packages => {
        console.log(Packages, 'Packages')
        }),
        
    this.$binding('Food', this.$firestoreApp.collection('Food'))
      .then(Food => {
      console.log(Food, 'Food')
      }),
    this.$binding('Category', this.$firestoreApp.collection('Category'))
      .then(Category => {
      console.log(Category, 'Category')
      })
  },
  computed:{
    mapEvent(){
      let map = this.Event.map(a=>{
        return {
          label:a.event,
          value:a.event
        }
      })
      return map
    },
    mapCity(){
      let map = this.City.map(a=>{
        return {
          label:a.city,
          value:a.city
        }
      })
      return map
    },
    mapMotif(){
      let map = this.Motif.map(a=>{
        return {
          label:a.motif,
          value:a.motif
        }
      })
      return map
    },
    returnPerPax(){
        return this.Packages.filter(a=>{
            return a.type == undefined
        })
    },
    returnFixed(){
        return this.Packages.filter(a=>{
            return a.type == 'FIXED'
        })        
    },
    foodChoice(){
        try {
          let viands = this.selectedPackage[0].category
          console.log(viands)
          let foodWithPriceInViands = []
          let foods =  this.Food
          for(var x = 0; x < foods.length; x++){
            for(var y=0; y < viands.length; y++){
              if(foods[x].foodPrice != null && foods[x].category == viands[y].category){
                let push = {...foods[x]}
                let key = push['.key']
                delete push['.key']
                push.foodKey = key
                foodWithPriceInViands.push(push)
              }
            }
          }
          console.log(foodWithPriceInViands,'foodWithPriceInViands')
          let groups = this.$lodash.groupBy(foodWithPriceInViands,'category')
          console.log(groups,'groups')

          let map = this.$lodash.map(groups,function(value,key){
            return {
              category: key,
              foodChoices: value
            }
          })

          console.log(map,'map')
          return map
        } catch (err) {
          return []
        }
      },

  },
  methods:{
    stepChecker(){
        
    },
    dateToday(dates){
        console.log('dates',dates)
        let today = new Date()
        let format = date.formatDate(today,'YYYY/MM/DD')
        if(format < dates){
            return true
        }
    },
    returnLimit(viand){
      try {
        let viands = this.selectedPackage[0].category
        let limit = viands.filter(a=>{
          return a.category == viand
        })
        return limit[0].viandsQty

      }catch(err){
        return ''
      }
    },
    checkQty(food,qty,viandName){
      console.log(food)
      console.log(qty)
      console.log(viandName, 'yeah')
      let selection = this.choiceOfFood
      console.log(selection,'selection')
      //get QTY of viand in selection
      let count = this.$lodash.filter(selection, a=>{
        return a.category == viandName
      })
      if(count.length > qty){
        this.$q.dialog({
            title: viandName + ' Selection Max Reached',
            message: 'Removing last food choice.',
            ok: 'Ok',
            persistent: true
          }).onOk(() => {
            this.choiceOfFood.splice(selection.length-1,1)
            console.log('removed last')
            console.log(selection)
          })
      }

    },
    returnSelectedStatus(choice){
      let count = this.$lodash.findIndex(this.choiceOfFood, a=>{
        return a.foodName == choice.foodName
      })
      // console.log(count,'index')
      if(count > -1){
        return true
      } else {
        return false
      }
    },
    findIndexSelection(arr,val){
        return this.$lodash.findIndex(arr,val)
    },
    clickUnclick(choice){
      let index = this.findIndexSelection(this.choiceOfFood,choice)
      
      if(index > -1){
        console.log(index,'index')
        this.choiceOfFood.splice(index,1)
      } else {
        this.choiceOfFood.push(choice)
      }

    }
  }
}
</script>