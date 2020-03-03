<template>
  <q-page class="">
      
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step :name="1" title="Select Date and Time" icon="create_new_folder" :done="step > 1">
        <div class="fixed-bottom-right q-pr-md" style="margin-top: 123px">
            <q-input v-model="datesToday" mask="YYYY-MM-DD" filled type="date" label="Date Today" readonly style="width: 200px" />
        </div>
        <div class="q-pl-xl">
            <strong>PLEASE SELECT DATE AND TIME (TIME: 11PM to 6AM is not Available)</strong>
        </div>
        <div class="q-gutter-md row items-start">
          <q-date v-model="dates" @input="stepBackCurry(eventsReserve), checkWedding()" mask="YYYY-MM-DD" :options="optionsFn" :events="eventsReserve" event-color="red" color="purple" />
          <q-time mask="YYYY-MM-DD HH:mm:ss" v-model="datestime" :hour-options="hourOptions" @input="endtime" color="purple" style="margin-top: 30px" />
          <q-input v-model="dates" mask="YYYY-MM-DD" filled type="date" label="Selected Date" readonly style="margin-left: 50px; margin-top: 50px" />
          <q-input style="margin-top: 130px; margin-left: -180px" v-model="datestimeView" readonly label="Start time" />
          <q-input style="margin-top: 200px; margin-left: -160px" v-model="datestimeEnd" readonly label="End time" />
          <strong style="margin-top: 270px; margin-left: -175px; width: 200px; height: 40px">Disabled Dates Are Not Available</strong>
          <strong class="q-badge bg-accent q-pa-sm" style="margin-top: 350px; margin-left: -200px; width: 200px; height: 40px">{{showAvailable}}</strong>
        </div>
        
       </q-step>

      <q-step :name="2" title="Fill up Form" icon="settings" :done="step > 2">
    <div align="center">
        <div class="q-pa-md row" style="margin-left: 225px; margin-bottom: -20px">
        <q-input class="q-ma-sm" dense v-model="clientFName" label="Client First Name" style="width: 242px; margin-bottom: 10px"/>
        <q-input class="q-ma-sm" dense v-model="clientLName" label="Client Last Name" style="width: 242px; margin-bottom: 10px"/>
        </div>
        <q-input class="q-ma-sm" dense v-model="address" label="Address" style="width: 500px; margin-bottom: -10px"/>
        <div class="q-pa-md row" style="margin-left: 225px; margin-bottom: -20px">
        <q-input clearable class="q-ma-sm" use-input input-debounce="0" behavior="menu" @filter="filterFns" v-model="selectBrgy" :options="opts" label="Brgy" emit-value map-options style="width: 243px; height: 24px"/>
        <q-select clearable class="q-ma-sm" use-input input-debounce="0" behavior="menu" @filter="filterFn" v-model="selectCity" :options="opt" label="City" emit-value map-options style="width: 243px; height: 24px"/>
        </div>
        <div class="q-pa-md row" style="margin-left: 225px; margin-bottom: -20px">
        <q-input type="number" class="q-ma-sm" dense v-model="pax" label="Pax" hint="+20php per head if pax is less than 100" style="width: 247px">
        <template v-slot:prepend>
          <q-icon name="mdi-account" />
        </template>
        </q-input>
        <q-input v-model="contactNumber" label="Phone" mask="(####) #### - ###" style="width: 247px; height: 40px" fill-mask/>
        </div>
        <q-input v-model="emailAdd" type="email" prefix="Email:" suffix="@gmail.com" style="width: 500px; margin-bottom: 10px">
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>
        </q-input>
        <q-select class="q-ma-sm" filled v-model="selectEvent" :options="eventOptions" style="width: 500px;" label="Event" emit-value map-options/>
        <q-select class="q-ma-sm" v-model="selectMotif" @input="motifdes" :options="motifOptions" style="width: 500px;" label="Select Motif" emit-value map-options/>
        <q-input class="q-ma-sm" readonly v-model="motifDescripiton" label="Motif Description" style="width: 500px;" filled autogrow/>
     </div>
      </q-step>

      <q-step :name="3" title="Select or Customize Package" icon="settings" :done="step > 3">
        <div class="q-pa-md">
          <q-table title="" grid :data="eventpackages" :columns="columns" row-key=".key" selection="single" :selected.sync="selected">
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                    <q-card style="max-width: 250px" >
                        <q-card-section>
                           <strong><q-checkbox @input="consoleselected" dense v-model="props.selected" :label="props.row.eventName" /> </strong>
                        </q-card-section>
                        <q-card-section>
                            <strong>{{props.row.packagePrice}} Php per head</strong>
                        </q-card-section>
                        <q-card-section>
                            <div  v-for="(i, index) in props.row.dishType" :key="index">
                                <strong>
                                    {{i.dishName}}
                                </strong>
                                <q-list v-for="(j, jindex) in  i.category" :key="jindex" dense>
                                                <q-item clickable v-ripple>
                                                    <q-item-section>
                                                        <q-item-label lines="1">{{j.category}}</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-item-label lines="1">{{j.qty}}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                </q-list>
                            </div>
                        </q-card-section>
                        <q-separator/>
                        <q-card-section>
                            <q-btn label="View Package Inclusion" dense color="primary" icon="mdi-pencil" @click="packIncDialog = true, openInclusion(props.row)"></q-btn>
                        </q-card-section>
                    </q-card>
                </div>
            </template>
            <!-- customPack = true, hideTable = false -->
          </q-table>
            <q-dialog v-model="packIncDialog">
                <q-card style="min-width: 400px">
                    <q-card-section>
                    <div class="text-h6">Package Inclusion</div>
                        </q-card-section>
                            <q-list dense bordered padding class="rounded-borders" full-width>
                                <q-item-label header>Inclusion List</q-item-label>

                                <q-item clickable v-ripple v-for="(s, index) in this.selectedInclusion.packageInclusion" :key="index">
                                    <q-item-section>
                                        <q-item-label lines="1">{{s.setupOne}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        <q-card-section>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Ok" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
                <q-btn color="blue" class="full-width q-mt-md" @click="customPackage = true" label="CUSTOMIZE PACKAGE" />
      </q-step>
    <!-- Choosing Of Foods -->
    <q-step :name="4" title="Select Food" icon="create_new_folder" :done="step > 4">
        
      <div v-for="(i, index) in  ListOfFood" :key="index">
        <div  dense class="q-pa-xs">
            <q-chip class="full-width"><strong>Please Select <q-badge class="q-mx-xs">{{i.categoryQty}}</q-badge> kinds of {{i.categoryName}}-{{i.dishName}}</strong></q-chip>
            <div  class="container row">
            <q-card class="q-ma-xs col-4" v-for="(j, jindex) in  i.foods" :key="jindex" style="max-width: 280px">
                <q-item>
                    <q-item-section side>
                            <q-img :src="j.foodPic" @click="viewFoodPic = true, openFoodPic(j)" style="width: 250px; height: 150px" :ratio="1" basic spinner-color="white">
                                <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
                                 <q-badge color="transparent"><q-checkbox @input="consoleS(i.checkerName,i.categoryQty,j)" keep-color color="red" dense :val="j" v-model="foodSelected" :label="j.foodName" /></q-badge>
                                </div>       
                            </q-img>
                    </q-item-section>
                </q-item>
            </q-card>
            </div>
        </div>
      </div>
      <div>
          <!-- table for Inclusion -->
          <q-separator/>
          <q-chip class="full-width" icon="mdi-food">{{packageOptions.packInc}} &nbsp;<strong>PACKAGE INCLUSION</strong></q-chip>
          <q-list dense bordered padding class="rounded-borders" style="width: 500px">
                <q-item-label header><strong>Inclusion List</strong></q-item-label>
                <q-item clickable v-ripple v-for="(s, index) in ListofInclusion" :key="index">
                    <q-item-section>
                        <q-item-label lines="1"><span>{{s.setupOne}}</span></q-item-label>
                    </q-item-section>
                </q-item>
          </q-list>  
      </div>

      <div>
          <!-- ADDITIONAL -->
          <q-separator/>
          <q-chip class="full-width" icon="mdi-food"><strong>ADDITIONAL</strong></q-chip>
            <div class="q-pa-md row" style="margin-top: -50px">
                <q-select class="q-ma-sm" v-model="amenities" @input="amenitiesPriceOptions" emit-value map-options :options="amenitiesOptions" style="width: 200px" filled label="Amenities"/>
                <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Price" v-model="amenitiesPrice"/>
                <q-input class="q-ma-sm" type="number" @input="totalQprice"  style="width: 100px" label="Quantity" v-model="amenitiesQuantity"/>
                <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Price" v-model="amenitiestotalprice"/>  
                <q-btn class="q-ma-sm" style="height: 30px; margin-top: 45px" color="primary" label="ADD" @click="addAdditionalList" />
                <h6>{{additionalPrice}}</h6>
            </div>
            <div>
                    <q-list dense bordered class="rounded-borders" style="margin-top: -45px">
                        <q-item v-for="(i, index) in additionalListNew" :key="index">
                            <q-item-section>
                                <q-item-label  avatar top>{{i.amenitiesNames}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" center>{{i.amenitiesPrices}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" center>{{i.amenitiesQuantities}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" side>{{i.amenitiesTotalPrices}}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <div class="row">
                                    <q-btn round color="negative" label="Delete" icon="mdi-delete" @click="deleteAdditionalTask(index)"/>
                                </div>
                            </q-item-section>
                        </q-item>

                    </q-list>
            </div>
      </div>
       <div>
          <!-- SERVICES -->
          <q-chip class="full-width" icon="mdi-food"><strong>SERVICES</strong></q-chip>
            <div class="q-pa-md row" style="margin-top: -50px">
                <q-select class="q-ma-sm" v-model="services" @input="servicesPriceOptions" emit-value map-options :options="servicesOptions" style="width: 200px" filled label="Services"/>
                <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Price" v-model="servicesPrice"/>
                <q-input class="q-ma-sm" type="number" @input="totalSprice"  style="width: 100px" label="Quantity" v-model="servicesQuantity"/>
                <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Total Price" v-model="servicestotalprice"/>  
                <q-btn class="q-ma-sm" style="height: 30px; margin-top: 45px" color="primary" @click="addServicesList" label="ADD"/>
                <h6>{{servicesPrices}}</h6>          
            </div>
            <div>
                    <q-list dense bordered class="rounded-borders" style="margin-top: -45px">
                        <q-item v-for="(i, index) in servicesListNew" :key="index">
                            <q-item-section>
                                <q-item-label  avatar top>{{i.servicesNames}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" center>{{i.servicesPrices}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" center>{{i.servicesQuantities}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" side>{{i.servicesTotalPrices}}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <div class="row">
                                    <q-btn label="Delete" color="negative" @click="deleteServicesTask(index)" icon="mdi-delete"/>
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
            </div>
            
      </div>
    </q-step>
    <q-step :name="5" title="Billing" icon="create_new_folder" :done="step > 5">
        <div>
            <q-list dense bordered padding class="rounded-borders" full-width>
                <q-item-label overline>&nbsp;Food To Serve</q-item-label>
                        <q-item clickable v-ripple v-for="(i, index) in foodSelected" :key="index">
                            <q-item-section>
                                <q-item-label lines="1">{{i.foodName}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label lines="1">+{{i.addedPrice}} per head</q-item-label>
                            </q-item-section>
                        </q-item>
            </q-list>
        </div>
        <div>
            <q-list dense bordered padding class="rounded-borders" full-width>
                <q-item-label overline>&nbsp;Package Inclusion</q-item-label>
                        <q-item clickable v-ripple v-for="(s, index) in ListofInclusion" :key="index">
                            <q-item-section>
                                <q-item-label lines="1">{{s.setupOne}}</q-item-label>
                            </q-item-section>
                        </q-item>
            </q-list>
        </div>
        <div>
            <q-list dense bordered padding class="rounded-borders" full-width>
                <q-item-label overline>&nbsp;Other Additional</q-item-label>
                        <q-item clickable v-ripple v-for="(i, index) in additionalList" :key="index">
                            <q-item-section>
                                <q-item-label lines="1">{{i.amenitiesNames}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label lines="1">{{i.amenitiesTotalPrices}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-ripple v-for="(i, index) in servicesList" :key="index">
                            <q-item-section>
                                <q-item-label lines="1">{{i.servicesNames}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label lines="1">{{i.servicesTotalPrices}}</q-item-label>
                            </q-item-section>
                        </q-item>
            </q-list>
        </div>
        <div class="q-ma-md row">
            <q-input type="number" class="q-ma-sm" dense v-model="pax" style="width: 60px; margin-top: -15px"/><strong>persons @</strong><strong>{{packageOptions.packagePrice}}php =</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>{{totalPackPrice}}php</strong>
        </div>
        <div class="q-ma-md row" style="margin-top: -20px">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>Total Additional Price =</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>{{totalAdditionalPrice}}php</strong>
        </div>
        <div class="q-ma-md row" style="margin-top: -10px">
            <strong>Total Added Price For Food =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{addedFoodPricePerHead}}php</strong>
        </div>
        <div class="q-ma-md row" style="margin-top: -10px">
            <strong>+20 per head Pax less than 100 =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{paxlesshundred}}php</strong>
            
        </div>
        <div class="q-ma-md row" style="margin-top: -10px">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>Total Payment =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{totalpackagePriceNaTo}}php</strong>
            
        </div>
        <div class="q-md row" style="margin-top: -10px" >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>50% Down Payment =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{totalpackagePriceNaTowithDiscount}}php</strong>
        </div>
        <div>
            <!-- <q-page-sticky position="right" :offset="[18, 0]">
                <q-card>
                     <h6>Main Dishes @{{mainDishPrice}}&nbsp;php Per Head</h6>
                     <h6 style="margin-top: -50px">Dessert @{{dessertPrice}} php per Head</h6>
                     <h6 style="margin-top: -50px">Drinks @{{drinksPrice}} php per Head</h6>
                     <h6 style="margin-top: -50px">Rice @{{ricePrice}} php per Head</h6>
                     <h6 style="margin-top: -50px">Soup @{{soupPrice}} php per Head</h6>
                     <h6 style="margin-top: -50px">Appetizer @{{appetizerPrice}} php per Head</h6>
                     <h6 style="margin-top: -50px">Total Package Price @{{packagePricePerHead}} php per Head</h6>
                     <h6 style="margin-top: -50px">Additional @{{additionalPrice}} php</h6>
                     <h6 style="margin-top: -50px">Services @{{servicesPriceAll}} php</h6>
                     <h6 style="margin-top: -50px">Total Package Price @{{Packages.totalMinPrice}} php per head</h6>
                </q-card>
            </q-page-sticky> -->
          
        </div>
      </q-step>
        <!-- hideShowTable -->
      <template v-slot:navigation>
          <!-- step === 5 ? savePackageReservation() : $refs.stepper.next(), -->
          <!-- @click="step === 5 ? paymentNow = true : $refs.stepper.next()" -->
        <q-stepper-navigation style="margin-top: 50px">
          <q-btn @click="stepcheck" color="primary" :label="step === 5 ? 'Continue To Payment' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    
        <q-dialog v-model="customPackage" full-width>
            <q-card >
                <q-card-section>
                <div class="text-h6">Customize Package</div>
                </q-card-section>
                <q-card-section>
                    <q-stepper v-model="steppen" ref="steppers" color="primary" animated>
      <q-step :name="1" title="Select Package" icon="settings" :done="steppen > 1">
          <q-page>
              <div style="float: left; width: 75%">
              <div v-for="(i, index) in  customListofFood" :key="index">
                        <div style="float-left: 65%"  dense class="q-pa-xs">
                            <q-chip class="full-width"><strong>Please Select <q-badge class="q-mx-xs">{{i.dishType}} -- {{i.category}}</q-badge></strong></q-chip>
                                <div  class="container row">
                                        <q-card class="q-ma-xs col-4" v-for="(j, jindex) in  i.food" :key="jindex" style="max-width: 280px">
                                            <q-item>
                                                <q-item-section side>
                                                        <q-img :src="j.foodPic" @click="viewCustomFoodPic = true, openCustomFoodPic(j)" style="width: 250px; height: 150px" :ratio="1" basic spinner-color="white">
                                                            <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
                                                            <q-checkbox keep-color color="red" @input="checkCustomFood" dense :val="j" v-model="customFoodSelected" :label="j.foodName" />&nbsp;&nbsp;<q-badge color="blue">{{j.foodTotalPrice}}</q-badge>
                                                            </div>       
                                                        </q-img>
                                                </q-item-section>
                                            </q-item>
                                        </q-card>
                                        </div>
                                    </div>
                                </div>
                                <div>
          <!-- ADDITIONAL -->
          <q-separator/>
          <q-chip class="full-width" icon="mdi-food"><strong>ADDITIONAL</strong></q-chip>
            <div class="q-pa-md row" style="margin-top: -50px">
                <q-select class="q-ma-sm" v-model="amenities" @input="amenitiesPriceOptions" emit-value map-options :options="amenitiesOptions" style="width: 200px" filled label="Amenities"/>
                <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Price" v-model="amenitiesPrice"/>
                <q-input class="q-ma-sm" type="number" @input="totalQprice"  style="width: 100px" label="Quantity" v-model="amenitiesQuantity"/>
                <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Price" v-model="amenitiestotalprice"/>  
                <q-btn class="q-ma-sm" style="height: 30px; margin-top: 45px" color="primary" label="ADD" @click="addAdditionalList" />
                <h6>{{additionalPrice}}</h6>
            </div>
            <div>
                    <q-list dense bordered class="rounded-borders" style="margin-top: -45px">
                        <q-item v-for="(i, index) in additionalListNew" :key="index">
                            <q-item-section>
                                <q-item-label  avatar top>{{i.amenitiesNames}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" center>{{i.amenitiesPrices}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" center>{{i.amenitiesQuantities}}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label  lines="1" side>{{i.amenitiesTotalPrices}}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <div class="row">
                                    <q-btn color="negative" label="Delete" icon="mdi-delete" @click="deleteAdditionalTask(index)"/>
                                </div>
                            </q-item-section>
                        </q-item>

                    </q-list>
                        
                </div>
        </div>
        <div>
            <!-- SERVICES -->
            <q-chip class="full-width" icon="mdi-food"><strong>SERVICES</strong></q-chip>
                <div class="q-pa-md row" style="margin-top: -50px">
                    <q-select class="q-ma-sm" v-model="services" @input="servicesPriceOptions" emit-value map-options :options="servicesOptions" style="width: 200px" filled label="Services"/>
                    <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Price" v-model="servicesPrice"/>
                    <q-input class="q-ma-sm" type="number" @input="totalSprice"  style="width: 100px" label="Quantity" v-model="servicesQuantity"/>
                    <q-input readonly class="q-ma-sm" type="number" style="width: 100px" label="Total Price" v-model="servicestotalprice"/>  
                    <q-btn class="q-ma-sm" style="height: 30px; margin-top: 45px" color="primary" @click="addServicesList" label="ADD"/>
                    <h6>{{servicesPrices}}</h6>          
                </div>
                <div>
                        <q-list dense bordered class="rounded-borders" style="margin-top: -45px">
                            <q-item v-for="(i, index) in servicesListNew" :key="index">
                                <q-item-section>
                                    <q-item-label  avatar top>{{i.servicesNames}}</q-item-label>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label  lines="1" center>{{i.servicesPrices}}</q-item-label>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label  lines="1" center>{{i.servicesQuantities}}</q-item-label>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label  lines="1" side>{{i.servicesTotalPrices}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <div class="row">
                                        <q-btn color="negative" label="Delete" @click="deleteServicesTask(index)" icon="mdi-delete"/>
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                </div>
                
        </div>
          </div>
          <div class="q-ma-xl"  style="float: right; width: 25%">
            <q-page-sticky class="q-pa-xl" style="margin-top: 100px" position="top-right" :offset="[18, 18]">
              <q-card style="min-width: 320px">
                               <div>
                                   <strong>DETAILS</strong>
                                   <br/>
                                   <q-item dense clickable v-ripple v-for="(h, hindex) in this.customFoodSelected" :key="hindex">
                                    <q-item-section>
                                        <q-item-label lines="1" dense><strong>{{h.foodName}}</strong></q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label lines="1" dense ><strong>{{h.foodTotalPrice}}</strong></q-item-label>
                                    </q-item-section>
                                </q-item>
                                <strong>Total Package Price per Head: {{cpPrice}}</strong>
                               </div>
                                <div>
                                    <q-item dense clickable v-ripple v-for="(i, index) in additionalListNew" :key="index">
                                    <q-item-section>
                                        <q-item-label lines="1" dense><strong>{{i.amenitiesNames}}</strong></q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label lines="1" dense ><strong>{{i.amenitiesTotalPrices}}</strong></q-item-label>
                                    </q-item-section>
                                </q-item>
                                </div>
                                <div>
                                    <q-item dense clickable v-ripple v-for="(j, jindex) in servicesListNew" :key="jindex">
                                        <q-item-section>
                                            <q-item-label lines="1" dense><strong>{{j.servicesNames}}</strong></q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-item-label lines="1" dense ><strong>{{j.servicesTotalPrices}}</strong></q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                             <strong>Total Additional Price: {{cpPriceTotal}}</strong>
                            </q-card>
                    </q-page-sticky>                 
                  </div>
          </q-page>  
      </q-step>

      <q-step :name="2" title="Billing" icon="create_new_folder" :done="steppen > 2" >
                    <div>
                        <q-list dense bordered padding class="rounded-borders" full-width>
                            <q-item-label overline><strong>&nbsp;Food To Serve</strong></q-item-label>
                                    <q-item clickable v-ripple v-for="(i, index) in customFoodSelected" :key="index">
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>{{i.foodName}}</strong></q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>{{i.foodTotalPrice}} per head</strong></q-item-label>
                                        </q-item-section>
                                    </q-item>
                        </q-list>
                    </div>
                    <div>
                        <q-list dense bordered padding class="rounded-borders" full-width>
                            <q-item-label overline><strong>&nbsp;Other Additional</strong></q-item-label>
                                    <q-item clickable v-ripple v-for="(i, index) in additionalList" :key="index">
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>{{i.amenitiesNames}}</strong></q-item-label>
                                        </q-item-section>
                                         <q-item-section>
                                            <q-item-label lines="1"><strong>Qty:{{i.amenitiesQuantities}}</strong></q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>Total Price:{{i.amenitiesTotalPrices}}</strong></q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item clickable v-ripple v-for="(i, index) in servicesList" :key="index">
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>{{i.servicesNames}}</strong></q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>Qty:{{i.servicesQuantities}}</strong></q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1"><strong>Total Price:{{i.servicesTotalPrices}}</strong></q-item-label>
                                        </q-item-section>
                                    </q-item>
                        </q-list>
                    </div>
                    <div class="q-ma-md row">
                        <q-input readonly type="number" class="q-ma-sm" dense v-model="pax" style="width: 60px; margin-top: -15px"/><strong>persons @</strong><strong>{{cpPrice}}php =</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>{{totalcustomPackPrice}}php</strong>
                    </div>
                    <div class="q-ma-md row" style="margin-top: -20px">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>Total Additional Price =</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>{{totalAdditionalPrice}}php</strong>
                    </div>
                    <div class="q-ma-md row" style="margin-top: -10px">
                        <strong>+20 per head Pax less than 100 =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{paxlesshundred}}php</strong>
                        
                    </div>
                    <div class="q-ma-md row" style="margin-top: -10px">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>Total Payment =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{customizeTotalPackPrice}}php</strong>
                    </div>
                    <div class="q-md row" style="margin-top: -10px" >
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>50% Down Payment =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{customizeTotalpackagePriceNaTowithDiscount}}php</strong>
                    </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="steppen === 2 ? custompaymentNow = true : $refs.steppers.next()" color="primary" :label="steppen === 2 ? 'Continue To Payment' : 'Continue'" />
          <q-btn v-if="steppen > 1" flat color="primary" @click="$refs.steppers.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
                      
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    
    <q-dialog v-model="custompaymentNow">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Choose Payment</div>
        </q-card-section>

        <q-card-section>
            <div>
                <q-btn @click="customcashPayment = true, custompaymentNow = false" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="CASH" icon="mdi-cash-multiple" />
            </div>
            <div>
                <q-btn @click="custompaymentNow = false, customstripePayment = true" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="CARD" icon="mdi-account-card-details" />
            </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="customstripePayment">
      <q-card style="min-width: 800">
                <q-card-section class="row items-center">
                    <div class="text-h6">Card Payment</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup>
                        <q-tooltip>
                            Cancel
                        </q-tooltip>
                    </q-btn>
                </q-card-section>
                <q-card-section>
                        <strong>Email:</strong>
                        <q-input v-model="emailAdd" type="email" prefix="Email:" suffix="@gmail.com" style="width: 500px; margin-bottom: 10px">
                            <template v-slot:prepend>
                                <q-icon name="mail" />
                            </template>
                        </q-input>
                        <strong>Card Information:</strong>
                        <vue-stripe-elements outline color="teal" class="col-8 q-mx-md q-pa-md full-width" style="" ref="elementsRefCustom" @token="tokenCreatedCustom" @loading="loading = $event"></vue-stripe-elements>
                        <q-btn outline color="teal" class="q-pa-sm col-3 full-width" size="md" @click="submitCustom">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{customizeTotalpackagePriceNaTowithDiscount}}</b></q-btn>
                </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="viewFoodPic">
            <q-card style="min-width: 400px">
                            <q-img
                                :src="this.selectedFoodPic.foodPic"
                                style="width: 500px; height: 300px"
                                >
                                <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
                                    {{selectedFoodPic.foodName}}
                                </div>
                            </q-img>
                                <div class="text-h6 text-center q-pa-xs">
                                            FOOD DESCRIPTION<br>
                                    "{{selectedFoodPic.foodDescription}}"
                                </div>
                                <div class="text-h6 text-center q-pa-xs" style="margin-bottom: -20px">
                                    "+{{selectedFoodPic.addedPrice}} per head"
                                </div>
                        <q-card-section>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Ok" v-close-popup />
                    </q-card-actions>
                </q-card>
        </q-dialog>
        <q-dialog v-model="viewCustomFoodPic">
            <q-card style="min-width: 400px">
                            <q-img
                                :src="this.selectedCustomFoodPic.foodPic"
                                style="width: 500px; height: 300px"
                                >
                                <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
                                    {{selectedCustomFoodPic.foodName}}
                                </div>
                            </q-img>
                                <div class="text-h6 text-center q-pa-xs">
                                            FOOD DESCRIPTION<br>
                                    "{{selectedCustomFoodPic.foodDescription}}"
                                </div>
                                <div class="text-h6 text-center q-pa-xs" style="margin-bottom: -20px">
                                    "{{selectedCustomFoodPic.foodTotalPrice}} php per head"
                                </div>
                        <q-card-section>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Ok" v-close-popup />
                    </q-card-actions>
                </q-card>
        </q-dialog>
    <q-dialog v-model="customcashPayment">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Cash Payment</div>
        </q-card-section>

        <q-card-section>
                <div class="q-md row" style="margin-top: -20px">
                    <h5>Total Package Price =</h5><h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{customizeTotalPackPrice}}php</h5>
                </div>
                <div class="q-md row" style="margin-top: -70px">
                    <h5>50% Down Payment =</h5><h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{customizeTotalpackagePriceNaTowithDiscount}}php</h5>
                </div>
                <div class="q-md row" style="margin-top: -70px">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;
                     <h5>Balance =</h5><h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{customtotalPackBalance}}php</h5>
                </div>
                <div>
                     <q-input type="number" v-model="customcashAmount" label="Enter Amount" />
                </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn @click="custompaymentNow = true" flat label="Cancel" v-close-popup />
          <q-btn @click="customCashPackageReservation" label="Reserve Now" />
        </q-card-actions>
      </q-card>
    </q-dialog>

     

    <q-dialog v-model="paymentNow">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Choose Payment</div>
        </q-card-section>

        <q-card-section>
            <div>
                <q-btn @click="cashPayment = true, paymentNow = false" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="CASH" icon="mdi-cash-multiple" />
            </div>
            <div>
                <q-btn class="q-ma-sm" @click="stripePayment = true" align="center" style="width: 400px; height: 50px" color="accent" label="CARD" icon="mdi-account-card-details" />
            </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="stripePayment">
      <q-card style="min-width: 800">
                <q-card-section class="row items-center">
                    <div class="text-h6">Card Payment</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup>
                        <q-tooltip>
                            Cancel
                        </q-tooltip>
                    </q-btn>
                </q-card-section>
                <q-card-section>
                        <strong>Email:</strong>
                        <q-input v-model="emailAdd" type="email" prefix="Email:" suffix="@gmail.com" style="width: 500px; margin-bottom: 10px">
                            <template v-slot:prepend>
                                <q-icon name="mail" />
                            </template>
                        </q-input>
                        <strong>Card Information:</strong>
                        <vue-stripe-elements outline color="teal" class="col-8 q-mx-md q-pa-md full-width" style="" ref="elementsRef" @token="tokenCreated" @loading="loading = $event"></vue-stripe-elements>
                        <q-btn outline color="teal" class="q-pa-sm col-3 full-width" size="md" @click="submit">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{totalpackagePriceNaTowithDiscount}}</b></q-btn>
                            <!-- <h5>TOKEN</h5>
                            {{token}}
                            <h5>CHARGE</h5>
                            {{paydetails}} -->
                </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="cashPayment">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Cash Payment</div>
        </q-card-section>

        <q-card-section>
                <div class="q-md row" style="margin-top: -20px">
                    <h5>Total Package Price =</h5><h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{totalpackagePriceNaTo}}php</h5>
                </div>
                <div class="q-md row" style="margin-top: -70px">
                    <h5>50% Down Payment =</h5><h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{totalpackagePriceNaTowithDiscount}}php</h5>
                </div>
                <div class="q-md row" style="margin-top: -70px">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;
                     <h5>Balance =</h5><h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{totalPackBalance}}php</h5>
                </div>
                <div>
                     <q-input type="number" v-model="cashAmount" label="Enter Amount" />
                </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn @click="paymentNow = true" flat label="Cancel" v-close-popup />
          <q-btn @click="savePackageReservation" label="Reserve Now" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    












  </q-page>
