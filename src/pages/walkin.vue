<template>
    <q-page class="row">
          <div class="q-pa-sm col-8">
              <q-stepper header-nav v-model="step" ref="stepper" color="deep-orange-4" vertical falt active-color="orange-8" inactive-color="blue-10" animated>
                <q-step :name="1" v-show="step === 1" title="Select Available Date" icon="settings" :done="step > 1">
                  <div class="column items-center">
                     <q-date v-model="date" minimal class="shadow-0" mask="YYYY-MM-DD" color="orange-8" ></q-date> 
                  </div>
                </q-step>

                <q-step :name="2" v-show="step === 2" title="Fill up Information" icon="create_new_folder" :done="step > 2">
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
                  <div class="row">
                    <q-input filled color="orange-8" outlined class="col-8 q-pa-sm" v-model="place" label="Enter Event Place" />
                    <q-select filled class="q-pa-sm col-4" color="orange-8" outlined v-model="selectCity" :options="cityOpt" emit-value map-options label="Select City" />
                  </div>
                  <div class="row">
                    <q-select filled class="q-pa-sm col-4" color="orange-8" outlined v-model="selectMotif" :options="motifOpt" emit-value map-options label="Select Motif" />
                    <q-select filled class="q-pa-sm col-4" color="orange-8" outlined v-model="selectEvent" :options="eventOpt" emit-value map-options label="Select Event" />
                    <q-input filled color="orange-8" outlined class="col-4 q-pa-sm" v-model="email" label="Enter Email Address" />
                  </div>  
                </q-step>

                <q-step :name="3" v-show="step === 3" title="Select Package" icon="assignment" :done="step > 3">
                  <q-tabs
                      v-model="tab"
                      class="text-orange-8 bg-grey-2"
                      align="justify"
                      @click="returnNull"
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
                </q-step>

                <q-step :name="4" v-show="step === 4" title="Select Food" icon="add_comment">
                  <div v-for="(food,i) in foodChoice" :key="i" v-show="selectedPackage != null">
                      <span class="q-mb-none q-mt-md text-subtitle2"> Select <span class="text-teal text-h6 text-weight-bolder">{{returnLimit(food.category)}}</span> Choice<span v-show="returnLimit(food.category) > 1">s</span> of {{food.category}}  </span>
                      <div class="row">
                        <q-img v-for="(choice,j) in food.foodChoices" :key="j" :src="choice.foodPic" :ratio="1" class="col-3 q-ma-md rounded-borders" :style="returnSelectedStatus(choice) ? 'transform: scale(0.95);border: 4px solid;border-color: #010A43;' : ''">
                        <div class="absolute-bottom text-overline">
                          <q-checkbox color="orange-8" v-model="choiceOfFood" :val="choice" :label="choice.foodName" @input="consoleChoice,checkQty(choice,returnLimit(food.category),food.category)"/>
                        </div>
                        </q-img>
                      </div>
                    </div>
                    <div class="row">
                      <div class="text-subtitle2 q-mb-sm full-width">Package Includes The Following:</div>
                      <q-card flat style="max-width: 150px" class="my-card bg-grey-3 col-3 q-ma-md" v-for="(inc,i) in returnSelectedPackageInclusion" :key="i">
                        <q-card-section>
                            <!-- <q-checkbox color="pink-3" dense v-model="choiceOfInclusions" :val="inc" :label="inc.inclusion" />-->
                            {{inc.inclusion}} 
                        </q-card-section>
                      </q-card>
                  </div>
                </q-step>

                <q-step :name="5" v-show="step === 5" title="Add Services??" icon="add_comment">
                  <div class="my-card q-ml-md q-mr-md q-mb-md q-pa-sm q-py-md" >
                      <div class="text-grey-8">
                          <span class="text-h6 text-weight-light">
                          Select Services
                          </span>
                      </div>
                      <div class="q-gutter-xs">
                          <q-checkbox v-model="servicesSelected" @input="consoleServices" :val="i" :label="i.services+' ('+ i.price +' php)'" color="orange-8" v-for="(i, index) in this.Services" :key="index"/>
                      </div>
                  </div>
                  <div v-show="this.servicesSelected.length != 0">
                        <div class="my-card q-ma-md q-pa-md bg-grey-2" flat>
                            <div>
                                <div class="text-h6 text-weight-light">
                                Please Enter Quantity
                                </div>
                                <q-list dense class="text-left text-grey-8 bg-grey-2" >
                                    <q-item dense v-for="(i, index) in this.servicesSelected" :key="index">
                                        <q-item-section>
                                            <!-- <q-item-label dense class="q-pl-md" lines="1" v-if="i.min == undefined">{{i.category}}</q-item-label> -->
                                            <q-item-label dense class="q-pl-md" lines="1">{{i.services+' ('+ i.price +' Pesos)'}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-input color="orange-8" outlined="" class="q-ma-sm" type="number" dense min="0" v-model="servicesQty[i.services]" label="Qty"/>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </div>
                        </div>
                    </div>
                </q-step>
                <q-step :name="6" v-show="step === 6" title="Add Add-Ons??" icon="add_comment">
                  <div class="my-card q-ml-md q-mr-md q-mb-md q-pa-sm q-py-md" >
                      <div class="text-grey-8">
                          <span class="text-h6 text-weight-light">
                          Select Add-Ons
                          </span>
                      </div>
                      <div class="q-gutter-xs">
                          <q-checkbox v-model="addonsSelected" :val="i" :label="i.addons+' ('+ i.price +' php)'" color="orange-8" v-for="(i, index) in this.Addons" :key="index"/>
                      </div>
                  </div>
                  <div v-show="this.addonsSelected.length != 0">
                      <div class="my-card q-ma-md q-pa-md bg-grey-2" flat>
                          <div>
                              <div class="text-h6 text-weight-light">
                              Please Enter Quantity
                              </div>
                              <q-list dense class="text-left text-grey-8 bg-grey-2" >
                                  <q-item dense v-for="(i, index) in this.addonsSelected" :key="index">
                                      <q-item-section>
                                          <!-- <q-item-label dense class="q-pl-md" lines="1" v-if="i.min == undefined">{{i.category}}</q-item-label> -->
                                          <q-item-label dense class="q-pl-md" lines="1">{{i.addons+' ('+ i.price +' Pesos)'}}</q-item-label>
                                      </q-item-section>
                                      <q-item-section side>
                                          <q-input color="orange-8" outlined="" class="q-ma-sm" type="number" dense min="0" v-model="addonsQty[i.addons]" label="Qty"/>
                                      </q-item-section>
                                  </q-item>
                              </q-list>
                          </div>
                      </div>
                  </div>
                </q-step>
                <q-step :name="7" v-show="step === 7" title="Billing" icon="add_comment">
                  <div class="row flex flex-center q-pa-sm">
                    <q-img src="statics/logo.png" :ratio="1" style="width:3.5em;" class="q-ml-sm"/>
                  <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
                    <strong>Crissy's Meal Magic Catering Services</strong>
                  </q-toolbar-title>
                  </div>
                  <div class="row">
                     <p class="col-8"><span class="q-pa-sm">Fullname:</span> <strong>{{fname}} {{lname}}</strong></p>
                     <p class="col-4"><span class="q-pa-sm">Date of Events:</span> <strong>{{date}}</strong></p>
                  </div>
                  <div style="margin-top:-15px" class="row">
                     <p class="col-8"><span class="q-pa-sm">Pax:</span> <strong>{{pax}}</strong></p>
                     <div class="col-4 row">
                       <p><span class="q-pa-sm">Start Time:</span> <strong>{{starttime}}</strong></p>
                       <p><span class="q-pa-sm">End Time:</span> <strong>{{endtime}}</strong></p>
                     </div>
                  </div>
                  <div style="margin-top:-15px" class="row">
                     <p class="col-8"><span class="q-pa-sm">Event's Place:</span> <strong>{{place}} {{selectCity}}</strong></p>
                     <p class="col-4"><span class="q-pa-sm">Event:</span> <strong>{{selectEvent}}</strong></p>
                  </div>
                  <div style="margin-top:-15px" class="row">
                     <p class="col-8"><span class="q-pa-sm">Email Address:</span> <strong>{{email}}</strong></p>
                     <p class="col-4"><span class="q-pa-sm">Motif:</span> <strong>{{selectMotif}}</strong></p>
                  </div>
                  <div class="column items-center q-pb-sm q-pt-none q-mt-none">
                      <div class="column items-center text-h6">Order Details</div>
                  </div>
                  <div class="row">
                          <div class="q-pa-sm col-6">
                              <div><b>Choice Of Food:</b></div>
                                  <div class="q-px-md" v-for="(choice,i) in returnChoiceOfFood" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q">
                                      <div dense class="col q-mr-sm">x1 {{pick.foodName}}</div>
                                      <!-- <div dense class="col-1 text-weight-bold">x 1</div> -->
                                    </div>
                                  </div>
                          </div>
                          <div class="q-pa-sm col-6"> 
                              <div style="margin-left: 135px"><b>Inclusions: </b></div>
                                  <q-list v-for="(inc,i) in returnSelectedPackageInclusion" :key="i" dense>
                                    <q-item dense>
                                        <q-item-section>
                                          <q-item-label class="q-mt-none q-pt-none">
                                            <li>
                                              {{inc.inclusion}}
                                            </li>
                                          </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                          </div>
                      </div>
                      <div class="row">
                        <div v-show="this.servicesSelected.length != 0" class="q-pa-sm col-6">
                            <div>
                                <div><b>Services:</b></div>
                                <q-item v-show="servicesQty[i.services] != 0" dense v-for="(i, index) in this.servicesSelected" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense v-if="i.price == undefined">{{servicesQty[i.services]}}x {{i.services}}</q-item-label>
                                        <q-item-label dense v-else>{{servicesQty[i.services]}}<b v-show="servicesQty[i.services] != 0">x</b> {{i.services+' ('+ i.price +' php)'}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                        <div v-show="this.addonsSelected.length != 0" class="q-pa-sm col-6">
                            <div>
                                <div><b>Add-Ons:</b></div>
                                <q-item dense v-for="(i, index) in this.addonsSelected" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense v-if="i.price == undefined">{{addonsQty[i.addons]}}x {{i.addons}}</q-item-label>
                                        <q-item-label dense v-else>{{addonsQty[i.addons]}}<b v-show="addonsQty[i.addons] != 0">x</b> {{i.addons+' ('+ i.price +' php)'}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                      </div>
                      <div>
                         <!-- <div class="row">
                           <strong class="q-pa-sm">Package Price:</strong><span class="text-h6 weight-bold">{{packPrice}}</span>
                         </div> -->
                         <div class="row">
                           <strong class="q-pa-sm row">Total Package Price:</strong><span class="text-h6 weight-bold">{{totalPackPrice}}</span>
                         </div>
                         <div v-show="this.servicesSelected.length != 0" class="row">
                           <strong class="q-pa-sm row">Total Services Price:</strong><span class="text-h6 weight-bold">{{returnSelectedMinMaxServices}}</span>
                         </div>
                         <div v-show="this.addonsSelected.length != 0" class="row">
                           <strong class="q-pa-sm row">Total Add-Ons Price:</strong><span class="text-h6 weight-bold">{{returnSelectedMinMaxAddons}}</span>
                         </div>
                         <div class="row">
                           <strong class="q-pa-sm row">Total Payment:</strong><span class="text-h6 weight-bold">{{totalpayment}}</span>
                         </div>
                         <div class="row">
                           <strong class="q-pa-sm row">50% Down Payment:</strong><span class="text-h6 weight-bold">{{downpayment}}</span>
                         </div>
                      </div>
                </q-step>
                <q-step :name="8" v-show="step === 8" title="Billing" icon="add_comment">
                    <q-select @input="amounttopay" color="orange-8" outlined filled v-model="selectPayment" :options="options" label="Select Payment" />
                    <div v-show="this.selectPayment != ''">
                       <div class="column items-center q-pb-sm q-pt-sm q-mt-sm">
                        <div class="column items-center text-h6">Pay via Card</div>
                      </div>
                      <div class="container row q-pa-sm">
                        <stripe-elements ref="elementsRef" color="orange-8" :pk="publishableKey" :amount="amount" @token="tokenCreated" @loading="loading = $event" outline class="col-8 q-mr-md">
                        </stripe-elements>
                        <q-btn outlined color="orange-8" class="col" size="md" @click="submit">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{amount}}</b></q-btn>
                        <!-- <button @click="submit">Pay ${{amount / 100}}</button> -->
                      </div>
                      <div class="column items-center q-pb-sm q-pt-sm q-mt-sm">
                        <div class="column items-center text-h6">Pay via Cash</div>
                      </div>
                      <div class="container row q-pa-sm">
                        <q-input type="number" readonly class="q-pa-sm col-8" color="orange-8" outlined v-model="enterAmount" label="Amount To Pay"/>
                        <q-btn outlined color="orange-8" style="height: 55px; margin-top: 8px" class="q-pa-sm col-4 col" @click="reservenowCash" dense>PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{enterAmount}}</b></q-btn>
                      </div>
                    </div>
                </q-step>

                <template v-slot:navigation>
                  <q-stepper-navigation align="right">
                    <q-btn v-if="step > 1" flat style="color: #010A43" @click="stepBacker" label="Back" class="q-ml-sm" />
                    <q-btn v-show="step < 8" @click="stepChecker" color="orange-8" :label="step === 8 ? 'Finish' : 'Continue'" />
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
                          <div v-show="this.tab === 'PER PAX'" class="q-pa-sm col-6">
                              <div><b>Choice Of Food:</b></div>
                                <q-scroll-area style="height:30vh" :visible="true">
                                  <div class="q-px-md" v-for="(choice,i) in returnChoiceOfFood" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q">
                                      <div dense class="col q-mr-sm">x1 {{pick.foodName}}</div>
                                      <!-- <div dense class="col-1 text-weight-bold">x 1</div> -->
                                    </div>
                                  </div>
                                </q-scroll-area>
                          </div>
                          <div v-show="this.tab === 'FIXED'" class="q-pa-sm col-6">
                              <div><b>Choice Of Food:</b></div>
                                <q-scroll-area style="height:30vh" :visible="true">
                                  <div class="q-px-md" v-for="(choice,i) in returnFree.category" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <!-- <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q"> -->
                                      <div dense class="col q-mr-sm">x{{choice.viandsQty}} {{choice.category}}</div>
                                      <!-- <div dense class="col-1 text-weight-bold">x 1</div> -->
                                    <!-- </div> -->
                                  </div>
                                </q-scroll-area>
                          </div>
                          <div v-show="this.tab === 'PER PAX'" class="q-pa-sm col-6"> 
                              <div><b>Inclusions: </b></div>
                                <q-scroll-area style="height:30vh" :visible="true">
                                  <q-list v-for="(inc,i) in returnSelectedPackageInclusion" :key="i" dense>
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label lines="1">{{inc.inclusion}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-scroll-area>
                          </div>
                          <div v-show="this.tab === 'FIXED'" class="q-pa-sm col-6"> 
                              <div><b>Inclusions: </b></div>
                                <q-scroll-area style="height:30vh" :visible="true">
                                  <q-list v-for="(inc,i) in returnFree.inclusions" :key="i" dense>
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label lines="1">{{inc.inclusion}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-scroll-area>
                          </div>
                      </div>
                      <div>
                        <q-separator inset class="black"/>
                      </div>
                      <div class="row">
                        <div class="q-pa-sm col-6">
                            <div v-show="this.tab === 'PER PAX'">
                                <div><b>Services:</b> <strong>{{returnSelectedMinMaxServices}}</strong></div>
                                <q-scroll-area style="height:35vh" :visible="true">
                                <q-item v-show="servicesQty[i.services] != 0" dense v-for="(i, index) in this.servicesSelected" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense v-if="i.price == undefined">{{servicesQty[i.services]}}x {{i.services}}</q-item-label>
                                        <q-item-label dense v-else>{{servicesQty[i.services]}}<b v-show="servicesQty[i.services] != 0">x</b> {{i.services+' ('+ i.price +' php)'}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                </q-scroll-area>
                            </div>
                            <div v-show="this.tab === 'FIXED'">
                                <div><b>Services:</b></div>
                                <q-scroll-area style="height:35vh" :visible="true">
                                <q-item dense v-for="(i, index) in this.returnFree.services" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense>{{i.services}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                </q-scroll-area>
                            </div>
                        </div>
                        <div class="q-pa-sm col-6">
                            <div v-show="this.tab === 'PER PAX'">
                                <div><b>Add-Ons:</b> <strong>{{returnSelectedMinMaxAddons}}</strong></div>
                                <q-scroll-area style="height:35vh" :visible="true">
                                <q-item dense v-for="(i, index) in this.addonsSelected" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense v-if="i.price == undefined">{{addonsQty[i.addons]}}x {{i.addons}}</q-item-label>
                                        <q-item-label dense v-else>{{addonsQty[i.addons]}}<b v-show="addonsQty[i.addons] != 0">x</b> {{i.addons+' ('+ i.price +' php)'}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                </q-scroll-area>
                            </div>
                            <div v-show="this.tab === 'FIXED'">
                                <div><b>Add-Ons:</b></div>
                                <q-scroll-area style="height:35vh" :visible="true">
                                <q-item dense v-for="(i, index) in this.returnFree.addons" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense>{{i.addons}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                </q-scroll-area>
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
import { date } from 'quasar'
import { StripeElements } from 'vue-stripe-checkout';
import { moment } from 'moment'
export default {
  components: {
      StripeElements
  },
  data () {
    return {
        filter: '',
        selectedPackage: [],
        enterAmount: 0,
        loading: false,
        amount: 0,
        publishableKey: 'pk_test_kUO5j8FaZUKitD1Qh3ibZ2HP00YkxaEOOS', 
        token: null,
        charge: null,
        selectPayment: '',
        pax: 0,
        endtime: date.formatDate(new Date(), '10:50'),
        starttime: date.formatDate(new Date(), '12:50'),
        Motif: [],
        servicesSelected: [],
        selected: [],
        addonsSelected: [],
        addonsQty: [],
        Packages: [],
        tab: 'PER PAX',
        Food: [],
        servicesQty: [],
        choiceOfFood: [],
        choiceOfInclusions: [],
        Services: [],
        Addons: [],
        Event: [],
        City: [],
        selectEvent: '',
        selectMotif: '',
        place: '',
        email: '',
        selectCity: '',
        lname: '',
        fname: '',
        step: 1,
        splitterModel: 50,
        date: date.formatDate(new Date(),'YYYY-MM-DD'),
        options: [
           { label: 'Full Payment', value: 'Full Payment' },
           { label: 'Down Payment', value: 'Down Payment' },
           { label: 'Reservation Fee', value: 'Reservation Fee' }
        ],
        columns: [
            { name: 'name', required: true, label: 'Package name', align: 'center', field: 'name', sortable: true },
            { name: 'price', align: 'center', label: 'Package Per Head Price', field: 'price', sortable: true },
        ],
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
            }),
        this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            console.log(Food, 'Food')
            }),
        this.$binding('Addons', this.$firestoreApp.collection('Addons'))
            .then(Addons => {
            console.log(Addons, 'Addons')
            }),
        this.$binding('Services', this.$firestoreApp.collection('Services'))
            .then(Services => {
            console.log(Services, 'Services')
            }),
        this.$binding('City', this.$firestoreApp.collection('City'))
            .then(City => {
            console.log(City, 'City')
            })
  },
  computed: {
      returnFree(){
         if(this.selectedPackage.length === 0){
            return []
         } else {
            return this.selectedPackage[0]
         }
      },
      returnPerPax(){
        return this.Packages.filter(a=>{
            return a.type == undefined && a.event == this.selectEvent
        })
      },
      returnFixed(){
        return this.Packages.filter(a=>{
            return a.type == 'FIXED' && a.event == this.selectEvent
        })        
      },
      totalpayment(){
          try {
                let totalpack =  parseInt(this.totalPackPrice) + parseInt(this.returnSelectedMinMaxServices) + parseInt(this.returnSelectedMinMaxAddons)
                return totalpack
            } catch(err){
                return 0
            }
      },
      downpayment(){
          try { 
                let totalpack =  parseInt(this.totalpayment) * .50
                return totalpack
            } catch(err){
                return 0
            }
      },
      packPrice(){
        if(this.selectedPackage.length == 0){
          return 0
        }else{ 
          return this.selectedPackage[0].price
        }
      },
      totalPackPrice(){
          try {
                let totalpack =  parseInt(this.pax) * parseInt(this.selectedPackage[0].price)
                return totalpack
            } catch(err){
                return 0
            }
      },
      mergePricingAddons(){

                let keys = this.$lodash.keys(this.addonsQty)
                console.log(keys,'keys')

                if(this.addonsSelected.length != keys.length){
                    console.log('no pricing')
                    return 0
                } 
                let merge = []
                for( var x = 0; x < this.addonsSelected.length; x++){
                    let m = {...this.addonsSelected[x]}
                    delete m.foods
                    m.addonsQty = this.addonsQty[m.addons]
                    merge.push(m)
                }

                console.log(merge,'merge')
                return merge
            },
      returnSelectedMinMaxAddons(){
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

                let keys = this.$lodash.keys(this.servicesQty)
                console.log(keys,'keys')

                if(this.servicesSelected.length != keys.length){
                    console.log('no pricing')
                    return 0
                } 
                let merge = []
                for( var x = 0; x < this.servicesSelected.length; x++){
                    let m = {...this.servicesSelected[x]}
                    delete m.foods
                    m.servicesQty = this.servicesQty[m.services]
                    merge.push(m)
                }

                console.log(merge,'merge')
                return merge
            },
      returnSelectedMinMaxServices(){
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
      returnChoiceOfFood(){
        try {
          let groups = this.$lodash.groupBy(this.choiceOfFood,'category')
          console.log(groups,'groups')

          let map = this.$lodash.map(groups,function(value,key){
            return {
              category: key,
              foodChoices: value
            }
          })

          console.log(map,'mapChoices')

          return map
        } catch (err){
          return []
        }
      },
      returnSelectedPackageInclusion(){
        try {
          return this.selectedPackage[0].inclusions
        } catch (err) {
          return []
        }
      },
      foodChoice(){
        try {
          let category = this.selectedPackage[0].category
          console.log(category)
          let foodWithPriceInCategory = []
          let foods =  this.Food
          for(var x = 0; x < foods.length; x++){
            for(var y=0; y < category.length; y++){
              if(foods[x].foodPrice != null && foods[x].category == category[y].category){
                let push = {...foods[x]}
                let key = push['.key']
                delete push['.key']
                push.foodKey = key
                foodWithPriceInCategory.push(push)
              }
            }
          }
          console.log(foodWithPriceInCategory,'foodWithPriceInCategory')
          let groups = this.$lodash.groupBy(foodWithPriceInCategory,'category')
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
      cityOpt(){
                let optionss = this.City.map(m => {
                    return {
                        label: m.city,
                        value: m.city
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
    stepBacker(){
        if(this.step === 8){
            if(this.tab === 'FIXED'){
                this.step = 4
            } else {
              this.$refs.stepper.previous()
            }
        }else{
              this.$refs.stepper.previous()
        }
    },
    stepChecker(){
        if(this.step === 1){
            this.$refs.stepper.next()
        } else if(this.step === 2){
            this.$refs.stepper.next()
        } else if(this.step === 3){
            this.$refs.stepper.next()
        } else if(this.step === 4){
            if(this.tab === 'FIXED'){
                this.step = 8
            } else {
              this.$refs.stepper.next()
            }
        } else{
            this.$refs.stepper.next()
        }
    },
    returnNull(){
       this.selectedPackage = []
    },
    formatTimeInput(time){
      //get time to format for display
      let baseDate = new Date(2020,1,1)
      let arr = time.split(':')
      let formatTime = date.addToDate(baseDate, {hours:arr[0],minutes:arr[1]})

      return this.$moment(formatTime).format('LT')
    },
    reservenowCard(){
        let reserveDetails = {
            clientReserveDate: this.date,
            clientFName: this.fname,
            clientLName: this.lname,
            clientPlace: this.place,
            clientCity: this.selectCity,
            clientEvent: this.selectEvent,
            clientMotif: this.selectMotif,
            clientPax: this.pax,
            clientEmail: this.email,
            clientStartTime: this.formatTimeInput(this.starttime),
            clientEndTime: this.formatTimeInput(this.endtime),
            clientSelectPackage: this.selectedPackage[0],
            clientFoodChoice: this.choiceOfFood,
            clientServices: this.servicesSelected,
            clientAddons: this.addonsSelected,
            clientTotalPayment: this.totalpayment,
            clientPaidAmount: this.enterAmount,
            clientPayDetails: this.paydetails,
            clientTokenID: this.token.id,
            clientPaymentType: 'CARD',
            clientReserveType: 'WALK-IN',
            clientDateofReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
            }
            this.$firestoreApp.collection('Reservation').add(reserveDetails)
            .then((ref) =>{
              let key = ref.id
              let paymentDetails = {
                  clientReservationKey: ref.id,
                  clientPayDetails: this.paydetails,
                  clientTokenID: this.token.id,
                  clientPaymentType: 'CARD',
              }
                  this.$firestoreApp.collection('Payments').add(paymentDetails)
                  .then(()=>{
                      this.$q.notify({
                        message: 'RESERVED!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'orange-8',
                        textColor: 'white',
                        position: 'center'
                      })
                  })
              })
                  this.date = date.formatDate(new Date(),'YYYY-MM-DD'),
                  this.fname = ''
                  this.lname = ''
                  this.place = ''
                  this.selectCity = ''
                  this.selectEvent = ''
                  this.selectMotif = ''
                  this.pax = 0 
                  this.email = ''
                  this.starttime = date.formatDate(new Date(), '10:50'),
                  this.endtime = date.formatDate(new Date(), '10:50'),
                  this.selectedPackage = []
                  this.choiceOfFood = []
                  this.servicesSelected = []
                  this.addonsSelected = []
                  this.step = 1
    },
    reservenowCash(){
        let reserveDetails = {
            clientReserveDate: this.date,
            clientFName: this.fname,
            clientLName: this.lname,
            clientPlace: this.place,
            clientCity: this.selectCity,
            clientEvent: this.selectEvent,
            clientMotif: this.selectMotif,
            clientPax: this.pax,
            clientEmail: this.email,
            clientStartTime: this.formatTimeInput(this.starttime),
            clientEndTime: this.formatTimeInput(this.endtime),
            clientSelectPackage: this.selectedPackage[0],
            clientFoodChoice: this.choiceOfFood,
            clientServices: this.servicesSelected,
            clientAddons: this.addonsSelected,
            clientTotalPayment: this.totalpayment,
            clientPaidAmount: this.enterAmount,
            clientPayDetails: 'CASH',
            clientTokenID: 'CASH',
            clientPaymentType: 'CASH',
            clientReserveType: 'WALK-IN',
            clientDateofReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
            }
            this.$firestoreApp.collection('Reservation').add(reserveDetails)
            .then((ref) =>{
              let key = ref.id
              let paymentDetails = {
                  clientReservationKey: ref.id,
                  clientPayDetails: 'CARD',
                  clientTokenID: 'CARD',
                  clientPaymentType: 'CARD',
              }
                  this.$firestoreApp.collection('Payments').add(paymentDetails)
                  .then(()=>{
                      this.$q.notify({
                        message: 'RESERVED!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'orange-8',
                        textColor: 'white',
                        position: 'center'
                      })
                  })
              })
                  this.date = date.formatDate(new Date(),'YYYY-MM-DD'),
                  this.fname = ''
                  this.lname = ''
                  this.place = ''
                  this.selectCity = ''
                  this.selectEvent = ''
                  this.selectMotif = ''
                  this.pax = 0 
                  this.email = ''
                  this.starttime = date.formatDate(new Date(), '10:50'),
                  this.endtime = date.formatDate(new Date(), '10:50'),
                  this.selectedPackage = []
                  this.choiceOfFood = []
                  this.servicesSelected = []
                  this.addonsSelected = []
                  this.step = 1
    },
    amounttopay(){
           if(this.tab == 'FIXED' && this.selectPayment.value == 'Full Payment'){
           this.amount = this.returnFree.price
           this.enterAmount = this.returnFree.price
         } else if(this.selectPayment.value == 'Down Payment' && this.tab == 'FIXED'){
           this.amount = parseInt(this.returnFree.price) * .50
           this.enterAmount = parseInt(this.returnFree.price) * .50
         } else if(this.selectPayment.value == 'Full Payment'){
           this.amount = this.totalpayment
           this.enterAmount = this.totalpayment
         } else if(this.selectPayment.value == 'Down Payment'){
           this.amount = this.downpayment
           this.enterAmount = this.downpayment
         } else{
           this.amount = 5000
           this.enterAmount = 5000
         }
      },
    consoleChoice(){
      console.log(choiceOfFood,'choiceOfFood')
    },
    consoleServices(){
      console.log(this.servicesSelected,'select')
    },
    checkQty(food,qty,category){
      console.log(food)
      console.log(qty)
      console.log(category, 'yeah')
      let selection = this.choiceOfFood
      console.log(selection,'selection')
      //get QTY of viand in selection
      let count = this.$lodash.filter(selection, a=>{
        return a.category == category
      })
      if(count.length > qty){
        this.$q.dialog({
            title: category + ' Selection Max Reached',
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
    returnLimit(categoryname){
      try {
        let category = this.selectedPackage[0].category
        let limit = category.filter(a=>{
          return a.category == categoryname
        })
        return limit[0].viandsQty

      }catch(err){
        return ''
      }
    },
      consoleselected(){
                console.log(this.selectedPackage, 'eventssss')
    },
      returnSelectedStatus(choice){
      let count = this.$lodash.findIndex(this.choiceOfFood, a=>{
        return a.foodName == choice.foodName
      })
      console.log(count,'index')
      if(count > -1){
        return true
      } else {
        return false
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
        amount: this.amount,
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
  }
}
</script>