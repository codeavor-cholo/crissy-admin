<template>
    <q-page class="bg-grey-4">
        <div class="row">
<!-- LEFT PART -->
            <div class="col-8">
                <q-card class="my-card shadow-0" style="border-radius:20px;">
                    <q-card-section>
                        <div class="q-pa-md row" style="font-size:30px;font-family: 'Montserrat', sans-serif;">
                        <q-input v-model="reservation.clientEvent" type="text" label="Event Name" size="lg" outlined color="orange-8" class="col q-mr-md" rounded/>
                        <q-select v-model="reservation.clientEventType" :options="mapEvent" emit-value label="Event Type" outlined color="orange-8 " class="col-3" rounded :disable="step > 3" @input="selectedPackage = []"/>
                        </div>
                        <q-stepper
                            v-model="step"
                            vertical
                            done-color="teal"
                            active-color="orange-8"
                            animated
                            flat
                            header-nav=""
                            >
                            <q-step
                                :name="1"
                                title="Choose Date Of Your Event"
                                icon="calendar_today"
                                :done="step > 1"
                            >
                            <div class="row">
                                <div class="col">
                                <q-date v-model="reservedate" color="orange-4" landscape="" flat :options="date => dateToday(date)"/>
                                </div>
                                <div class="col-4 q-ml-sm q-gutter-md">
                                    <div>
                                        <q-input dense outlined  v-model="sTime" label="start time" type="time" color="orange-8" rounded/>
                                    </div>
                                    <div>
                                        <q-input dense outlined  v-model="eTime" label="end time" type="time" color="orange-8" rounded/>
                                    </div>
                                </div>
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
                                                <q-input dense outlined style="width:300px" type="number" v-model="pax" label="Pax" color="orange-8" rounded :min="50"/>
                                            </div>
                                            <div>
                                                <q-select dense outlined style="width:300px" v-model="motif" label="Motif" :options="mapMotif" emit-value color="orange-8" rounded/>
                                            </div>
                                        </div>
                                    </div>
                                     <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Select <span class="text-orange-8 text-h6"> 1 </span> Theme (optional)</span>
                                    <div class="row q-mb-xl">
                                        <q-card class="my-card col-4 q-ma-sm cursor-pointer" v-for="(choice,j) in Theme" :key="j" :style="returnSelectedStatusTheme(choice) ? 'transform: scale(0.95);' : ''" :class="returnSelectedStatusTheme(choice) ? 'bg-orange text-white' : ''" style="border-radius:20px;" @click.native="clickUnclickAddTheme(choice)">
                                        <q-img 
                                          :src="choice.themePic"
                                          :ratio="3/2" />

                                        <q-card-section>
                                          <div class="row no-wrap items-center">
                                            <q-checkbox color="orange-8" v-model="selectedTheme" :val="choice" @input="checkTheme"/>
                                            <div class="col text-subtitle2 ellipsis">
                                              {{choice.themeName}}
                                            </div>
                                          </div>
                                        </q-card-section>
                                        </q-card>
                                    </div>
                                </div>
                                
                                <q-stepper-navigation class="q-mt-md">
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
                                    <q-tab name="PER PAX"  label="PER PAX PACKAGES" @click="selectedPackage = []" />
                                    <q-tab name="FIXED" label="FIXED PAX PACKAGES" @click="selectedPackage = []"/>
                                    <q-tab name="CUSTOMIZE" label="CUSTOMIZE PACKAGE" @click="selectedPackage = []"/>
                                </q-tabs>
                                <q-separator  />
                                <div v-show="tab !== 'CUSTOMIZE'">
                                        <h6 class="q-my-sm text-weight-light full-width text-center" style="font-size:1.2em;">Click the card to select package.</h6>
                                        <q-table grid :data="tab == 'PER PAX' ? returnPerPax : returnFixed" :columns="columns" :filter="filter" class="full-width align-center " :selected.sync="selectedPackage" row-key=".key" selection="single" :pagination.sync="pagination">
                                        <template v-slot:item="props">
                                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''" >
                                                <q-card class="my-card cursor-pointer"  style="border-radius:20px" @click.native="props.selected = !props.selected,clickTrue()" :class="props.selected ? 'bg-orange-8 text-white' : 'text-grey-8'">
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
                                 </div>
                                 <div v-show="tab == 'CUSTOMIZE'" class="text-center">
                                  <h6 class="q-mb-none">DO YOU WANT TO CUSTOMIZE YOUR OWN PACKAGE ?</h6>
                                  <span class="text-subtitle2 text-orange"><q-icon name="info"/> Prices will be base on company's pricing of food, services and add-ons and also the total package price will not have any form of discounts.</span>
                                  <h6 class="q-my-sm text-weight-light full-width text-center" style="font-size:1.2em;">Click the <b>continue</b> to proceed to <b>package customization</b>.</h6>
                                 </div>
                                
                                <q-stepper-navigation>
                                <q-btn @click="step = 4,details1 = false,details2 = true,details3 = false,details4 = false,details5 = false" color="orange-8" label="Continue" />
                                <q-btn flat @click="step = 2,details1 = true,details2 = false,details3 = false,details4 = false,details5 = false" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                            <q-step
                                :name="4"
                                title="Food Selection"
                                icon="fastfood"
                                :done="step > 4"
                            >

                                <div v-for="(food,i) in foodChoice" :key="i" v-show="selectedPackage != null">
                                  <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Select <span class="text-orange-8 text-h6">{{returnLimit(food.category)}}</span> Choice<span v-show="returnLimit(food.category) > 1">s</span> of {{food.category}}  </span>
                                  <br>
                                  <span class="text-caption" v-show="tab == 'CUSTOMIZE'">additional ₱{{food.price}} per choice of dish (in per pax price)</span>
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
                                <q-btn @click="step = 5,details3 = true, details2 = false,details1 = false,details4 = false,details5 = false" color="orange-8" label="Continue" />
                                <q-btn flat @click="step = 3,details1 = true, details2 = false,details3 = false,details4 = false,details5 = false" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>
                            <q-step
                                :name="5"
                                title="Select Services (optional)"
                                icon="local_shipping"
                                :done="step > 5"
                            >
                            <div class="q-pa-md " >
                            <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Select Services (Optional)
                                </span>
                            </div>
                            <div class="q-gutter-xs q-mt-sm">

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
          
                                          @remove="scope.removeAtIndex(scope.index),checkIfRemovedServices(scope.opt.value)"
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
                                <q-stepper-navigation>
                                <q-btn @click="step = 6" color="orange-8" label="Continue" />
                                <q-btn flat @click="step = 4,details2 = true,details3 = false,details1 = false,details4 = false,details5 = false" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>
                          </q-step>
                          <q-step
                                :name="6"
                                title="Select Add-ons (optional)"
                                icon="add"
                                :done="step > 6"
                            >
                            <div class="q-pa-md " >
                            <div class="text-grey-8">
                                <span class="text-weight-bold"  style="font-size:1.2em;">
                                Select Add-Ons (Optional)
                                </span>
                            </div>
                            <div class="q-gutter-xs q-mt-sm">
                                  <q-select
                                      v-model="selectedAddOns"
                                      :options="mapAddons"
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
          
                                          @remove="scope.removeAtIndex(scope.index),checkIfRemovedAddons(scope.opt.value)"
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
                                <q-stepper-navigation>
                                <q-btn @click="step = 7,details4 = true,details3= false,details1 = false,details2 = false,details5 = false" color="orange-8" label="Continue" v-if="tab !== 'CUSTOMIZE'"/>
                                <q-btn @click="step = 8,details5 = true,details3= false,details1 = false,details2 = false,details4 = false" color="orange-8" label="Continue" v-else/>
                                <q-btn flat @click="step = 5" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>                           
                          </q-step>  
                          <q-step
                              :name="7"
                              title="Select Additional Food (optional)"
                              icon="fastfood"
                              :done="step > 7"
                              v-show="tab != 'CUSTOMIZE'"
                          >  
                          <div v-for="(food,i) in foodChoiceAddons" :key="i">
                            <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Select Additional Choice of {{food.category}}</span>
                            <br>
                            <span class="text-caption">additional ₱{{food.price}} per choice of dish (in per pax price)</span>
                            <div class="row q-mt-md q-mb-md">
                                  <q-card class="my-card col-4 q-ma-sm cursor-pointer" v-for="(choice,j) in food.foodChoices" :key="j" :style="returnSelectedStatusAdd(choice) ? 'transform: scale(0.95);' : ''" :class="returnSelectedStatusAdd(choice) ? 'bg-orange text-white' : ''" style="border-radius:20px;" @click.native="clickUnclickAdd(choice)">
                                  <q-img 
                                    :src="choice.foodPic"
                                    :ratio="3/2" />

                                  <q-card-section>


                                    <div class="row no-wrap items-center">
                                      <q-checkbox color="orange-8" v-model="choiceOfFoodAdd" :val="choice"/>
                                      <div class="col text-subtitle2 ellipsis">
                                        {{choice.foodName}}
                                      </div>
                                    </div>
                                  </q-card-section>
                                  </q-card>

                            </div>
                          </div>                      
                                <q-stepper-navigation>
                                <q-btn @click="step = 8,details5 = true,details4 = false,details1 = false,details2 = false,details3 = false" color="orange-8" label="Continue" />
                                <q-btn flat @click="step = 6" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>   
                          </q-step>  
                          <q-step
                              :name="8"
                              title="Terms and Condition"
                              icon="description"
                              :done="step > 8"
                          >      
                                <q-checkbox color="orange-8" v-model="agreed" label="By clicking this checkbox you already read and agree with the company's terms and conditions." />

                                <q-stepper-navigation>
                                <q-btn @click="step = 9" color="orange-8" label="Continue" :disabled="!agreed"/>

                                <q-btn flat @click="step = 7" color="orange-8" label="Back" class="q-ml-sm" v-if="tab !== 'CUSTOMIZE'"/>
                                <q-btn flat @click="step = 6" color="orange-8" label="Back" class="q-ml-sm" v-else/>
                                </q-stepper-navigation>             
                          </q-step>  
                          <q-step
                              :name="9"
                              title="Reserve the Date"
                              icon="date_range"
                              :done="step > 9"
                          >      
                              <div v-if="paymentPermission == false">
                                <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Login First Before Proceeding to Payment</span>
                                <br>
                                <div class="row q-mt-md">
                                  <q-btn  rounded color="orange-8" label="LOGIN VIA GOOGLE" @click="loginGoogle" />
                                  <div class="q-ma-sm q-mx-lg">OR</div>
                                  <q-btn  rounded color="grey-10" label="LOGIN VIA EMAIL AND PASSWORD"/>
                                </div>
                              </div>
                              <div v-else>
                                <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Select Payment Terms</span>
                                <div class="row q-mt-lg">
                                  <q-select v-model="paymentTerms" :options="payOptions" color="orange-8" outlined="" rounded="" class="col"/>
                                  <div class="col-3 text-orange-8 q-ml-md text-h6">
                                    <div>₱ {{returnPaymentAmount}}</div>
                                    <div class="text-caption">To Pay Amount</div>
                                  </div>
                                </div>
                                <div class="row q-mt-lg q-pa-md bg-grey-2">
                                   <stripe-elements ref="elementsRef" color="orange-8" :pk="publishableKey" :amount="returnPaymentAmount" @token="tokenCreated" @loading="loading = $event" outline class="col-8 q-mr-md">
                                    </stripe-elements>
                                    <q-btn outlined color="grey-10" class="col" size="md" rounded @click="submit" icon="payment"><b>&nbsp;&nbsp;PAY ₱ {{returnPaymentAmount}}</b></q-btn>
                                </div>
                                
                              </div>
                                <q-stepper-navigation>
                                <q-btn flat @click="step = 8" color="orange-8" label="Back" class="q-ml-sm" />
                                </q-stepper-navigation>             
                          </q-step>                                   
                        </q-stepper>
                    
                    </q-card-section>
                    </q-card>

            </div>