</template>

<script>
import { date } from 'quasar'
import axios from 'axios'
export default {
  name: 'PageIndex',
  data () {
    return {
      showWedding: true,
      hourOptions: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, ],
      viewCustomFoodPic: false,
      datestimeView: date.formatDate(new Date(), '00:00'),
      datestimeEnd: date.formatDate(new Date(), '00:00'),
      customstripePayment: false,
      steppen: 1,
      customFoodSelected: [],
      foodSelected: [],
      loading: false,
      amountCustom: '',
      amount: '',
      token: null,
      charge: null,
      paydetails: null,
      stripePayment: false,
      motifDescripiton: '',
      selectMotif: '',
      Motif: [],
      customcashAmount: 0,
      customcashPayment: false,
      custompaymentNow: false,
      stepNo: 1,
      cashAmount: 0,
      cashPayment: false,
      paymentNow: false,
      viewFoodPic: false,
      viewCustomizeFoodPic: false,
      selectedFoodPic: [],
      selectedCustomFoodPic: [],
      foodToServerList: [],
      selectedInclusion: [],
      packIncDialog: false,
      dessertTable: true,
      drinksTable: true,
      riceTable: true,
      soupTable: true,
      appetizerTable: true,
      opts: this.brgyOptions,
      opt: this.cityOptions,
      savePackInc: [],
      Dishprice: [],
      City: [],
      Brgy: [],
      pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
      S: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]' },
      cols: '',
      Category: [],
      pax: 0,
      amenities: '',
      amenitiesPrice: 0,
      amenitiesQuantity: 0,
      amenitiestotalprice: 0,
      amenitiesAlltotalprice: 0,
      services: '',
      servicesPrice: 0,
      servicesQuantity: 0,
      servicestotalprice: 0,
      servicesAlltotalprice: 0,
      Amenities: [],
      customPackage: false,
      emailAdd: '',
      contactNumber: '',
      additionalList: [],
      servicesList: [],
      Events: [],
      Dish: [],
      Packages: [],
      Food: [],
      Setup: [],
      selectCity: '',
      selectBrgy: '',
      Services: [],
      name: '',
      selectEvent: '',
      clientFName: '',
      clientLName: '',
      address: '',
      step: 1,
      setupselected: [],
      selected: [],
      Reservation: [],
      //dateevents: ['2019/10/01', '2019/10/03', '2019/10/05', '2019/10/06', '2019/10/09', '2019/10/23'],
      columns: [
          { name: 'mainDish', align: 'center', label: 'Choice of Main Dish', field: 'mainDish', sortable: true },
          { name: 'dessert', align: 'center', label: 'Choice of Dessert', field: 'dessert', sortable: true },
          { name: 'drinks', align: 'center', label: 'Choice of Drinks', field: 'drinks', sortable: true },
          { name: 'rice', align: 'center', label: 'Choice of Rice', field: 'rice', sortable: true },
          { name: 'soup', align: 'center', label: 'Choice of Soup', field: 'soup', sortable: true },
          { name: 'appetizer', align: 'center', label: 'Choice of Appetizer', field: 'appetizer', sortable: true },
          { name: 'packInc', label: 'Package Inclusions', field: 'packInc', sortable: true },
          { name: 'totalMinPrice', label: 'Total Package', field: 'totalMinPrice', sortable: true }
      ],
      setupcolumns: [
          { name: 'setupPrice', align: 'center', label: 'Price', field: 'setupPrice', sortable: true },
      ],
      dates: date.formatDate(new Date(), 'YYYY-MM-DD'),
      datesToday: date.formatDate(new Date(), 'YYYY-MM-DD'),
      //dates: new Date(),
      datestime: date.formatDate(new Date(), 'hh:mmA'),
      showAvailable: ''
      
    }
  },
  methods: {
    emailer(){
        var template_params = {
            // "reply_to": "reply_to_value",
            "from_name": 'Ma. Amelia Food Services',
            "to_name": this.emailAdd,
            "reciever_name" : this.clientFName + ' ' + this.clientLName
            // "message_html": "message_html_value"
        }
        // console.log(template_params, 'template')
        // var service_id = "chomigz12_gmail_com";
        var template_id = "reserve";
        emailjs.send('chomigz12_gmail_com', template_id, template_params,'user_iA9XgHo3YuZpLuNUkQ1B7')
        .then(function(response) {
            // console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
            // console.log('FAILED...', error);
            });
    },
    stepcheck(){
        // console.log(this.step, 'step')
        if(this.step === 1){
            // console.log(this.dates, 'dates')
            if(this.datestimeView === this.datestimeEnd){
                 this.$q.dialog({
                    title: `Enable To Continue`,
                    message: 'please fill all requirements',
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok'
                })
            }else{
                this.$refs.stepper.next()
            }
        }else if(this.step === 2){
            if(this.pax < 0 || this.clientFName === '' || this.clientLName === '' || this.address === '' || this.selectBrgy === '' || this.selectCity === '' || this.pax === 0 || this.emailAdd === '' || this.contactNumber === '' || this.selectEvent === ''  || this.selectMotif === ''){
                    this.$q.dialog({
                    title: `Unable To Continue`,
                    message: this.pax < 0 ? ` Pax is a negative value` : `please fill all requirements`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok'
                })
            }else{
                this.$refs.stepper.next()
            }

        }
        else if(this.step === 3){
            if(this.selected.length === 0){
                this.$q.dialog({
                    title: `Enable To Continue`,
                    message: 'Please Select or customize Package',
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok'
                })
            }else{
                this.$refs.stepper.next()
            }
        }else if (this.step === 4){
            if(this.foodSelected.length === 0){
                this.$q.dialog({
                    title: `Enable To Continue`,
                    message: 'Please Select Food',
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok'
                })
            }else{
                this.$refs.stepper.next()
            }
        }else{
                this.paymentNow = true
        }
    },
    openFoodPic (j) {
          this.selectedFoodPic = j 
    },
    openCustomFoodPic (j) {
          this.selectedCustomFoodPic = j 
    },
    checkWedding(){
        // console.log(datess, 'datess')
        let dateBasis = date.formatDate(this.dates, 'YYYY-MM-DD')
        let map = this.$lodash.map(this.Reservation,a=>{
            //console.log(a.clientReserveDate)
            if(a.clientReserveDate == dateBasis){
                if(a.clientSelectEvent !== 'Wedding'){
                    return {
                        eventCheck: 'OrdinaryOccasion',
                        selectEvent: a.clientSelectEvent,
                        reservation: a
                    }
                } else {
                    return {
                    eventCheck: a.clientSelectEvent,
                    selectEvent: a.clientSelectEvent,
                    reservation: a
                }
                }
            } 
        })
        // console.log('map',map)
        let count = this.$lodash.countBy(map,'eventCheck')
        // console.log(count.OrdinaryOccasion, 'countsssssssss')
        // console.log('count',count)
        if(count.OrdinaryOccasion == 2){
            // console.log(count.OrdinaryOccasion, 'countsssssssss')
            // console.log("Wedding is not available on this Date") 
            this.showAvailable = "Wedding is not available on this Date"
            this.showWedding = false
        }else{
            this.showAvailable = "Wedding is available on this Date"
            this.showWedding = true
        }
    },
    stepBackCurry(eventsReserve){
        // console.log(eventsReserve, 'events')
    },
    optionsFn (datess) {
    let dateqw = new Date()
    let eventsOfTheDay = []
    let group = this.$lodash.filter(this.Reservation, a=>{

        let formatDate = date.formatDate(a.clientReserveDate, 'YYYY/MM/DD')    
        if(datess == formatDate){
            // console.log(datess,'may kaparehas')
            if(a.clientSelectEvent !== 'Wedding'){
                eventsOfTheDay.push({eventCheck: 'OrdinaryOccasion'})
                // console.log(output)
            } else {
                eventsOfTheDay.push({eventCheck: a.clientSelectEvent})
            }
        }
    })
    // console.log('eventsOftheDay',eventsOfTheDay)
    let count = this.$lodash.countBy(eventsOfTheDay,'eventCheck')
    // console.log('count',count)
    if(count.Wedding == 2){
        return false
    } else if (count.OrdinaryOccasion == 3){
        return false
    }else if (count.Wedding == 1 && count.OrdinaryOccasion == 1){
        return false
    }
    // console.log('group',group)
    let chuchu = date.formatDate(dateqw, 'YYYY/MM/DD')
    // console.log(datess > chuchu, 'datessssssss')
    if(datess >= chuchu){
        return true
    } 
      
    },
    endtime(){
            // console.log(this.datestime, 'datestime')
            this.datestimeView = date.formatDate(this.datestime, 'hh:mmA')
            
            let newDate = new Date(this.datestime)
            // console.log('asd',this.datestimeView)
            newDate = date.addToDate(newDate, { hours: 5})
            // console.log('end',date.formatDate(new Date(newDate), 'hh:mmA'))
            this.datestimeEnd = date.formatDate(new Date(newDate), 'hh:mmA')
    },
    saveCustomCardPackageReservation(){
                this.$q.loading.show({
                message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>'
                })
                // hiding in 3s
                this.timer = setTimeout(() => {
                this.$q.loading.hide()
                this.timer = void 0
                }, 2000)
            let packageReservation = {
                clientFirstName: this.clientFName,
                clientLastName: this.clientLName,
                clientFullName: this.clientFName + ' ' + this.clientLName,
                clientEventPlace: this.address + ' ' + 'Brgy.' + this.selectBrgy + ' ' + this.selectCity,
                clientPax: this.pax,
                clientEmailAdd: this.emailAdd,
                clientContact: this.contactNumber,
                clientReserveDate: this.dates,
                clientReserveTime: this.datestimeView,
                clientReserveEndTime: this.datestimeEnd,
                clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
                clientSelectEvent: this.selectEvent,
                clientTotalPackPrice: this.customizeTotalPackPrice,
                clientTotalDownPrice: this.customizeTotalpackagePriceNaTowithDiscount,
                clientBalance: parseInt(this.customtotalPackBalance) - parseInt(this.CustomNewAmount),
                clientMotif: this.selectMotif,
                clientMotifDes: this.motifDescripiton,
                clientSelectPackage: 'Customize Package',
                clientFoodSelected: this.customFoodSelected,
                clientPackInc: 'None',
                clientAmenities: this.additionalList,
                clientServices: this.servicesList,
                clientPayDetails: this.paydetailsCustom,
                clientTokenID: this.tokenCustom.id,
                clientPaidAmount: this.CustomNewAmount,
                clientReserveType: 'WALK-IN',
                clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            }
                // console.log(packageReservation, 'ssssss')
                this.$firestoreApp.collection('Reservation').add(packageReservation)
                            this.$q.notify({
                        message: `Reserved!`,
                        type: 'Positive',
                        color: 'positive',
                        textColor: 'white',
                        icon: 'info'
                        })
                        //this.emailer()
                        this.customstripePayment = false
                        this.customPackage = false
                        this.custompaymentNow = false 
                        this.customcashPayment = false
                        this.step = 1
                        this.amenities = ''
                        this.amenitiesPrice = 0
                        this.amenitiesQuantity = 0
                        this.amenitiestotalprice = 0
                        this.services = ''
                        this.servicesPrice = 0
                        this.servicesQuantity = 0
                        this.servicestotalprice = 0
                        this.additionalList = []
                        this.servicesList = []
                        this.selectMotif = ''
                        this.motifDescripiton = ''
                        this.selected = []
                        this.foodSelected = []
                        this.customFoodSelected = []
                        this.clientFName = ''
                        this.clientLName = ''
                        this.address = ''
                        this.selectBrgy = ''
                        this.selectCity = ''
                        this.pax = ''
                        this.contactNumber = ''
                        this.dates = date.formatDate(new Date(), 'YYYY-MM-DD')
                        this.datestime = date.formatDate(new Date(), 'hh:mmA')
                        this.selectEvent = ''
                        
    },
    customCashPackageReservation(){
            let packageReservation = {
                clientFirstName: this.clientFName,
                clientLastName: this.clientLName,
                clientFullName: this.clientFName + ' ' + this.clientLName,
                clientEventPlace: this.address + ' ' + 'Brgy' + this.selectBrgy + ' ' + this.selectCity,
                clientPax: this.pax,
                clientEmailAdd: this.emailAdd,
                clientContact: this.contactNumber,
                clientReserveDate: this.dates,
                clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
                clientReserveTime: this.datestimeView,
                clientReserveEndTime: this.datestimeEnd,
                clientSelectEvent: this.selectEvent,
                clientTotalPackPrice: this.customizeTotalPackPrice,
                clientTotalDownPrice: this.customizeTotalpackagePriceNaTowithDiscount,
                clientBalance: this.customtotalPackBalance,
                clientPaidAmount: this.customcashAmount,
                clientMotif: this.selectMotif,
                clientMotifDes: this.motifDescripiton,
                clientSelectPackage: 'Customize Package',
                clientFoodSelected: this.customFoodSelected,
                clientPackInc: 'None',
                clientAmenities: this.additionalList,
                clientServices: this.servicesList,
                clientPayDetails: 'CASH',
                clientTokenID: 'CASH',
                clientReserveType: 'WALK-IN',
                clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            }
                
                this.$firestoreApp.collection('Reservation').add(packageReservation)
                        //this.emailer()
                        this.customPackage = false
                        this.custompaymentNow = false 
                        this.customcashPayment = false
                        this.step = 1
                        this.amenities = ''
                        this.amenitiesPrice = 0
                        this.amenitiesQuantity = 0
                        this.amenitiestotalprice = 0
                        this.services = ''
                        this.servicesPrice = 0
                        this.servicesQuantity = 0
                        this.servicestotalprice = 0
                        this.additionalList = []
                        this.servicesList = []
                        this.selectMotif = ''
                        this.motifDescripiton = ''
                        this.selected = []
                        this.customFoodSelected = []
                        this.clientFName = ''
                        this.clientLName = ''
                        this.address = ''
                        this.selectBrgy = ''
                        this.selected = []
                        this.foodSelected = []
                        this.selectCity = ''
                        this.pax = ''
                        this.emailAdd = ''
                        this.contactNumber = ''
                        this.dates = date.formatDate(new Date(), 'YYYY-MM-DD')
                        this.datestime = date.formatDate(new Date(), 'hh:mmA')
                        this.selectEvent = ''
                        this.$q.notify({
                            message: `Reserved!`,
                            type: 'Positive',
                            color: 'positive',
                            textColor: 'white',
                            icon: 'info'
                    })
                  
    },
    checkCustomFood(){
        console.log(this.customFoodSelected, 'cfs')
    },
    checkStep(step){
        
    },
    consoleS(checkerName,qty,foods){
        let count = this.$lodash.countBy(this.foodSelected,'checkerName')
        let mapKey = this.$lodash.map(count, function(value, key){
            return {
                checkerName: key, 
                count: value
            }
        })
        let qtyChecker = this.$lodash.filter(mapKey, m => {
            if(checkerName == m.checkerName && qty < m.count){
                console.log('error')
                let last = this.foodSelected.length - 1
                 this.$q.dialog({
                title: 'Max Quantity Reached!',
                message: 'Please Review your Food Selection!',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                     this.foodSelected.splice(last,1)
                })
               
            }
        })
        console.log(mapKey,'map')
        console.log(this.foodSelected, 'ssss')
    },
    checkout () {
        this.$refs.checkoutRef.redirectToCheckout();
        },
        submitCustom () {
        this.$refs.elementsRefCustom.submit()
        },
        tokenCreatedCustom (tokenCustom) {
        this.tokenCustom = tokenCustom;
        // for additional charge objects go to https://stripe.com/docs/api/charges/object
        console.log('token',this.tokenCustom)
        this.chargeCustom = {
            source: tokenCustom.card,
            amount: this.CustomNewAmount,
        }
        this.sendTokenToServerCustom(this.chargeCustom)
        },
        sendTokenToServerCustom(chargeCustom) {
        // Send to server
        this.paydetailsCustom = chargeCustom
        console.log('charge',chargeCustom)
        //this.emailer()
        this.saveCustomCardPackageReservation()
        
        
    },

    checkout () {
        this.$refs.checkoutRef.redirectToCheckout();
        },
        submit () {
        this.$refs.elementsRef.submit()
        },
        tokenCreated (token) {
        this.token = token;
        // for additional charge objects go to https://stripe.com/docs/api/charges/object
        console.log('token',this.token)
        this.charge = {
            source: token.card,
            amount: this.NewAmount,
        }
        this.sendTokenToServer(this.charge)
        },
        sendTokenToServer (charge) {
        // Send to server
        this.paydetails = charge
        console.log('charge',charge)
        this.saveCardPackageReservation()
        //this.emailer()
    },
    openFoodPic (props) {
          this.selectedFoodPic = props 
    },
    openInclusion (props) {
                this.selectedInclusion = props 
    },
    filterFns (val, update) {
            if (val === '') {
                update(() => {
                this.opts = this.brgyOptions
                })
                return
            }

        update(() => {
                const needle = val.toLowerCase()
                this.opts = this.brgyOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            })
    },
    filterFn (val, update) {
            if (val === '') {
                update(() => {
                this.opt = this.cityOptions
                })
                return
            }

        update(() => {
                const needle = val.toLowerCase()
                this.opt = this.cityOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            })
    },
    savePackageReservation(){
                 this.$q.loading.show({
                message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>'
                })
            // hiding in 3s
                this.timer = setTimeout(() => {
                this.$q.loading.hide()
                this.timer = void 0
                }, 2000)
                this.$q.notify({
                    message: `Reserved!`,
                    type: 'positive',
                    color: 'positive',
                    textColor: 'white',
                    icon: 'info'
                })
            let selectedPackage = Object.assign({}, this.selected[0])
            let packageKey = this.selected[0]['.key']
            console.log('selectedPackage',selectedPackage)
            delete selectedPackage['.key']
            selectedPackage.packageKey = packageKey
           
            // let saveMainDishRemoveKey = this.$lodash.map(this.saveMainDish, a=>{
            //     let key = a['.key']
            //     let selectedDish = Object.assign({}, a)
            //     delete selectedDish['.key']
            //     selectedDish.dishKey = key
            //     return selectedDish
            // })
            // console.log('saveMainDishRemoveKey',saveMainDishRemoveKey)
            let packageReservation = {
                clientFirstName: this.clientFName,
                clientLastName: this.clientLName,
                clientFullName: this.clientFName + ' ' + this.clientLName,
                clientEventPlace: this.address + ' ' + 'Brgy' + this.selectBrgy + ' ' + this.selectCity,
                clientPax: this.pax,
                clientEmailAdd: this.emailAdd,
                clientContact: this.contactNumber,
                clientReserveDate: this.dates,
                clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
                clientReserveTime: this.datestimeView,
                clientReserveEndTime: this.datestimeEnd,
                clientSelectEvent: this.selectEvent,
                clientTotalPackPrice: this.totalpackagePriceNaTo,
                clientTotalDownPrice: this.totalpackagePriceNaTowithDiscount,
                clientBalance: this.totalPackBalance,
                clientPaidAmount: this.cashAmount,
                clientMotif: this.selectMotif,
                clientMotifDes: this.motifDescripiton,
                clientSelectPackage: this.selected[0],
                clientFoodSelected: this.foodSelected,
                clientPackInc: this.ListofInclusion,
                clientAmenities: this.additionalList,
                clientServices: this.servicesList,
                clientPayDetails: 'CASH',
                clientTokenID: 'CASH',
                clientReserveType: 'WALK-IN',
                clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            }
                this.$firestoreApp.collection('Reservation').add(packageReservation)
                        //this.emailer();
                        this.step = 1
                        this.paymentNow = false 
                        this.cashPayment = false
                        this.amenities = ''
                        this.amenitiesPrice = 0
                        this.amenitiesQuantity = 0
                        this.amenitiestotalprice = 0
                        this.services = ''
                        this.servicesPrice = 0
                        this.servicesQuantity = 0
                        this.servicestotalprice = 0
                        this.additionalList = []
                        this.servicesList = []
                        this.selectMotif = ''
                        this.motifDescripiton = ''
                        this.selected = []
                        this.foodSelected = []
                        this.customFoodSelected = []
                        this.selected = []
                        this.clientFName = ''
                        this.clientLName = ''
                        this.address = ''
                        this.selectBrgy = ''
                        this.selectCity = ''
                        this.pax = ''
                        this.emailAdd = ''
                        this.contactNumber = ''
                        this.dates = date.formatDate(new Date(), 'YYYY-MM-DD')
                        this.datestime = date.formatDate(new Date(), 'hh:mmA')
                        this.selectEvent = ''
    },
    saveCardPackageReservation(){
            let selectedPackage = Object.assign({}, this.selected[0])
            let packageKey = this.selected[0]['.key']
            console.log('selectedPackage',selectedPackage)
            delete selectedPackage['.key']
            selectedPackage.packageKey = packageKey
           
            // let saveMainDishRemoveKey = this.$lodash.map(this.saveMainDish, a=>{
            //     let key = a['.key']
            //     let selectedDish = Object.assign({}, a)
            //     delete selectedDish['.key']
            //     selectedDish.dishKey = key
            //     return selectedDish
            // })
            // console.log('saveMainDishRemoveKey',saveMainDishRemoveKey)
            let packageReservation = {
                clientFirstName: this.clientFName,
                clientLastName: this.clientLName,
                clientFullName: this.clientFName + ' ' + this.clientLName,
                clientEventPlace: this.address + ' ' + 'Brgy.' + this.selectBrgy + ' ' + this.selectCity,
                clientPax: this.pax,
                clientEmailAdd: this.emailAdd,
                clientContact: this.contactNumber,
                clientReserveDate: this.dates,
                clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
                clientReserveTime: this.datestimeView,
                clientReserveEndTime: this.datestimeEnd,
                clientSelectEvent: this.selectEvent,
                clientTotalPackPrice: this.totalpackagePriceNaTo,
                clientTotalDownPrice: this.totalpackagePriceNaTowithDiscount,
                clientBalance: parseInt(this.totalPackBalance) - parseInt(this.NewAmount),
                clientMotif: this.selectMotif,
                clientMotifDes: this.motifDescripiton,
                clientSelectPackage: this.selected[0],
                clientFoodSelected: this.foodSelected,
                clientPackInc: this.ListofInclusion,
                clientAmenities: this.additionalList,
                clientServices: this.servicesList,
                clientPayDetails: this.paydetails,
                clientTokenID: this.token.id,
                clientPaidAmount: this.NewAmount,
                clientReserveType: 'WALK-IN',
                clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            }
                console.log(packageReservation, 'ssssss')
                this.$q.loading.show({
                message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>'
                })
                
                this.$firestoreApp.collection('Reservation').add(packageReservation)
                //this.emailer()
                this.paymentNow = false 
                this.stripePayment = false
                this.step = 1
                // hiding in 3s
                this.timer = setTimeout(() => {
                this.$q.loading.hide()
                this.timer = void 0
                }, 3000)
                this.$q.notify({
                    message: `Reserved!`,
                    type: 'positive',
                    color: 'positive',
                    textColor: 'white',
                    icon: 'info'
                    })
                        this.amenities = ''
                        this.amenitiesPrice = 0
                        this.amenitiesQuantity = 0
                        this.amenitiestotalprice = 0
                        this.services = ''
                        this.servicesPrice = 0
                        this.servicesQuantity = 0
                        this.servicestotalprice = 0
                        this.additionalList = []
                        this.servicesList = []
                        this.selectMotif = ''
                        this.motifDescripiton = ''
                        this.selected = []
                        this.foodSelected = []
                        this.customFoodSelected = []
                        this.clientFName = ''
                        this.clientLName = ''
                        this.address = ''
                        this.selectBrgy = ''
                        this.selectCity = ''
                        this.pax = ''
                        this.emailAdd = ''
                        this.contactNumber = ''
                        this.dates = date.formatDate(new Date, 'YYYY-MM-DD')
                        this.datestime = date.formatDate(new Date(), 'hh:mmA')
                        this.selectEvent = ''
                    
    },
    consoleselected(){
                // console.log(this.selected, 'eventssss')
    },
    saveNewPackInc(){
            let packIncsave = this.$lodash.concat(this.setupselected)
            // console.log(packIncsave, 'savess')
            if(packIncsave.length > parseInt(this.packageOptions.packInc)){
                    this.$q.dialog({
                    title: 'You reached the Quantity of Package Inclusion!',
                    message: 'Unable to select!!!',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => { 
                        this.setupselected = []
                        let packIncsaveS = this.$lodash.concat(this.setupselected)
                        // console.log(packIncsaveS, 'savess')
                        this.savePackInc = packIncsaveS
                    })
                }else{
                this.savePackInc = packIncsave
                }
    },
    deleteAdditionalTask(index){
                this.additionalList.splice(index, 1)
                this.amenities = ''
                this.amenitiesPrice = '0'
                this.amenitiesQuantity = '0'
                this.amenitiestotalprice = '0' 
    },
    addAdditionalList(){
            if(this.amenitiesQuantity === 0 || this.amenities === '' || this.amenitiesQuantity === '0' || this.amenitiesQuantity < 0){
                    this.$q.dialog({
                    title: `please fill all requirements or you have negative values`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok'
                })
            }else{
                    var additional = {
                    amenitiesNames: this.amenities,
                    amenitiesPrices: parseInt(this.amenitiesPrice),    
                    amenitiesQuantities: parseInt(this.amenitiesQuantity),
                    amenitiesTotalPrices: parseInt(this.amenitiestotalprice)
                    }
                    let index = this.$lodash.findIndex(this.additionalList, a => {
                            return a.amenitiesNames == this.amenities
                    })
                    // console.log(index, 'adds')
                    if(index === -1){
                        this.additionalList.push(additional)
                    }else{
                        let tempArray = this.additionalList[index]
                        // console.log(tempArray, 'temp')
                            var additionals = {
                            amenitiesNames: this.amenities,
                            amenitiesPrices: parseInt(this.amenitiesPrice),
                            amenitiesQuantities: parseInt(this.amenitiesQuantity) + parseInt(tempArray.amenitiesQuantities),
                            amenitiesTotalPrices: parseInt(this.amenitiestotalprice) + parseInt(tempArray.amenitiesTotalPrices)
                    }
                        // console.log(additionals, 'addsss')
                        this.additionalList[index].amenitiesNames = additionals.amenitiesNames 
                        this.additionalList[index].amenitiesPrices = additionals.amenitiesPrices
                        this.additionalList[index].amenitiesQuantities = additionals.amenitiesQuantities
                        this.additionalList[index].amenitiesTotalPrices = additionals.amenitiesTotalPrices
                        // console.log(this.additionalList[index], 'index')
                    }

            }
            
            
           
    },
    totalQprice(){      
                        this.amenitiestotalprice = parseInt(this.amenitiesPrice) * parseInt(this.amenitiesQuantity)
                },
    amenitiesPriceOptions(){ 
                   let optionss = this.$lodash.filter(this.Amenities, m => {
						return m.amenitiesName == this.amenities 
                    })    
                        // console.log(optionss, 'ss')
                        this.amenitiesPrice = optionss[0].price
                        this.amenitiesQuantity = 0
                        this.amenitiestotalprice = 0
                },
    addServicesList(){
            let optionss = this.$lodash.filter(this.servicesList, m => {
                    if(m.servicesNames === this.services){
                        return m
                    }
                }) 
            if(this.servicesQuantity === 0 || this.services === '' || this.servicesQuantity === '0' || this.servicesQuantity < 0){
                    this.$q.dialog({
                    title: `please fill all requirements or you have negative values`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok'
                })
            }else{
                if(optionss.length > 0){
                        this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Are you sure you want to add same Service??',
                    ok: 'Ok',
                    cancel: 'Cancel',
                    persistent: true
                    }).onOk(() => {
                        var services = {
                    servicesNames: this.services,
                    servicesPrices: parseInt(this.servicesPrice),
                    servicesQuantities: parseInt(this.servicesQuantity),
                    servicesTotalPrices: parseInt(this.servicestotalprice)
                    }
                    let index = this.$lodash.findIndex(this.servicesList, a => {
                            return a.servicesNames == this.services
                    })
                    if(index === -1){
                        this.servicesList.push(services)
                    }else{
                        let tempArray = this.servicesList[index]
                        var servicess = {
                            servicesNames: this.services,
                            servicesPrices: parseInt(this.servicesPrice),
                            servicesQuantities: parseInt(this.servicesQuantity) + parseInt(tempArray.servicesQuantities),
                            servicesTotalPrices: parseInt(this.servicestotalprice) + parseInt(tempArray.servicesTotalPrices)
                        }
                            // console.log(servicess, 'addsss')
                            this.servicesList[index].servicesNames = servicess.servicesNames 
                            this.servicesList[index].servicesPrices = servicess.servicesPrices
                            this.servicesList[index].servicesQuantities = servicess.servicesQuantities
                            this.servicesList[index].servicesTotalPrices = servicess.servicesTotalPrices
                            // console.log(this.servicesList[index], 'index')
                    }

                    }).onCancel(() => {

                    })
                }else{
                        var services = {
                    servicesNames: this.services,
                    servicesPrices: parseInt(this.servicesPrice),
                    servicesQuantities: parseInt(this.servicesQuantity),
                    servicesTotalPrices: parseInt(this.servicestotalprice)
                    }
                    let index = this.$lodash.findIndex(this.servicesList, a => {
                            return a.servicesNames == this.services
                    })
                    if(index === -1){
                        this.servicesList.push(services)
                    }else{
                        let tempArray = this.servicesList[index]
                        var servicess = {
                            servicesNames: this.services,
                            servicesPrices: parseInt(this.servicesPrice),
                            servicesQuantities: parseInt(this.servicesQuantity) + parseInt(tempArray.servicesQuantities),
                            servicesTotalPrices: parseInt(this.servicestotalprice) + parseInt(tempArray.servicesTotalPrices)
                        }
                            // console.log(servicess, 'addsss')
                            this.servicesList[index].servicesNames = servicess.servicesNames 
                            this.servicesList[index].servicesPrices = servicess.servicesPrices
                            this.servicesList[index].servicesQuantities = servicess.servicesQuantities
                            this.servicesList[index].servicesTotalPrices = servicess.servicesTotalPrices
                            // console.log(this.servicesList[index], 'index')
                    }

                }

                    
            }
            
        },
    totalSprice(){      
                        this.servicestotalprice = parseInt(this.servicesPrice) * parseInt(this.servicesQuantity)
                },
    deleteServicesTask(index){
                this.servicesList.splice(index, 1) 
                this.services = ''
                this.servicesPrice = '0'
                this.servicesQuantity = '0'
                this.servicestotalprice = '0'
    },           
    servicesPriceOptions(){ 
                   let optionss = this.$lodash.filter(this.Services, m => {
						return m.servicesName == this.services 
                    })    
                        // console.log(optionss, 'ss')
                        this.servicesPrice = optionss[0].servicesPrice
                        this.servicesQuantity = 0
                        this.servicestotalprice = 0
    },
    motifdes(){ 
                   let optionss = this.$lodash.filter(this.Motif, m => {
						return m.motifName == this.selectMotif 
                    })    
                        // console.log(optionss, 'ss')
                        this.motifDescripiton = optionss[0].description
    },            
    foodprice(){ 
                   let optionss = this.$lodash.filter(this.Food, m => {
						return m.category == this.selectFoodCategory && m.foodName == this.selectFoodName
                    })    
                        // console.log(optionss, 'ss')
                        this.foodPrice = optionss[0].foodPrice
                },
    // onClickDate (value, reason, details){
    //   console.log(value, 'value')
    //   console.log(reason, 'reason')
    //   console.log(details, 'details')
    //   this.$router.push(`/schedule/${value}`)

    //   var test = {
    //     date: new Date(this.date)
    //   }
    //   console.log(test, 'test')
    // },
    test(){
        let optionss = this.$lodash.countBy(this.beefselected,'category')    
            
        // console.log(optionss, 'sss')
    }
  },
  mounted () {
    this.$binding('Motif', this.$firestoreApp.collection('Motif'))
            .then(Motif => {
            // console.log(Motif, 'Motif')
        }),
    this.$binding('Amenities', this.$firestoreApp.collection('Amenities'))
            .then(Amenities => {
            console.log(Amenities, 'Amenities')
        }),
    this.$binding('Setup', this.$firestoreApp.collection('Setup'))
            .then(Setup => {
            console.log(Setup, 'Setup')
        }),
    this.$binding('Category', this.$firestoreApp.collection('Category'))
            .then(Category => {
            // console.log(Category, 'Category')
        }),
    this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            // console.log(Food, 'Food')
        }),
    this.$binding('Events', this.$firestoreApp.collection('Events'))
            .then(Events => {
            // console.log(Events, 'Events')
            }),
    this.$binding('Packages', this.$firestoreApp.collection('Packages'))
            .then(Packages => {
            // console.log(Packages, 'Packages')
            })
    this.$binding('Dish', this.$firestoreApp.collection('Dish'))
            .then(Dish => {
            // console.log(Dish, 'Dish')
            }),
    this.$binding('Services', this.$firestoreApp.collection('Services'))
            .then(Services => {
            // console.log(Services, 'Services')
            }),
    this.$binding('Dishprice', this.$firestoreApp.collection('Dishprice'))
            .then(Dishprice => {
            // console.log(Dishprice, 'Dishprice')
            }),
    this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            // console.log(Reservation, 'Reservation')
            }),
    this.$binding('City', this.$firestoreApp.collection('City'))
        .then(City => {
        //   console.log(City, 'City')
        }),
    this.$binding('Brgy', this.$firestoreApp.collection('Brgy'))
        .then(Brgy => {
        //   console.log(Brgy, 'Brgy')
        })
  },
  created(){
    let self = this
    this.$firebase.auth().onAuthStateChanged(function(user){
    //   console.log()('createdUser', user)
      if(user){
        self.$router.push('/home')
      }else{
        self.$router.push('/')
      }
    })
  },
  computed: {
    plusTwenty(){
        if(this.pax <= 99){
            return 20
        }else{
            return 0
        }
    },
    paxlesshundred(){
        if(this.pax === 0){
            return 0
        }else{
            let sum = parseInt(this.plusTwenty) * parseInt(this.pax)
                    return sum
        }
    },
    cpPriceTotal(){
        let pricePH = this.$lodash.sum([parseInt(this.additionalPrice),parseInt(this.servicesPrices)])
        // console.log(pricePH, 'price')
        return pricePH
    },
    cpPrice(){
        if(this.customFoodSelected.length === 0){
            return 0
        }else{
        let sum = this.$lodash.sumBy(this.customFoodSelected, 'foodTotalPrice')
        // console.log(sum, 'sum')
        return sum
        }
    },
    ListofInclusion(){
        if(this.selected.length !== 0){
            return this.selected[0].packageInclusion
        }else{
            return []
        }
    },
    customListofFood(){
        let foodList = this.$lodash.filter(this.Food, f => {
            f.checkerName = f.dishType + '/' + f.category
            return f
        })
        let groupFood = this.$lodash.groupBy(foodList, 'checkerName')
        let mapKey = this.$lodash.map(groupFood, function(value, key){
            let newDish = key.toString().split("/")
            return {
                dishType: newDish[0], 
                category: newDish[1],
                food: value
            }
        })

        // console.log(mapKey, 'mapKEy')
        return mapKey
        
        
    },
    ListOfFood(){
        let FoodSave = []
        if(this.selected.length !== 0){
        let selectedPackage = {...this.selected[0]}
        delete selectedPackage['.key']
        // console.log(selectedPackage, 'newSP')
        let types = selectedPackage.dishType
        // console.log(types, 'sp')
        let foodCateg = []
        for(var x=0;x<types.length;x++){
            let dish = types[x]
            let dishType = types[x].dishName
            // console.log('dish',dish)
            for(var y=0;y<dish.category.length;y++){
                let categoryName = dish.category[y].category
                let categQty = dish.category[y].qty
                let categMaxPrice = dish.category[y].maxPrice
                
                let filter = this.$lodash.filter(this.Food,a=>{
                    if(a.dishType == dishType && a.category == categoryName){
                        a.categQty = categQty
                        a.categMaxPrice = categMaxPrice
                        a.checkerName = dishType + ' ' + categoryName
                        foodCateg.push(a)
                    }
                })
            }
        }
        for(var z=0;z<foodCateg.length;z++){
            let check = foodCateg[z]
            // console.log('check',check)
            let index = this.$lodash.findIndex(FoodSave, function(o) { return o.checkerName == check.checkerName; });
            // console.log(index,'index')
            if(FoodSave !== []){
                if(index > -1){
                //  let categIndex = this.$lodash.findIndex(FoodSave, function(o) { return o.dishName == check.dishType; });
                FoodSave[index].foods.push(foodCateg[z])
                }else{
                FoodSave.push({categoryQty:foodCateg[z].categQty, categoryName:foodCateg[z].category,checkerName:foodCateg[z].checkerName,dishName:foodCateg[z].dishType,foods:[foodCateg[z]]})    
                }
                // FoodSave.push({dishName:foodCateg[x].dishType,foods:[foodCateg[x]]})
            }else{
                FoodSave.push({categoryQty:foodCateg[z].categQty, categoryName:foodCateg[z].category,checkerName:foodCateg[z].checkerName,dishName:foodCateg[z].dishType,foods:[foodCateg[z]]})                
            }
        }
        // console.log('foodCateg',foodCateg)
        // console.log('foods',FoodSave)
        return FoodSave
        } else {
            return []
        }
        
    },
    
    NewAmount(){
        if(this.totalpackagePriceNaTowithDiscount === '' && this.totalpackagePriceNaTowithDiscount === 0){
            return 0
        }else{
            this.amount = this.totalpackagePriceNaTowithDiscount
            return this.amount
        }
    },
    CustomNewAmount(){
        if(this.customizeTotalpackagePriceNaTowithDiscount === '' && this.customizeTotalpackagePriceNaTowithDiscount === 0){
            return 0
        }else{
            this.amountCustom = this.customizeTotalpackagePriceNaTowithDiscount
            return this.amountCustom
        }
    },
    totalcustomPackPrice(){      
                    if(this.packageOptions.packagePrice === 0 && this.pax === 0){
                        return 0
                    }else{
                    let sum = parseInt(this.pax) * parseInt(this.cpPrice)
                    return sum
                    }
    },
    totalPackPrice(){      
                    if(this.packageOptions.packagePrice === 0 && this.pax === 0){
                        return 0
                    }else{
                    let sum = parseInt(this.pax) * parseInt(this.packageOptions.packagePrice)
                    return sum
                    }
    },
    cityOptions(){
                let options = this.City.map(City => {
                    return City.city
                })
                return options
    },
    brgyOptions(){
                let options = this.Brgy.map(Brgy => {
                    return Brgy.brgy   
                })
                return options
    },
    packagePricePerHead(){
        let pricePH = this.$lodash.sum([this.mainDishPrice,this.dessertPrice,this.drinksPrice,this.ricePrice,this.soupPrice,this.appetizerPrice])
        // console.log(pricePH, 'price')
        return pricePH
    },
    totalPackagePricePerHead(){
        let priceTPH = this.$lodash.sum([this.mainDishPrice,this.dessertPrice,this.drinksPrice,this.ricePrice,this.soupPrice,this.appetizerPrice,this.additionalPrice,this.additionalPrice,this.servicesPriceAll])
        // console.log(priceTPH, 'price')
        return priceTPH
    },
    packageOptions(){
        if(this.selected.length === 0){
                return 0
        }else{
            return this.selected[0]
        }
    },
    amenitiesOptions(){
                let options = this.Amenities.map(Amenities => {
                    return {
                        label: Amenities.amenitiesName,
                        value: Amenities.amenitiesName
                    }
                })

                return options
            },
    motifOptions(){
                let options = this.Motif.map(Motif => {
                    return {
                        label: Motif.motifName,
                        value: Motif.motifName
                    }
                })

                return options
            },
    servicesOptions(){
                let options = this.Services.map(Services => {
                    return {
                        label: Services.servicesName,
                        value: Services.servicesName
                    }
                })

                return options
            },
    eventOptions(){
                 let options = this.Events.map(Events => {
                        return {
                            label: Events.event,
                            value: Events.event
                        }
                    })
                if(this.showWedding === true){
                    return options
                }else{
                     let notWedding = this.$lodash.filter(options, m => {
                         return m.value !== 'Wedding'
                     })
                        return notWedding
                }
                
            },
    eventpackages(){ 
                   let optionss = this.$lodash.filter(this.Packages, m => {
						return m.eventName == this.selectEvent
                    })    
                return optionss
            },
    // additionalList sum and new data 
    additionalPrice() {
                    if(this.additionalList.length === 0){
                        return 0
                    }else{
                    let sum = this.$lodash.sumBy(this.additionalList, 'amenitiesTotalPrices')
                    // console.log(sum, 'sum')
                    return sum
                    }
    },
    additionalListNew() {
                    return this.additionalList
    },
    //servicesList sum and new data
    servicesListNew() {
                    return this.servicesList
    },
    servicesPrices() {
                    if(this.servicesList.length === 0){
                        return 0
                    }else{
                    let sum = this.$lodash.sumBy(this.servicesList, 'servicesTotalPrices')
                    // console.log(sum, 'sum')
                    return sum
                    }
    },
    addedFoodPricePerHead() {
                    if(this.foodSelected.length === 0){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let sum = this.$lodash.sumBy(this.foodSelected, a => { 
                        return parseInt(a.addedPrice)
                        })  
                    // console.log(sum, 'sum')
                    return sum
                    }
    },
    additionalPrice() {
                    if(this.additionalListNew.length === 0){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let sum = this.$lodash.sumBy(this.additionalListNew, a => { 
                        return parseInt(a.amenitiesTotalPrices)
                        })
                    // console.log(sum, 'sum')
                    return sum
                    }
    },
    servicesPriceAll() {
                    if(this.servicesListNew.length === 0){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let sum = this.$lodash.sumBy(this.servicesListNew, a => { 
                        return parseInt(a.servicesTotalPrices)
                        })
                    // console.log(sum, 'sum')
                    return sum
                    }
    },
    totalAdditionalPrice() {
                    if(this.servicesPriceAll === 0 && this.additionalPrice === 0){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let totalAP = this.$lodash.sum([parseInt(this.additionalPrice),parseInt(this.servicesPriceAll)])
                    // console.log(totalAP, 'price')
                    return totalAP
                    }
    },
    customtotalPackBalance() {
                    if(this.customizeTotalPackPrice === 0 && this.customcashAmount === '' && this.customcashAmount === 0){
                        return 0
                    }else{
                    let sum = parseInt(this.customizeTotalPackPrice) - parseInt(this.customcashAmount)
                    return sum
                    }
    },
    totalpackagePriceNaTo() {
                    if(this.totalPackPrice === 0 && this.totalAdditionalPrice === 0 && this.addedFoodPricePerHead === 0 && this.paxlesshundred === 0){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let totalAP = this.$lodash.sum([parseInt(this.totalPackPrice),parseInt(this.totalAdditionalPrice),parseInt(this.addedFoodPricePerHead),parseInt(this.paxlesshundred)])
                    // console.log(totalAP, 'price')
                    return totalAP
                    }
    },
    customizeTotalPackPrice() {
                    if(this.totalcustomPackPrice === 0 && this.totalAdditionalPrice === 0 && this.paxlesshundred === 0 ){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let totalAP = this.$lodash.sum([parseInt(this.totalcustomPackPrice),parseInt(this.totalAdditionalPrice),parseInt(this.paxlesshundred)])
                    // console.log(totalAP, 'price')
                    return totalAP
                    }
    },
    totalpackagePriceNaTowithDiscount() {
                    if(this.totalpackagePriceNaTo === 0){
                        return 0
                    }else{
                    let sum = .50 * parseInt(this.totalpackagePriceNaTo)
                    return sum
                    }
    },
    customizeTotalpackagePriceNaTowithDiscount() {
                    if(this.customizeTotalPackPrice === 0){
                        return 0
                    }else{
                    let sum = .50 * parseInt(this.customizeTotalPackPrice)
                    return sum
                    }
    },
    totalPackBalance() {
                    if(this.totalpackagePriceNaTo === 0){
                        return 0
                    }else{
                    let sum = parseInt(this.totalpackagePriceNaTo) - parseInt(this.cashAmount)
                    return sum
                    }
    },
    eventsReserve(){
            let events = this.$lodash.map(this.Reservation, a=>{
                let reserve = a.clientReserveDate
                return date.formatDate(reserve,'YYYY/MM/DD')
            })
            return events
        },
    cityOpt(){
                    let optionss = this.$lodash.filter(this.Brgy, m => {
                            return m.brgy == this.selectBrgy    
                        })
                        let opt = this.$lodash.map(optionss, n => {
                            return { label: n.city, value: n.city }
                        })
                        return opt
            },
  }
}
</script>