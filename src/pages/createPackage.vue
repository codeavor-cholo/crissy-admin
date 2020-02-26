<template>
    <q-page padding>
        <div class="row q-pa-md">
            <q-card class="my-card col-7 q-pa-md" flat style="border-radius: 20px;">
                <q-card-section>
                    <div class="row justify-between">
                        <div class="text-h6 col">Create Package</div>
                        <div class="text-h6 text-orange-8 col text-right text-weight-bold" style="font-size:1.8em;">
                            <q-icon name="arrow_right" /> {{packageName}} </div>
                    </div>
                    
                </q-card-section>
                <q-card-section>

                    <q-stepper
                        v-model="step"
                        ref="stepper"
                        color="orange-8"
                        done-color="teal"
                        active-color="orange-8"
                        animated
                        vertical
                        flat
                    >
                        <q-step
                            :name="1"
                            title="Select package type and event type"
                            icon="settings"
                            :done="step > 1"
                        >
                            <q-input v-model="packageName" type="text" label="Enter Package Name" rounded color="orange-8" outlined="" class="q-mt-md" style="width:300px;"/>
                           <q-select v-model="packageType" :options="packageOptions"  rounded color="orange-8" outlined="" class="q-mt-md" style="width:300px;" label="Select Package type"/>
                            <q-select v-model="event" :options="eventOpt" emit-value="" map-options="" rounded color="orange-8" outlined="" class="q-mt-md" style="width:300px;" label="Select Event type"/>

                        </q-step>

                        <q-step
                            :name="2"
                            title="Enter Fixed Pax"
                            icon="people"
                            :done="step > 2"
                            v-show="packageType == 'FIXED'"
                        >
                            <div class="row">
                                <span class="col-4 q-pa-md text-weight-bold" style="font-size:1.2em;">Fixed Pax (Adult)</span>
                                <q-input v-model="pax" type="number" label="# of Pax" class="col" outlined="" rounded="" style="max-width:150px;" color="orange-8"/>
                            </div>
                            <div class="row q-mt-md">
                                <q-checkbox v-model="withKid" class="col-1 q-mt-sm text-weight-bold" color="orange-8" @input="checkIfOff"/>
                                <span class="col q-py-md text-weight-bold text-left text-orange-8" style="font-size:1.2em;" v-if="withKid != true">Does package include kids?</span>
                                <span class="col-3 q-py-md text-weight-bold text-left" style="font-size:1.2em;" v-else>Fixed Pax (Kids)</span>
                                <q-input v-model="kidPax" color="orange-8" type="number" label="# of Pax" class="col" outlined="" rounded="" style="max-width:150px;" v-show="withKid == true"/>
                                <span class="col q-ml-md q-py-md text-weight-bold text-left" style="font-size:1.2em;" v-show="withKid == true">Discount Rate</span>
                                <q-input v-model="kidDiscount" color="orange-8" type="number" class="col" outlined="" rounded="" style="max-width:150px;" suffix="%" v-show="withKid == true"/>
                            </div>
                        </q-step>

                        <!-- for per pax -->
                        <q-step
                            :name="3"
                            title="Select Food Choices"
                            icon="fastfood"
                            :done="step > 3"
                        >
                        <div class="q-pa-md " >
                            <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Select Category
                                </span>
                            </div>
                            <div class="q-gutter-xs q-mt-sm">
                                <!-- <q-checkbox v-model="selectedFood" :val="i" :label="i.category+' ('+ i.min +' php)'" color="orange-8" v-for="(i, index) in this.mergeData" :key="index" @input="checkIfRemoved(i.category)"/> -->
                                <q-select
                                    v-model="selectedFood"
                                    :options="returnOptMerge"
                                    emit-value=""
                                    map-options=""
                                    multiple=""
                                    label="Category (Multiple Selection)"
                                    color="orange-8"
                                    class="q-pa-sm"
                                    outlined=""
                                    @input="checkInput('food')"
                                    menu-anchor="bottom center"
                                >
                                    <template v-slot:selected-item="scope">

                                    <q-chip
                                        removable
        
                                        @remove="scope.removeAtIndex(scope.index),checkIfRemoved(scope.opt.label)"
                                        :tabindex="scope.tabindex"
                                        color="orange-8"
                                        text-color="white"
                                        size="1.2em"
                                        class="q-mt-sm"
                                    >
                                        {{ scope.opt.label }}
                                    </q-chip>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="q-pa-md q-mt-md bg-grey-3" v-show="selectedFood.length != 0">
                              <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Enter Quantity
                                </span>
                                    <div class="row" v-for="(i, index) in this.selectedFood" :key="index">
                                        <span class="col-4 text-right q-pa-md q-mt-sm" style="font-size:1.1em;">{{i.category+' ('+ i.min +' Pesos)'}}</span>
                                        <div class="col" style="max-width:200px"><q-input color="orange-8" outlined="" rounded="" class="q-ma-sm q-mr-lg text-h6" type="number" min="0" v-model="viandsQty[i.category]" placeholder="Qty"/></div>
                                    </div>
                            </div>                          
                        </div>
                            
                        </q-step>
                        <!-- for per pax -->
                        <q-step
                            :name="4"
                            title="Select Inclusions"
                            icon="star"
                            :done="step > 4"
                        >
                                <q-select
                                    v-model="selectedInclusions"
                                    :options="mapInclusions"
                                    emit-value=""
                                    map-options=""
                                    multiple=""
                                    label="Inclusions (Multiple Selection)"
                                    color="orange-8"
                                    class="q-pa-sm"
                                    outlined=""
                                    @input="checkInput('inclusion')"
                                    menu-self="bottom center"
                                >
                                    <template v-slot:selected-item="scope">

                                    <q-chip
                                        removable
        
                                        @remove="scope.removeAtIndex(scope.index)"
                                        :tabindex="scope.tabindex"
                                        color="orange-8"
                                        text-color="white"
                                        size="1.2em"
                                        class="q-mt-sm"
                                    >
                                        {{ scope.opt.label }}
                                    </q-chip>
                                    </template>
                                </q-select>
                        </q-step>
                        <q-step
                            :name="5"
                            title="Select Services"
                            icon="local_shipping"
                            :done="step > 5"
                            v-show="packageType == 'FIXED'"
                        >
                        <div class="q-pa-md " >
                            <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Select Services
                                </span>
                            </div>
                            <div class="q-gutter-xs q-mt-sm">
                                <!-- <q-checkbox v-model="selectedFood" :val="i" :label="i.category+' ('+ i.min +' php)'" color="orange-8" v-for="(i, index) in this.mergeData" :key="index" @input="checkIfRemoved(i.category)"/> -->
                                <q-select
                                    v-model="selectedServices"
                                    :options="mapServices"
                                    emit-value=""
                                    map-options=""
                                    multiple=""
                                    label="Services (Multiple Selection)"
                                    color="orange-8"
                                    class="q-pa-sm"
                                    outlined=""
                                    @input="checkInput('services')"
                                    menu-anchor="bottom center"
                                >
                                    <template v-slot:selected-item="scope">

                                    <q-chip
                                        removable
        
                                        @remove="scope.removeAtIndex(scope.index),checkIfRemovedServices(scope.opt.label)"
                                        :tabindex="scope.tabindex"
                                        color="orange-8"
                                        text-color="white"
                                        size="1.2em"
                                        class="q-mt-sm"
                                    >
                                        {{ scope.opt.label }}
                                    </q-chip>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="q-pa-md q-mt-md bg-grey-3" v-show="selectedServices.length != 0">
                              <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Enter Quantity
                                </span>
                                    <div class="row" v-for="(i, index) in this.selectedServices" :key="index">
                                        <span class="col-6 text-right q-pa-md q-mt-sm" style="font-size:1.1em;">{{i.services+' ('+ i.price +' Pesos)'}}</span>
                                        <div class="col" style="max-width:200px"><q-input color="orange-8" outlined="" rounded="" class="q-ma-sm q-mr-lg text-h6" type="number" min="0" v-model="serviceQty[i.services]" placeholder="Qty" /></div>
                                    </div>
                            </div>                          
                        </div>
                            
                        </q-step>
                        <q-step
                            :name="6"
                            title="Select Add-Ons"
                            icon="add"
                            :done="step > 6"
                            v-show="packageType == 'FIXED'"
                        >
                        <div class="q-pa-md " >
                            <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Select Add-Ons
                                </span>
                            </div>
                            <div class="q-gutter-xs q-mt-sm">
                                <!-- <q-checkbox v-model="selectedFood" :val="i" :label="i.category+' ('+ i.min +' php)'" color="orange-8" v-for="(i, index) in this.mergeData" :key="index" @input="checkIfRemoved(i.category)"/> -->
                                <q-select
                                    v-model="selectedAddOns"
                                    :options="mapAddOns"
                                    emit-value=""
                                    map-options=""
                                    multiple=""
                                    label="Add-Ons (Multiple Selection)"
                                    color="orange-8"
                                    class="q-pa-sm"
                                    outlined=""
                                    @input="checkInput('addons')"
                                    menu-anchor="bottom center"
                                >
                                    <template v-slot:selected-item="scope">

                                    <q-chip
                                        removable
        
                                        @remove="scope.removeAtIndex(scope.index),checkIfRemovedAddOns(scope.opt.label)"
                                        :tabindex="scope.tabindex"
                                        color="orange-8"
                                        text-color="white"
                                        size="1.2em"
                                        class="q-mt-sm"
                                    >
                                        {{ scope.opt.label }}
                                    </q-chip>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="q-pa-md q-mt-md bg-grey-3" v-show="selectedAddOns.length != 0">
                              <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Enter Quantity
                                </span>
                                    <div class="row" v-for="(i, index) in this.selectedAddOns" :key="index">
                                        <span class="col-6 text-right q-pa-md q-mt-sm" style="font-size:1.1em;">{{i.addons+' ('+ i.price +' Pesos)'}}</span>
                                        <div class="col" style="max-width:200px"><q-input color="orange-8" outlined="" rounded="" class="q-ma-sm q-mr-lg text-h6" type="number" min="0" v-model="addOnsQty[i.addons]" placeholder="Qty" /></div>
                                    </div>
                            </div>                          
                        </div>
                            
                        </q-step>
                        <q-step
                            :name="7"
                            title="Finalize Package Price"
                            icon="attach_money"
                            :done="step > 7"
                        >
                        <div class="q-pa-md text-grey-8" v-show="packageType == 'FIXED'">
                            <div class="row">
                                <span class="col-4 q-pt-md text-weight-bold" style="font-size:1.2em;">Total Package Price</span>
                               <q-input class="q-mt-md text-h6 col" color="orange-8" v-model="packagePrice" prefix="P" type="number" placeholder="Total Package Price"  outlined="" rounded="" style="max-width:300px;" />
                            </div>
                        </div>
                        <div class="q-pa-md text-grey-8" v-show="packageType == 'PER PAX'">
                            <div class="row">
                                <span class="col-4 q-pt-md text-weight-bold" style="font-size:1.2em;">Final Per Pax Price</span>
                               <q-input class="q-mt-md text-h6 col" color="orange-8" v-model="pricePerPax" prefix="P" type="number" placeholder="Enter Price Per Pax"  outlined="" rounded="" style="max-width:300px;" />
                            </div>
                        </div>    
                        </q-step>

                        <template v-slot:navigation>
                            <q-stepper-navigation>
                                <q-btn v-if="step > 1" flat color="grey-8" @click="checkTypeBack" label="Back" class="q-ml-sm" />
                                <q-btn @click="step !== 7 ? checkTypeContinue() : savePackage()" color="orange-8" :label="step === 7 ?'Finish' : 'Continue'" />
                                
                            </q-stepper-navigation>
                        </template>
                    </q-stepper>

                </q-card-section>
            </q-card>
            <q-page-sticky position="top-right" :offset="[18,18]" class="col q-pa-lg" >
            <q-card class="my-card q-pa-md q-ml-md" flat style="min-width:480px;max-width:600px;border-radius: 20px;">
                <q-card-section>
                    <div class="text-h6">Package Pricing Guide</div>
                </q-card-section>
                <q-expansion-item
                v-model="details1"
                label="Package Details"
                >
                <q-card-section>
                    <div class="row justify-between">
                        <div class="col-8 text-overline ">
                            PACKAGE TYPE
                        </div>
                        <div class="col q-pt-sm text-weight-bold">
                            {{packageType}}
                        </div>
                    </div>
                    <div class="row justify-between" v-show="event != ''">
                        <div class="col-8 text-overline">
                            EVENT TYPE
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold">
                            {{event}}
                        </div>
                    </div>
                    <div class="row justify-between" v-show="pax != 0">
                        <div class="col-8 text-overline">
                            FIXED NO# OF PAX
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold">
                            {{pax}}
                        </div>
                    </div>
                    <div class="row justify-between" v-show="kidPax != 0 && withKid == true">
                        <div class="col-8 text-overline">
                            <span class="text-orange-8">(+PLUS)</span> KIDS PAX
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold">
                            {{kidPax}}
                        </div>
                    </div>
                    <div class="row justify-between" v-show="kidPax != 0 && withKid == true && kidDiscount !=0">
                        <div class="col-8 text-overline">
                            KID DISCOUNT RATE
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold">
                           less {{kidDiscount}}%
                        </div>
                    </div>
                </q-card-section>
                </q-expansion-item>
                <!-- <q-separator spaced/> -->
                <q-expansion-item
                v-model="details2"
                label="Food Choices and Price Per Pax"
                v-show="selectedFood.length > 0"
                >
                <q-card-section>
                    <div class="row justify-between" v-show="selectedFood.length > 0 && selectedFood.length < 5">
                        <div class="col-8 text-overline">
                            FOOD CHOICES
                        </div>
                    </div>
                    <div class="row justify-between" v-show="selectedFood.length > 0" v-for="(i,index) in selectedFood" :key="index">
                        <div class="col-8 text-overline">
                            {{i.category}}
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold">
                           P{{i.price}} * {{viandsQty[i.category]}}
                        </div>
                        <span class="text-orange-8 col q-pt-sm text-uppercase text-weight-bold">P {{i.price * viandsQty[i.category]}}</span>
                    </div>
                    <q-separator spaced/>
                    <div class="row justify-between" v-show="selectedFood.length > 0 && packageType == 'PER PAX'">
                        <div class="col-8 text-overline">
                            PER PAX PRICE 
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-right text-orange-8">
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6">
                                P {{returnAdultPax}}
                            </div>
                        </div>
                    </div> 
                    
                     <div class="row justify-between" v-show="selectedFood.length > 0 && packageType == 'FIXED'">
                        <div class="col-8 text-overline">
                            PER PAX PRICE (ADULTS)
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-right text-orange-8">
                            <div class="col-12">
                                P {{returnAdultPax}} <span class="text-grey-8 q-mr-md">* {{pax}} =</span>
                            </div>
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6">
                                P {{returnAdultPax * pax}}
                            </div>
                        </div>
                    </div>   
                    <div class="row justify-between" v-show="selectedFood.length > 0 && withKid == true && packageType == 'FIXED'">
                        <div class="col-8 text-overline">
                            PER PAX PRICE (KIDS) LESS {{kidDiscount}}%
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold  text-orange-8 text-right">
                            <div class="col-12">
                                P {{returnKidPrice}} <span class="text-grey-8 q-mr-md">* {{kidPax}} =</span>
                            </div>
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6">
                                P {{returnKidPrice * kidPax}}
                            </div>
                        </div>
                    </div>    
                    <div class="row justify-between" v-show="selectedFood.length > 0 && packageType == 'FIXED'">
                        <div class="col-8 text-overline">
                            CURRENT PACKAGE PRICE
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-orange-8 text-right">
                            <div class="col-12 q-mr-md">
                                
                                <span class="text-grey-8" v-show="withKid == true">P {{returnKidPrice * kidPax}} + P {{returnAdultPax * pax}}</span>
                            </div>
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6 text-weight-bold">
                                P {{returnCurrent}}
                            </div>
                            
                        </div>
                    </div>                
                </q-card-section>
                </q-expansion-item>
                <!-- <q-separator spaced/> -->
                <q-expansion-item
                v-model="details3"
                label="Inclusions"
                v-show="selectedInclusions.length > 0"
                >
                    <q-card-section>
                    <div class="row justify-between" v-show="selectedInclusions.length > 0" v-for="(i,index) in selectedInclusions" :key="index">
                        <div class="col-12 text-orange-8 text-weight-bold" style="font-size:1.2em">
                           <q-icon name="label" /> {{i.inclusion}}
                        </div>
                    </div>
                    </q-card-section>
                </q-expansion-item>

                <!-- <q-separator spaced/> -->

                <q-expansion-item
                v-model="details4"
                label="Services"
                v-show="selectedServices.length > 0"
                >
                    <q-card-section>
                    <div class="row justify-between" v-show="selectedServices.length > 0" v-for="(i,index) in selectedServices" :key="index">
                        <div class="col-7 text-overline">
                           {{i.services}}
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-right">
                           P{{i.price}} * {{serviceQty[i.services]}}
                        </div>
                        <span class="text-orange-8 col q-pt-sm text-uppercase text-weight-bold text-right q-mr-md">P {{i.price * serviceQty[i.services]}}</span>
                    </div>
                    <div class="row justify-between q-mt-md" v-show="selectedServices.length > 0">
                        <div class="col-8 text-overline">
                            CURRENT PACKAGE PRICE
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-orange-8 text-right">
                            <div class="col-12 q-mr-md">
                                
                                <span class="text-grey-8" v-show="selectedServices.length > 0">P {{returnCurrent}} + P {{returnServicesPrice}}</span>
                            </div>
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6 text-weight-bold">
                                P {{returnCurrent + returnServicesPrice}}
                            </div>
                            
                        </div>
                    </div> 
                    </q-card-section>
                </q-expansion-item>

                <!-- <q-separator spaced/> -->

                <q-expansion-item
                v-model="details5"
                label="Add-Ons"
                v-show="selectedAddOns.length > 0"
                >
                    <q-card-section>
                    <div class="row justify-between" v-show="selectedAddOns.length > 0" v-for="(i,index) in selectedAddOns" :key="index">
                        <div class="col-7 text-overline">
                           {{i.addons}}
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-right">
                           P{{i.price}} * {{addOnsQty[i.addons]}}
                        </div>
                        <span class="text-orange-8 col q-pt-sm text-uppercase text-weight-bold text-right q-mr-md">P {{i.price * addOnsQty[i.addons]}}</span>
                    </div>
                    <div class="row justify-between" v-show="selectedAddOns.length > 0">
                        <div class="col-8 text-overline">
                            CURRENT PACKAGE PRICE
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-orange-8 text-right">
                            <div class="col-12 q-mr-md">
                                
                                <span class="text-grey-8" v-show="selectedAddOns.length > 0">P {{returnCurrent2}} + P {{returnAddOnsPrice}}</span>
                            </div>
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6 text-weight-bold">
                                P {{returnCurrent2 + returnAddOnsPrice}}
                            </div>
                            
                        </div>
                    </div> 
                    </q-card-section>
                </q-expansion-item>
                <q-card-section v-show="details6 == true">
                    <div class="row justify-between" v-show="details6 == true && packageType == 'FIXED'">
                        <div class="col-8 text-overline">
                            TOTAL PACKAGE PRICE<br> (Price per pax + Services + Add-Ons)
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-orange-8 text-right">
                            <!-- <div class="col-12 q-mr-md">
                                <span class="text-grey-8" v-show="details6 == true">P {{returnCurrentLast}} + P {{returnAddOnsPrice}}</span>
                            </div> -->
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6 text-weight-bold">
                                P {{returnCurrentLast}}
                            </div>
                            
                        </div>
                    </div> 
                    <div class="row justify-between" v-show="details6 == true && packageType == 'PER PAX'">
                        <div class="col-8 text-overline">
                            FINAL PER PAX PRICE
                        </div>
                        <div class="col q-pt-sm text-uppercase text-weight-bold text-orange-8 text-right">
                            <!-- <div class="col-12 q-mr-md">
                                <span class="text-grey-8" v-show="details6 == true">P {{returnCurrentLast}} + P {{returnAddOnsPrice}}</span>
                            </div> -->
                            <div class="col-12 text-deep-orange text-right q-mr-md text-h6 text-weight-bold">
                                P {{returnAdultPax}}
                            </div>
                            
                        </div>
                    </div> 
                </q-card-section>
            </q-card>
            </q-page-sticky>
        </div>
        
        
    </q-page>