<!-- END OF LEFT PART -->

<!-- RIGHT PART -->
          <q-page-sticky position="top-right" :offset="[18, 18]" class="col-4 q-pl-md">
            <div class="col-4 q-pl-md">
                <q-card class="my-card shadow-0" style="border-radius:20px;">
                    <q-card-section>
                       
                        <div class="column items-center q-pa-sm">
                          <span class="text-h6 q-mx-md">RESERVATION#: {{$route.params.id}}</span>
                        </div>
  
                        <div v-show="details1">  
                          <q-scroll-area style="width: 100%; height: 70vh;" class="q-px-md" :visible="true">                         
                          <div class="text-center q-mt-sm text-overline">RESERVATION DETAILS</div>                 
                          <div class="q-pa-sm row justify-between">
                              <div>Date</div>
                              <div>{{$moment(reservedate).format('LL')}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between">
                              <div>Time</div>
                              <div>{{formatTimeInput(sTime)}} - {{formatTimeInput(eTime)}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between">
                              <div>Number of Pax</div>
                              <div v-if="tab != 'FIXED'">{{pax}}</div>
                              <div v-else>{{returnPaxFixed}}
                              </div>
                          </div>
                          <div class="q-pa-sm row justify-between" v-show="selectedPackage.length != 0 && tab == 'PER PAX'">
                              <div>Per Head Price</div>
                              <div>{{returnSelectedPackagePrice}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between" v-show="selectedPackage.length != 0">
                              <div>Total Price</div>
                              <div class="text-h6 text-orange-8">₱ {{returnPerPaxTotal}}</div>
                          </div>                          
                          <div> 
                          <q-separator inset class="black"/>
                          </div>
                      
                          <div class="q-pa-sm" v-show="selectedPackage.length != 0"><b>Inclusions</b></div>
                          <div v-for="(inc,i) in returnSelectedPackageInclusions" :key="i" v-show="selectedPackage.length != 0">
                            <div class="q-pa-sm">{{inc.inclusion}}</div>
                          </div>

                          <div> 
                          <q-separator inset class="black"/>
                          </div>

                          <div class="q-pa-sm" v-show="returnSelectedPackageFreebies.length != 0"><b>Services & Add-ons Included</b></div>
                          <div class="q-pa-sm row justify-between" v-for="(free,index) in returnSelectedPackageFreebies" :key="index" v-show="returnSelectedPackageFreebies.length != 0">
                            <div>{{free.name}}</div>
                            <div>x {{free.qty}}</div>
                          </div>
                          </q-scroll-area> 
                        </div>
                        <div v-show="details2">  
                        <q-scroll-area style="width: 100%; height: 70vh;" class="q-px-md" :visible="true">                         
                          <div class="text-center q-mt-sm text-overline">FOOD CHOICES</div>
                          <div class="text-subtitle text-orange-8 text-center q-mt-md" v-show="choiceOfFood.length == 0">NO FOOD SELECTED YET</div>                 
                          <div class="q-pa-sm row justify-between" v-for="(choice,i) in choiceOfFood" :key="i" >
                              <div>{{choice.foodName}}</div>
                              <div v-if="tab !== 'CUSTOMIZE'">x 1</div>
                              <div v-else class="text-orange-8 text-weight-bold">+ ₱{{choice.foodPrice}}
                                <span class="text-grey-8 text-weight-light text-caption">per head</span>
                              </div>
                          </div>
                          <q-separator spaced inset />
                          <div class="q-pa-sm row justify-between" v-show="tab == 'CUSTOMIZE'">
                            <div>TOTAL PER HEAD PRICE</div>
                            <div class="text-h6  text-orange-8 text-weight-bold">₱ {{returnCustomPerHeadPrice}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between" v-show="tab == 'CUSTOMIZE'">
                            <div># of PAX</div>
                            <div class="text-weight-bold">x {{pax}}</div>
                          </div>
                          <q-separator spaced inset />
                          <div class="q-pa-sm row justify-between text-h6 " v-show="tab == 'CUSTOMIZE'">
                            <div>Subtotal</div>
                            <div class="text-orange-8 text-weight-bold">₱ {{returnCustomPerHeadPrice * pax}}</div>
                          </div>
                        </q-scroll-area>
                        </div>
                        <div v-show="details3">  
                        <q-scroll-area style="width: 100%; height: 70vh;" class="q-px-md" :visible="true">                         
                          <div class="text-center q-mt-sm text-overline">SERVICES</div>
                          <div class="text-subtitle text-orange-8 text-center q-mt-md" v-show="selectedServices.length == 0">NO SELECTED SERVICES</div>                 
                          <div class="q-pa-sm row justify-between" v-for="(choice,i) in selectedServices" :key="i" >
                              <div class="col">{{choice.services}}
                                <div :class="returnServiceQty(choice.services) == 'NO QTY!' ? 'text-orange-8 text-weight-bold' : 'text-caption'">{{returnServiceQty(choice.services)}} 
                                  <span v-show="returnServiceQty(choice.services) != 'NO QTY!'" >* 
                                    ₱ {{choice.price}}
                                    </span>
                                </div>
                              </div>
                              <div class="col-3 text-right"><span :class="returnServiceQty(choice.services) != 'NO QTY!' ? 'text-orange-8 text-weight-bold' : 'text-weight-bold'" v-show="returnServiceQty(choice.services) != 'NO QTY!'">₱ {{returnServiceQty(choice.services) * choice.price}}</span></div>
                              
                          </div>
                          <div class="text-center q-mt-sm text-overline">ADD-ONS</div>
                          <div class="text-subtitle text-orange-8 text-center q-mt-md" v-show="selectedAddOns.length == 0">NO SELECTED ADD-ONS</div> 
                          <div class="q-pa-sm row justify-between" v-for="(choice,i) in selectedAddOns" :key="i" >
                              <div class="col">{{choice.addons}} 
                                <div :class="returnAddOnsQty(choice.addons) == 'NO QTY!' ? 'text-orange-8 text-weight-bold' : 'text-caption'">{{returnAddOnsQty(choice.addons)}}  
                                  <span v-show="returnAddOnsQty(choice.addons) != 'NO QTY!'" >* 
                                    ₱ {{choice.price}}
                                    </span>
                                </div>
                              </div> 
                              <div class="col-3 text-right"><span :class="returnAddOnsQty(choice.addons) != 'NO QTY!' ? 'text-orange-8 text-weight-bold' : 'text-weight-bold'" v-show="returnAddOnsQty(choice.addons) != 'NO QTY!'">₱ {{returnAddOnsQty(choice.addons) * choice.price}}</span></div>                       
                          </div>
                          <q-separator spaced inset />
                          <div class="q-pa-sm row justify-between">
                            <div class="col">Total Price <br><span class="text-caption">(per head * per pax price)</span></div>   
                            <div class="col-3 text-right">₱ {{returnPerPaxTotal}}</div>
                          </div> 
                          <div class="q-pa-sm row justify-between">
                            <div>Total Services Price</div>   
                            <div>₱ {{returnSelectedServicesTotal}}</div>
                          </div> 
                          <div class="q-pa-sm row justify-between">
                            <div>Total Add-Ons Price</div>   
                            <div>₱ {{returnSelectedAddonsTotal}}</div>
                          </div> 
                           <q-separator spaced inset />
                          <div class="q-pa-sm row justify-between text-h6">
                            <div>Subtotal</div>   
                            <div class="text-orange-8">₱ {{returnTotalAfterServicesAddons}}</div>
                          </div> 
                        </q-scroll-area>
                        </div>
                        <div v-show="details4">  
                        <q-scroll-area style="width: 100%; height: 70vh;" class="q-px-md" :visible="true">                         
                          <div class="text-center q-mt-sm text-overline">ADDITIONAL FOOD CHOICES</div>
                          <div class="text-subtitle text-orange-8 text-center q-mt-md" v-show="choiceOfFoodAdd.length == 0">NO ADDITIONAL FOOD SELECTED YET

                          </div>    
                          <div class="q-pa-sm row justify-between" v-for="(choice,i) in choiceOfFoodAdd" :key="i" >
                              <div>{{choice.foodName}}</div>
                              <div class="text-orange-8 text-weight-bold">+ ₱{{choice.foodPrice}}
                                <span class="text-grey-8 text-weight-light text-caption">per head</span>
                              </div>
                          </div>
                           <q-separator spaced inset />
                          <div class="q-pa-sm row justify-between">
                            <div class="col">Total Price <br><span class="text-caption">(after addons & services)</span></div>   
                            <div class="col-3 text-right">₱ {{returnTotalAfterServicesAddons}}</div>
                          </div> 
                          <div class="q-pa-sm row justify-between">
                            <div>Additional Price/Pax Total</div>   
                            <div>₱ {{returnTotalPerPaxAddFood}}</div>
                          </div> 
                          <div class="q-pa-sm row justify-between">
                            <div>Total Number of Pax</div>   
                            <div>x {{returnTotalNumberPax}}</div>
                          </div> 
                          <div class="q-pa-sm row justify-between">
                            <div>Total Price<br><span class="text-caption">of the additional food</span></div>   
                            <div class="text-weight-bold">₱ {{returnTotalPerPaxAddFood * returnTotalNumberPax}}</div>
                          </div> 
                           <q-separator spaced inset />
                          <div class="q-pa-sm row justify-between text-h6">
                            <div>Subtotal</div>   
                            <div class="text-orange-8">₱ {{returnTotalAfterServicesAddons + (returnTotalPerPaxAddFood * returnTotalNumberPax)}}</div>
                          </div> 
                        </q-scroll-area>
                        </div>
                        <div v-show="details5">  
                          <q-scroll-area style="width: 100%; height: 70vh;" class="q-px-md" :visible="true">                         
                          <div class="text-center q-mt-sm text-overline">BILLING STATEMENT</div>                 
                          <div class="q-pa-sm row justify-between">
                              <div>Date</div>
                              <div>{{$moment(reservedate).format('LL')}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between">
                              <div>Number of Pax</div>
                              <div v-if="tab != 'FIXED'">{{pax}}</div>
                              <div v-else>{{returnPaxFixed}}
                              </div>
                          </div>
                          <div class="q-pa-sm row justify-between" v-show="selectedPackage.length != 0 && tab == 'PER PAX'">
                              <div>Per Head Price</div>
                              <div>₱ {{returnSelectedPackagePrice}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between" v-show="tab == 'CUSTOMIZE'">
                              <div>Per Head Price</div>
                              <div>₱ {{returnCustomPerHeadPrice}}</div>
                          </div>
                          <div class="q-pa-sm row justify-between">
                              <div>Total Price <br><span class="text-caption">(per head * per pax price)</span></div>
                              <div class="text-orange-8">₱ {{returnPerPaxTotal}}</div>
                          </div>   
                          <div class="q-pa-sm row justify-between">
                              <div class="text-overline">SERVICES</div>
                              <div ><q-btn dense color="teal" :icon-right="showSelectedServices == true ? 'arrow_drop_up' :'arrow_drop_down'" :label="showSelectedServices == true ? 'hide SERVICES' :'show SERVICES'" @click="showSelectedServices = !showSelectedServices" size="xs" flat/></div>
                          </div>
                          <div class="q-pa-sm row justify-between text-caption" v-for="(choice,i) in selectedServices" :key="i" v-show="showSelectedServices">
                                <div class="col">{{choice.services}} 
                                <div :class="returnServiceQty(choice.services) == 'NO QTY!' ? 'text-orange-8 text-weight-bold' : 'text-caption'">{{returnServiceQty(choice.services)}}  
                                  <span v-show="returnServiceQty(choice.services) != 'NO QTY!'" >* 
                                    ₱ {{choice.price}}
                                    </span>
                                </div>
                              </div> 
                              <div class="col-3 text-right">₱ {{returnServiceQty(choice.services) * choice.price}}</div>
                          </div>
                           <div class="q-pa-sm row justify-between">
                              <div>Total Services Price</div>
                              <div class="text-orange-8">₱ {{returnSelectedServicesTotal}}</div>
                          </div>  
                          <div class="q-pa-sm row justify-between">
                              <div class="text-overline">ADD-ONS</div>
                              <div ><q-btn dense color="teal" :icon-right="showSelectedAddons == true ? 'arrow_drop_up' :'arrow_drop_down'" :label="showSelectedAddons == true ? 'hide add-ons' :'show add-ons'" @click="showSelectedAddons = !showSelectedAddons" size="xs" flat/></div>
                          </div>
                          <div class="q-pa-sm row justify-between text-caption" v-for="(choice,i) in selectedAddOns" :key="i" v-show="showSelectedAddons">
                                <div class="col">{{choice.addons}} 
                                <div :class="returnAddOnsQty(choice.addons) == 'NO QTY!' ? 'text-orange-8 text-weight-bold' : 'text-caption'">{{returnAddOnsQty(choice.addons)}}  
                                  <span v-show="returnAddOnsQty(choice.addons) != 'NO QTY!'" >* 
                                    ₱ {{choice.price}}
                                    </span>
                                </div>
                              </div> 
                              <div class="col-3 text-right">₱ {{returnAddOnsQty(choice.addons) * choice.price}}</div>
                          </div>
                           <div class="q-pa-sm row justify-between">
                              <div>Total Add-Ons Price</div>
                              <div class="text-orange-8">₱ {{returnSelectedAddonsTotal}}</div>
                          </div>  
                          <div class="q-pa-sm row justify-between" v-show="tab !== 'CUSTOMIZE'">
                              <div class="text-overline">ADDITIONAL FOODS</div>
                              <div ><q-btn dense color="teal" :icon-right="showAddtionalFoods == true ? 'arrow_drop_up' :'arrow_drop_down'" :label="showAddtionalFoods == true ? 'hide add-ons' :'show add-ons'" @click="showAddtionalFoods = !showAddtionalFoods" size="xs" flat/></div>
                          </div>
                          <div class="q-pa-sm row justify-between text-caption" v-for="(choice,i) in choiceOfFoodAdd" :key="i" v-show="showAddtionalFoods">
                              <div class="col">{{choice.foodName}} </div> 
                              <div class="col-3 text-right">+ ₱ {{choice.foodPrice}} <span class="text-grey-8 text-weight-light text-caption">per head</span></div>
                          </div>
                           <div class="q-pa-sm row justify-between" v-show="tab !== 'CUSTOMIZE'">
                            <div>Additional Price/Pax Total</div>   
                            <div>₱ {{returnTotalPerPaxAddFood}}</div>
                          </div> 
                          <div class="q-pa-sm row justify-between" v-show="tab !== 'CUSTOMIZE'">
                            <div>Total Price<br><span class="text-caption">of the additional food for <b>{{returnTotalNumberPax}} pax</b></span></div>   
                            <div class="text-orange-8">₱ {{returnTotalPerPaxAddFood * returnTotalNumberPax}}</div>
                          </div>  
                          <q-separator spaced inset />   
                          <div class="q-pa-sm row justify-between text-h6">
                            <div>SUBTOTAL</div>   
                            <div class=" text-orange-8" v-if="tab == 'CUSTOMIZE'">₱ {{returnTotalAfterServicesAddons}}</div>
                            <div class="text-orange-8" v-else>₱ {{returnTotalAfterServicesAddons + (returnTotalPerPaxAddFood * returnTotalNumberPax)}}</div>
                          </div>                        
                          </q-scroll-area>
                        </div>


                        <div class="row justify-between" v-show="details1">
                            <div></div>
                           <q-btn color="orange-8" icon-right="arrow_right" label="food choices" @click="details2 = true,details1 = false,details3 = false,details4 = false,details5 = false" size="sm" flat dense/>
                        </div> 
                        <div class="row justify-between" v-show="details2">
                           <q-btn color="orange-8" icon="arrow_left" label="reservation details" @click="details2 = false,details1 = true,details3 = false,details4 = false,details5 = false" size="sm" flat dense/>
                           <q-btn color="orange-8" icon-right="arrow_right" label="services and addons" @click="details3 = true,details2 = false,details1 = false,details4 = false,details5 = false" size="sm" flat dense/>
                        </div> 
                        <div class="row justify-between" v-show="details3">
                           <q-btn color="orange-8" icon="arrow_left" label="FOOD CHOICES" @click="details3 = false,details2 = true,details1 = false,details4 = false,details5 = false" size="sm" flat dense/>
                           <q-btn color="orange-8" icon-right="arrow_right" label="ADDITIONAL FOOD CHOICES" @click="details4 = true,details3 = false,details1 = false,details2 = false,details5 = false" size="sm" flat dense v-if="tab !== 'CUSTOMIZE'"/>
                           <q-btn color="orange-8" icon-right="arrow_right" label="BILLING" @click="details5 = true,details3 = false,details1 = false,details4 = false,details2 = false" size="sm" flat dense v-else/>
                        </div> 
                        <div class="row justify-between" v-show="details4">
                           <q-btn color="orange-8" icon="arrow_left" label="SERVICES AND ADDONS" @click="details4 = false,details3 = true,details1 = false,details2 = false,details5 = false" size="sm" flat dense/>
                           <q-btn color="orange-8" icon-right="arrow_right" label="BILLING STATEMENT" @click="details5 = true,details4 = false,details1 = false,details2 = false,details3 = false" size="sm" flat dense/>
                        </div> 
                         <div class="row justify-between" v-show="details5">
                           <q-btn color="orange-8" icon="arrow_left" label="ADDITIONAL FOOD CHOICES" @click="details5 = false,details4 = true,details3 = false,details2 = false,details1 = false" size="sm" flat dense/>
                      
                        </div> 
                    </q-card-section>
                 </q-card>
            </div> 
          </q-page-sticky>   
<!-- END OF RIGHT PART -->

        </div>
    </q-page>
</template>
<style>
  #payment-form button {
    display: none
  }
</style>
<script>
import { date } from 'quasar'
import { StripeElements } from 'vue-stripe-checkout';
export default {
  components: {
      StripeElements
  },
  data () {
    return {
      publishableKey: 'pk_test_kUO5j8FaZUKitD1Qh3ibZ2HP00YkxaEOOS', 
      token: null,
      charge: null,
      paydetails: null,
      paymentTerms: 'FULL PAYMENT',
      payOptions: ['FULL PAYMENT','50% DOWNPAYMENT','RESERVATION FEE'],
      showAddtionalFoods: false,
      showSelectedServices: false,
      showSelectedAddons: false,
      agreed: false,
      choiceOfFood: [],
      choiceOfFoodAdd: [],
      selectedPackage: [],
      selectedTheme:[],
      tab: 'PER PAX',   
      step: 1,
      fname: '',
      lname: '',
      pax: 50, 
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
      Category: [],
      Theme: [],
      filter: '',
      pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
      columns: [
          { name: 'name', required: true, label: 'Package name', align: 'center', field: 'name', sortable: true },
          { name: 'price', align: 'center', label: 'Package Per Head Price', field: 'price', sortable: true },
      ],
     reservedate: '' ,
     selectedServices: [],
     serviceQty: [],
     Services: [],
     selectedAddOns: [],
     addOnsQty: [],
     Addons:[],
     details1: true,
     details2: false,
     details3: false,
     details4: false,
     details5: false,
     paymentPermission: false,
     clientUID: '',
     clientEmail: ''
    }
  },
  created(){
      this.reservation = this.$q.localStorage.getItem(this.$route.params.id)
      let self = this
      this.$firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log('with user')
            self.clientUID = user.uid
            self.clientEmail = user.email
            self.paymentPermission = true
          } else {
            self.clientUID = ''
            self.clientEmail = ''
            self.paymentPermission = false
          }
      })
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
      }),
    this.$binding('Theme', this.$firestoreApp.collection('Theme'))
      .then(Theme => {
      console.log(Theme, 'Theme')
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
    mapEvent(){
      let map = this.Event.map(a=>{
        return {
          label:a.event,
          value:a.event
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
              label: a.services+' (₱'+a.price+')',
              value: data
          }
      })
      return map
    },
    mapAddons(){
      let map = this.Addons.map(a=>{
          let data = {...a}
          data.addonsKey = a['.key']
          delete data['.key']
          return {
              label: a.addons+' (₱'+a.price+')',
              value: data
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
            a.packageKey = a['.key']
            return a.type == undefined && a.event == this.reservation.clientEventType
        })
    },
    returnFixed(){
        return this.Packages.filter(a=>{
            let push = {...a}
            a.packageKey = a['.key']
            return a.type == 'FIXED' && a.event == this.reservation.clientEventType
        })        
    },
    foodChoice(){
        try {
          let viands
          if(this.tab == 'CUSTOMIZE') {
            viands = this.Category
          } else {
            viands = this.selectedPackage[0].category
          }
          console.log(viands,'viands')
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
              foodChoices: value,
              price: value[0].foodPrice
            }
          })

          console.log(map,'map')
          return map
        } catch (err) {
          return []
        }
      },
      foodChoiceAddons(){
        console.log(this.choiceOfFood,'foodadons check')
        try {
          let viands
          if(this.tab != 'CUSTOMIZE') {
            viands = this.Category
          }
          console.log(viands,'viands')
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
          let diff = this.$lodash.differenceBy(foodWithPriceInViands,this.choiceOfFood, 'foodName')
          console.log(diff,'removed meron')
          console.log(foodWithPriceInViands,'foodWithPriceInViands for addons')
          let groups = this.$lodash.groupBy(diff,'category')
          console.log(groups,'groups')

          let map = this.$lodash.map(groups,function(value,key){
            return {
              category: key,
              foodChoices: value,
              price: value[0].foodPrice
            }
          })

          console.log(map,'map2 for addons')
          return map
        } catch (err) {
          return []
        }
      },
      returnSelectedPackage(){
        try {
          return this.selectedPackage[0]
        } catch (error) {
          return []
        }
      },
      returnSelectedPackagePrice(){
        try {
          return this.returnSelectedPackage.price
        } catch (error) {
          return 0
        }
      },
      returnSelectedPackageInclusions(){
        try {
          return this.returnSelectedPackage.inclusions
        } catch (error) {
          return []
        }
      },
      returnPaxFixed(){
        try {
          let text
          let selected = this.returnSelectedPackage
          if(selected.withKid == true){
            text = selected.adultPax+ 'adults & ' +selected.kidPax+ ' kids'
          } else {
            text = selected.adultPax
          }
          return text
        } catch (error) {
          return []
        }
      },
      returnSelectedPackageFreebies(){
        try {
          if(this.returnSelectedPackage.type =='FIXED'){
            let addons = this.returnSelectedPackage.addons
            let services = this.returnSelectedPackage.services
            let concat = this.$lodash.concat(addons,services)
            console.log(concat,'concat')
            // console.log(map,'concat')
            let map = concat.map(a=>{
              if(a.addons !== null && a.services == null){
                a.name = a.addons
                a.qty = a.addOnsQty
              } else  {
                a.name = a.services
                a.qty = a.serviceQty
              } 
              return a
            })
            console.log(map,'concat')
            return map
          } else {
            return []
          }

        } catch (error) {
          return []
        }
      },
      returnPerPaxTotal(){
        try {
          let packages = this.returnSelectedPackage
          if(this.tab !== 'CUSTOMIZE'){
            if(packages.type == 'FIXED'){
              return packages.price
            } else {
              return packages.price * this.pax
            }
          } else {
            return this.returnCustomPerHeadPrice * this.pax
          }

        } catch (error) {
          return 0
        }
      },
      mergePricingAddons(){
        let keys = this.$lodash.keys(this.addOnsQty)
        console.log(keys,'keys')  

        if(this.selectedAddOns.length != keys.length){
            console.log('no pricing')
            return 0
        } 
        let merge = []
        for( var x = 0; x < this.selectedAddOns.length; x++){
            let m = {...this.selectedAddOns[x]}
            delete m.foods
            m.addonsQty = this.addOnsQty[m.addons]
            merge.push(m)
        }

        console.log(merge,'merge')
        return merge
      },
      returnSelectedAddonsTotal(){
        try {
            let select = this.mergePricingAddons
            let sumMin = this.$lodash.sumBy(select, m=>{
                return parseInt(m.price) * parseInt(m.addonsQty)
            })

            return sumMin
        } catch(err){
            return 0
        }
      },
      mergePricingServices(){
        let keys = this.$lodash.keys(this.serviceQty)
        console.log(keys,'keys')

        if(this.selectedServices.length != keys.length){
            console.log('no pricing')
            return 0
        } 
        let merge = []
        for( var x = 0; x < this.selectedServices.length; x++){
            let m = {...this.selectedServices[x]}
            delete m.foods
            m.servicesQty = this.serviceQty[m.services]
            merge.push(m)
        }

        console.log(merge,'merge')
        return merge
      },
      returnSelectedServicesTotal(){
        try {
            let select = this.mergePricingServices
            let sumMin = this.$lodash.sumBy(select, m=>{
                return parseInt(m.price) * parseInt(m.servicesQty)
            })

            return sumMin
        } catch(err){
            return 0
        }
      },
      returnTotalAfterServicesAddons(){
        return parseInt(this.returnPerPaxTotal) + parseInt(this.returnSelectedServicesTotal) + parseInt(this.returnSelectedAddonsTotal)
      },
      returnTotalPerPaxAddFood(){
        try {
          return this.$lodash.sumBy(this.choiceOfFoodAdd,a=>{return parseInt(a.foodPrice)})
        } catch (error) {
          return 0
        }
      },
      returnTotalNumberPax(){
        try {
          let selected = this.selectedPackage[0]
          if(selected.type == 'FIXED'){
            if(selected.withKid){
              return parseInt(selected.adultPax) + parseInt(selected.kidPax)
            } else {
              return parseInt(selected.adultPax)
            }
          } else {
            return parseInt(this.pax)
          }
        } catch (error) {
          return 0
        }
      },
      returnTotalPriceAfterFoodAddOns(){
        try {
          return parseInt(this.returnTotalAfterServicesAddons) + (parseInt(this.returnTotalPerPaxAddFood)*parseInt(this.returnTotalNumberPax))
        } catch (error) {
          return this.returnTotalAfterServicesAddons 
        }
      },
      returnCustomPerHeadPrice(){
        return this.$lodash.sumBy(this.choiceOfFood, a=> {return parseInt(a.foodPrice)})
      },
      returnPaymentAmount(){
        let pay = this.paymentTerms
        let total = this.returnTotalPriceAfterFoodAddOns
        let totalCustom = this.returnTotalAfterServicesAddons
        if(pay == 'FULL PAYMENT'){
          if(this.tab !== 'CUSTOM'){
            return total
          } else {
            return totalCustom
          } 
        } else if (pay == '50% DOWNPAYMENT'){
          if(this.tab !== 'CUSTOM'){
            return total * .5
          } else {
            return totalCustom * .5
          }           
        } else if (pay == 'RESERVATION FEE'){
          return 5000
        } else {
          return 1000000
        }
      },

  },
  methods:{
    stepChecker(){
        
    },
    dateToday(dates){
        // console.log('dates',dates)
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
      if(this.tab !== 'CUSTOMIZE'){
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
    returnSelectedStatusAdd(choice){
      let count = this.$lodash.findIndex(this.choiceOfFoodAdd, a=>{
        return a.foodName == choice.foodName
      })
      // console.log(count,'index')
      if(count > -1){
        return true
      } else {
        return false
      }
    },
    returnSelectedStatusTheme(choice){
      let count = this.$lodash.findIndex(this.selectedTheme, a=>{
        return a.themeName == choice.themeName
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

    },
    clickUnclickAdd(choice){
      let index = this.findIndexSelection(this.choiceOfFoodAdd,choice)
      
      if(index > -1){
        console.log(index,'index')
        this.choiceOfFoodAdd.splice(index,1)
      } else {
        this.choiceOfFoodAdd.push(choice)
      }

    },
    clickUnclickAddTheme(choice){
      
      let index = this.findIndexSelection(this.selectedTheme,choice)
      
      if(index > -1){
        console.log(index,'index')
        this.selectedTheme.splice(index,1)
      } else {
        this.selectedTheme.push(choice)
        this.checkTheme()
      }

    },
    clickTrue(){
      let selected = this.selectedPackage[0]
      console.log(selected,'selectedPackage')
      if(selected.type == 'FIXED'){
        console.log('true fixed')
          this.$q.dialog({
            title: 'You have selected a fixed package.',
            message: 'This will modify the number of pax you entered.',
            ok: 'Ok',
            cancel: 'Cancel',
            persistent: true
          }).onCancel(()=>{
            this.selectedPackage = []
          })
      } else {
        console.log('oh shit')
      }
    },
    checkTheme(){
      if(this.selectedTheme.length > 1){
        this.selectedTheme.splice(0,1)
      }
    },
    checkInput(type){
      if(type == 'addons'){
          this.selectedAddOns = this.returnUniq(this.selectedAddOns)
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
    checkIfRemovedServices(serviceValue){
        let service = serviceValue.services
        console.log(service,'servicehcekc')
        var index = this.findIndexSelection(this.selectedServices,service)
        if(index == -1){
            delete this.serviceQty[service]
            console.log(this.serviceQty,'this.serviceQty')
        }
    },
    checkIfRemovedAddons(addonsValue){
        let addons = addonsValue.addons
        var index = this.findIndexSelection(this.selectedAddOns,addons)
        if(index == -1){
            delete this.addOnsQty[addons]
            console.log(this.addOnsQty,'this.addOnsQty')
        }
    },
    findIndexSelection(arr,val){
      return this.$lodash.findIndex(arr,val)
    },
    formatTimeInput(time){
      //get time to format for display
      let baseDate = new Date(2020,1,1)
      let arr = time.split(':')
      let formatTime = date.addToDate(baseDate, {hours:arr[0],minutes:arr[1]})

      return this.$moment(formatTime).format('LT')
    },
    returnServiceQty(service){
      try {
        if(this.serviceQty[service] == null){
          return 'NO QTY!'
        } else {
          return this.serviceQty[service]
        }
      } catch (error) {
        return 'NO QTY'
      }
    },
    returnAddOnsQty(add){
      try {
        if(this.addOnsQty[add] == null){
          return 'NO QTY!'
        } else {
          return this.addOnsQty[add]
        }
      } catch (error) {
        return 'NO QTY'
      }
    },
    submit () {
      this.$refs.elementsRef.submit();
    },
    tokenCreated (token) {
      this.token = token;
      console.log(token,'token')
      // for additional charge objects go to https://stripe.com/docs/api/charges/object
      this.charge = {
        source: token.card,
        amount: this.returnPaymentAmount,
      }
      this.sendTokenToServer(this.charge);
    },
    sendTokenToServer (charge) {
      // Send to server
      console.log(charge,'charge')
      if(this.amount === 0){
        this.$q.dialog({
            title: `Unable to Continue??`,
            message: 'Please Select Payment Type??',
            color: 'orange-8',
            textColor: 'grey',
            icon: 'negative',
            ok: 'Ok'
        })
      }else{
          this.paydetails = charge
          this.reservenowCard()
      }
    },
    reservenowCard(){
      let reserveDetails = {
        clientReserveDate: this.reservedate,
        clientFName: this.fname, // from display name if login via google
        clientLName: this.lname, // from display name if login via google
        clientPlace: this.place,
        clientCity: this.city,
        clientEvent: this.reservation.clientEvent,
        clientMotif: this.motif,
        clientPax: this.returnTotalNumberPax,
        clientPaxDetails: this.tab === 'FIXED' ? this.returnPaxFixed : 'NONE',
        clientEmail: this.clientEmail, // gmail
        clientStartTime: this.formatTimeInput(this.sTime),
        clientEndTime: this.formatTimeInput(this.eTime),
        clientSelectTheme: this.selectedTheme,
        clientSelectPackage: this.tab === 'CUSTOMIZE' ? 'CUSTOMIZE' : this.selectedPackage[0],
        clientPackageType: this.tab,
        clientFoodChoice: this.choiceOfFood,
        clientAdditionalFood: this.choiceOfFoodAdd,
        clientServices: this.mergePricingServices,
        clientAddons: this.mergePricingAddons,
        clientTotalPayment: this.tab === 'CUSTOMIZE' ? this.returnTotalAfterServicesAddons : this.returnTotalPriceAfterFoodAddOns, //total payment
        clientPaidAmount: this.returnPaymentAmount,
        clientPayDetails: this.paydetails,
        clientTokenID: this.token.id,
        clientPaymentType: 'CARD',
        clientReserveType: 'ONLINE',
        clientUID: this.clientUID,
        clientDateofReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
      }
      console.log(reserveDetails,'reserveDetails')
      this.$firestoreApp.collection('Reservation').add(reserveDetails)
      .then((ref) =>{
        let key = ref.id
        let paymentDetails = {
            clientReservationKey: ref.id,
            clientPayDetails: this.paydetails,
            clientTokenID: this.token.id,
            clientPaymentType: 'CARD',
            clientUID: this.clientUID,
            clientEmail: this.clientEmail,
            clientPaymentDate: date.formatDate(new Date(), 'YYYY-MM-DD')
        }
            this.$firestoreApp.collection('Payments').add(paymentDetails)
            .then(()=>{
                this.$q.notify({
                  message: 'RESERVED!',
                  icon: 'mdi-folder-plus-outline',
                  color: 'orange-8',
                  textColor: 'white',
                  position: 'bottom'
                })
                this.$router.push('/profile')
            })
        })
    },
    loginGoogle(){
        var provider = new this.$firebase.auth.GoogleAuthProvider();
        this.$firebase.auth().signInWithPopup(provider)
        .then((result)=>{
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          console.log('token',token)
          console.log('user',user)

          var uid = user.uid

          //save user details in database with token / set to update always when login in
          let newUser = {
            gAccessToken: token,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            refreshToken: user.refreshToken
          }

          this.$firestoreApp.collection('Customers').doc(uid).set(newUser)
          .then(()=>{
            console.log('saved user')
            //save progress for future reference
            // console.log('progress', this.returnProgress)

          })

          console.log('newUser',newUser)

        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        console.log('error',errorCode)
        console.log('error',errorMessage)
        this.$q.dialog({
            title: errorCode,
            message: errorMessage,
            color: 'pink-6',
            textColor: 'grey',
            icon: 'negative',
            ok: 'Ok'
        })
        // ...
        });
                  
    },
  }
}
</script>