</template>
<script>
export default {
    data(){
        return{
            details1: true,
            details2: false,
            details3: false,
            details4: false,
            details5: false,
            details6:false,
            step: 1,
            packageName: '',
            packageType: 'FIXED',
            packageOptions: ['FIXED','PER PAX'],
            event: '',
            pax: 0,
            withKid: false,
            kidPax: 0,
            kidDiscount: 0,
            selectedFood: [],
            selectedInclusions: [],
            selectedServices: [],
            selectedAddOns: [],
            showAsFreebies: [],
            viandsQty: [],
            serviceQty: [],
            addOnsQty:[],
            packagePrice: 0,
            pricePerPax: 0,

            //database array
            Category: [],
            Food: [],
            Packages: [],
            Inclusion: [],
            Event: [],
            Services: [],
            Addons:[]
        }
    },
    mounted(){
        this.$binding('Category', this.$firestoreApp.collection('Category'))
            .then(Category => {
            console.log(Category, 'Category')
            }),
        this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            console.log(Food, 'Food')
            }),
        this.$binding('Packages', this.$firestoreApp.collection('Packages'))
            .then(Packages => {
            console.log(Packages, 'Packages')
            })
            ,
        this.$binding('Inclusion', this.$firestoreApp.collection('Inclusion'))
            .then(Inclusion => {
            console.log(Inclusion, 'Inclusion')
            })
        this.$binding('Event', this.$firestoreApp.collection('Event'))
            .then(Event => {
            console.log(Event, 'Event')
            }),
        this.$binding('Services', this.$firestoreApp.collection('Services'))
            .then(Services => {
            console.log(Services, 'Services')
            }),
        this.$binding('Addons', this.$firestoreApp.collection('Addons'))
            .then(Addons => {
            console.log(Addons, 'Addons')
            })
    },
    computed:{
        eventOpt(){
            let optionss = this.Event.map(m => {
                return {
                    label: m.event,
                    value: m.event
                }
            })
            return optionss
        },
        mergeData(){
            try {
                let categories = this.Category
                let food = this.Food

                let arr = []

                for(var x =0;x < categories.length; x++){
                    let forPush = {...categories[x]}
                    let categKey = forPush['.key']
                    delete forPush['.key']
                    forPush.categKey = categKey
                    forPush.foods = []
                    for(var y=0; y < food.length; y++) {
                        if(food[y].category == categories[x].category){
                            forPush.foods.push(food[y])
                        }
                    } 

                    if(forPush.foods.length != 0) {
                        let min = this.$lodash.minBy(forPush.foods, 'foodPrice')

                        let getMin = {...min}
                        forPush.min = getMin.foodPrice
                        console.log('min',getMin.foodPrice)
                        arr.push(forPush)
                    }

                }
                console.log(arr,'merge')
                //get MIN MAX
                return arr
            } catch(err){
                return ''
            }

        },
        returnOptMerge(){
            let map = this.mergeData.map(a=>{
                return {
                    label: a.category,
                    value: a
                }
            })
            return map
        },
        mapInclusions(){
            let map = this.Inclusion.map(a=>{
                let data = {...a}
                data.inclusionKey = a['.key']
                delete data['.key']
                return {
                    label: a.inclusion,
                    value: data
                }
            })
            return map
        },
        mapServices(){
            let map = this.Services.map(a=>{
                let data = {...a}
                data.serviceKey = a['.key']
                delete data['.key']
                return {
                    label: a.services,
                    value: data
                }
            })
            return map
        },
        mapAddOns(){
            let map = this.Addons.map(a=>{
                let data = {...a}
                data.addonsKey = a['.key']
                delete data['.key']
                return {
                    label: a.addons,
                    value: data
                }
            })
            return map
        },
        mergePricing(){

            console.log(this.selectedFood.length,'selectedFoodlength')
            console.log(this.selectedFood,'selectedFood')
            console.log(this.viandsQty,'checkviands') 
            
            let keys = this.$lodash.keys(this.viandsQty)
            console.log(keys,'keys')

            if(this.selectedFood.length != keys.length){
                this.showCompleteBanner = true
                console.log('no pricing')
                return 0
            } 
                this.showCompleteBanner = false
            
            let merge = []
            for( var x = 0; x < this.selectedFood.length; x++){
                let m = {...this.selectedFood[x]}
                delete m.foods
                m.viandsQty = this.viandsQty[m.category]
                merge.push(m)
            }

            console.log(merge,'merge')
            return merge
        },
        returnAdultPax(){
            try {
                let select = this.mergePricing
                let sumMin = this.$lodash.sumBy(select, m=>{
                    return parseInt(m.min) * parseInt(m.viandsQty)
                })

                console.log('mergePrice',this.mergePricing)

                return sumMin
            } catch(err){
                return 0
            }
        },
        returnKidPrice(){
            try {
                return this.returnAdultPax - (this.returnAdultPax * (this.kidDiscount/100))
            } catch (error) {
                return 0
            }
        },
        returnCurrent(){
            return (this.returnKidPrice * this.kidPax) + (this.returnAdultPax * this.pax)
        },
        mergePricingServices(){

            console.log(this.selectedServices.length,'selectedServiceslength')
            console.log(this.selectedServices,'selectedServices')
            console.log(this.serviceQty,'checkservices') 
            
            let keys = this.$lodash.keys(this.serviceQty)
            console.log(keys,'keys')

            if(this.selectedServices.length != keys.length){
                this.showCompleteBanner = true
                console.log('no pricing')
                return 0
            } 
                this.showCompleteBanner = false
            
            let merge = []
            for( var x = 0; x < this.selectedServices.length; x++){
                let m = {...this.selectedServices[x]}
                delete m.foods
                m.serviceQty = this.serviceQty[m.services]
                merge.push(m)
            }

            console.log(merge,'merge')
            return merge
        },
        returnServicesPrice(){
            try {
                let select = this.mergePricingServices
                let sumMin = this.$lodash.sumBy(select, m=>{
                    return parseInt(m.price) * parseInt(m.serviceQty)
                })

                console.log('mergePrice',this.mergePricingServices)

                return sumMin
            } catch(err){
                return 0
            }            
        },
        returnCurrent2(){
            //price with services
            return this.returnCurrent + this.returnServicesPrice
        },
        mergePricingAddons(){

            console.log(this.selectedAddOns.length,'selectedAddonslength')
            console.log(this.selectedAddOns,'selectedAddons')
            console.log(this.addOnsQty,'checkAddons') 
            
            let keys = this.$lodash.keys(this.addOnsQty)
            console.log(keys,'keys')

            if(this.selectedAddOns.length != keys.length){
                this.showCompleteBanner = true
                console.log('no pricing')
                return 0
            } 
                this.showCompleteBanner = false
            
            let merge = []
            for( var x = 0; x < this.selectedAddOns.length; x++){
                let m = {...this.selectedAddOns[x]}
                delete m.foods
                m.addOnsQty = this.addOnsQty[m.addons]
                merge.push(m)
            }

            console.log(merge,'merge')
            return merge
        },
        returnAddOnsPrice(){
            try {
                let select = this.mergePricingAddons
                let sumMin = this.$lodash.sumBy(select, m=>{
                    return parseInt(m.price) * parseInt(m.addOnsQty)
                })

                console.log('mergePrice',this.mergePricingAddons)

                return sumMin
            } catch(err){
                return 0
            }            
        },
        returnCurrentLast(){
            //price with services
            return this.returnCurrent2 + this.returnAddOnsPrice
        },
    },
    methods:{
        checkIfOff(){
            let kid = this.withKid
            if(kid == false){
                this.kidPax = 0
                this.kidDiscount = 0
            }
        },
        checkTypeContinue(){
            if(this.step == 1 && this.packageType == 'FIXED'){
                this.$refs.stepper.next()
            } else if (this.step == 1 && this.packageType == 'PER PAX'){
                this.$refs.stepper.goTo(3)
                this.details1 = false
                this.details2 = true
            } else if (this.step == 4 && this.packageType == 'PER PAX'){
                this.$refs.stepper.goTo(7)
                this.details2 = false
                this.details3 = false
                this.details6 = true
                this.pricePerPax = this.returnAdultPax
            } else {
                this.$refs.stepper.next()
                this.details1 = false
                if(this.step == 3){
                    this.details2 = true
                } else if (this.step == 4){
                    this.details2 = false
                    this.details3 = true
                } else if (this.step == 5){
                    this.details3 = false
                    this.details4 = true
                } else if (this.step == 6){
                    this.details4 = false
                    this.details5 = true
                } else if (this.step == 7){
                    this.details5 = false
                    this.details6 = true
                    this.packagePrice = this.returnCurrentLast
                }
            }
        },
        checkTypeBack(){
            if(this.step == 2 && this.packageType == 'FIXED'){
                this.$refs.stepper.previous()
            } else if (this.step == 3 && this.packageType == 'PER PAX') {
                this.$refs.stepper.goTo(1)
            } else if (this.step == 7 && this.packageType == 'PER PAX'){
                this.$refs.stepper.goTo(4)
            } else {
                this.$refs.stepper.previous()
            }
        },
        checkInput(type){
            if(type == 'inclusion'){
                this.selectedInclusions = this.returnUniq(this.selectedInclusions)
            } else if (type == 'food'){
                this.selectedFood = this.returnUniq(this.selectedFood)
            } else if (type == 'services') {
                this.selectedServices = this.returnUniq(this.selectedServices)
            } else {
                this.selectedInclusions = this.returnUniq(this.selectedInclusions)
            }
        },
        returnUniq(arr){
            return this.$lodash.uniq(arr)
        },
        findIndexSelection(arr,val){
            return this.$lodash.findIndex(arr,val)
        },
        checkIfRemoved(category){
            console.log('checkifremoved',this.selectedFood)
            console.log('checkifremoved C',category)
            var index = this.findIndexSelection(this.selectedFood,category)
            console.log('checkifremoved I',index)
            if(index == -1){
                delete this.viandsQty[category]
                console.log(this.viandsQty,'this.viandsQty')
            }
        },
        checkIfRemovedServices(service){
            var index = this.findIndexSelection(this.selectedServices,service)
            if(index == -1){
                delete this.serviceQty[service]
                console.log(this.serviceQty,'this.serviceQty')
            }
        },
        checkIfRemovedAddOns(addons){
            var index = this.findIndexSelection(this.selectedAddOns,addons)
            if(index == -1){
                delete this.addOnsQty[addons]
                console.log(this.addOnsQty,'this.addOnsQty')
            }
        },
        savePackage(){
            this.$q.dialog({
                    title: 'Add Package',
                    message: 'Add This New Package?',
                    ok: 'Yes',
                    color:'orange-8',
                    cancel: 'Cancel',
                    persistent: true
                  }).onOk(() => {
                        if(this.packageType == 'FIXED'){
                            let fixed = {
                                name: this.packageName,
                                event: this.event,
                                price: this.packagePrice,
                                category: this.mergePricing,
                                inclusions: this.selectedInclusions,
                                services: this.mergePricingServices,
                                addons: this.mergePricingAddons,
                                priceBasis: this.returnCurrentLast,
                                type: this.packageType,
                                dateAdded: new Date(),
                                withKid: this.withKid,
                                kidPax: this.kidPax,
                                adultPax: this.pax,
                                kidDiscount: this.kidDiscount,
                                pricePerPax: this.returnAdultPax,
                                kidPricePerPax: this.returnKidPrice
                            }
                            console.log(fixed,'fixed package')
                            this.addPackage(fixed)
                        } else {
                            let perPax = {
                                name: this.packageName,
                                event: this.event,
                                price: this.pricePerPax,
                                category: this.mergePricing,
                                inclusions: this.selectedInclusions,
                                priceBasis: this.returnAdultPax,
                                dateAdded: new Date()
                            }
                            console.log(perPax,'perPax package')
                            this.addPackage(perPax)
                        }
                  })

        },
        addPackage(data){
            this.$firestoreApp.collection('Packages').add(data)
                .then(()=>{
                this.addPackageDialog = false
                this.$q.notify({
                        message: 'Package Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'orange-8',
                        textColor: 'white',
                        position: 'center'
                    })
                this.$router.push('/packages')
                })
        }

    }
}
</script>