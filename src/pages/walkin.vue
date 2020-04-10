<template>
    <q-page class="row">
          <div class="q-pa-sm col-8">
              <q-stepper v-model="step" ref="stepper" color="deep-orange-4" vertical falt active-color="orange-8" inactive-color="blue-10" animated>
                <q-step :name="1" v-show="step === 1" title="Select Event and Available Date" icon="settings" :done="step > 1">
                  <div class="row items-center">
                    <div class="col q-pa-sm q-gutter-md">
                      <q-input v-model="eventName" type="text" label="Event Name" outlined rounded color="orange-8" />
                      <q-select rounded color="orange-8" outlined v-model="selectEvent" :options="eventOpt" emit-value map-options label="Select Event Type" />
                    </div>
                    <div class="col relative-position">
                      <div class="text-h6 text-warning absolute-center bg-grey-2 q-pa-md full-width text-center" style="z-index:2" v-show="selectEvent == ''">
                        <q-icon name="warning" /> Please Select Event Type First !
                      </div>
                      <q-date v-model="date" event-color="orange-8" :events="eventsReserve" :options="date => dateToday(date)" minimal class="shadow-0  full-width" mask="YYYY-MM-DD" color="orange-8" :disable="selectEvent == ''"></q-date> 
                    </div>
                     
                  </div>
                </q-step>

                <q-step :name="2" v-show="step === 2" title="Fill up Information" icon="create_new_folder" :done="step > 2">
                  <div class="row col-12">
                    <q-input rounded color="orange-8" outlined class="col-4 q-pa-sm" v-model="fname" label="Enter First Name" />
                    <q-input rounded color="orange-8" outlined class="col-4 q-pa-sm" v-model="lname" label="Enter Last Name" />
                    <div class="q-pa-sm col-4">
                      <q-input rounded color="orange-8" event-color="orange-8" :events="eventsReserve" outlined v-model="date" mask="date">
                        <template v-slot:append>
                          <q-icon name="event" color="orange-8" class="cursor-pointer">
                            <q-tooltip>
                              Select New Date
                            </q-tooltip>
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="date" event-color="orange-8" :events="eventsReserve" mask="YYYY-MM-DD" @input="() => $refs.qDateProxy.hide()" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                      <q-input type="number" rounded color="orange-8" outlined class="col-4 q-pa-sm" v-model="pax" label="Enter Guest" />
                    <div class="q-pa-sm col-4">
                      <q-input label="Start Time" outlined rounded v-model="starttime" mask="time">
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
                      <q-input label="End Time" outlined rounded v-model="endtime" mask="time">
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
                    <q-input rounded color="orange-8" outlined class="col-8 q-pa-sm" v-model="place" label="Enter Event Place" />
                    <q-select rounded class="q-pa-sm col-4" color="orange-8" outlined v-model="selectCity" :options="cityOpt" emit-value map-options label="Select City" />
                  </div>
                  <div class="row">
                    <q-select rounded class="q-pa-sm col-4" color="orange-8" outlined v-model="selectMotif" :options="motifOpt" emit-value map-options label="Select Motif" />
                    
                    <q-input rounded color="orange-8" outlined class="col q-pa-sm" v-model="email" label="Enter Email Address" />
                  </div>
                  <div class="row q-mb-xl">
                      <q-card class="my-card col-4 q-ma-sm cursor-pointer" v-for="(choice,j) in Theme" :key="j" :style="returnSelectedStatusTheme(choice) ? 'transform: scale(0.95);' : ''" :class="returnSelectedStatusTheme(choice) ? 'bg-orange text-white' : ''" style="border-radius:20px;" @click.native="clickUnclickAddTheme(choice)">
                      <q-img 
                        :src="choice.themePic"
                        :ratio="3/2" />

                      <q-card-section>
                        <div class="row no-wrap items-center">
                          <q-checkbox color="orange-8" v-model="choiceOfTheme" :val="choice" @input="checkTheme"/>
                          <div class="col text-subtitle2 ellipsis">
                            {{choice.themeName}}
                          </div>
                        </div>
                      </q-card-section>
                      </q-card>
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
                      <q-tab name="CUSTOMIZE" label="CUSTOMIZE PACKAGE" />
                  </q-tabs>
                  <q-separator  />
                  <div v-show="tab !== 'CUSTOMIZE'">
                      <h6 class="q-my-sm text-weight-light full-width text-center" style="font-size:1.2em;">Click the card to select package.</h6>
                      <q-table grid :data="tab == 'PER PAX' ? returnPerPax : returnFixed" :columns="columns" :filter="filter" class="full-width align-center " :selected.sync="selectedPackage" row-key="name" selection="single">
                          <template v-slot:item="props">
                              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''" >
                                  <q-card class="my-card cursor-pointer"  style="border-radius:20px" @click.native="props.selected = !props.selected, consoleselected()" :class="props.selected ? 'bg-orange-8 text-white' : 'text-grey-8'">
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
                </q-step>

                <q-step :name="4" v-show="step === 4" title="Select Food" icon="add_comment">
                  <div v-for="(food,i) in foodChoice" :key="i" v-show="selectedPackage != null">
                      <q-badge color="orange-8" outline class="column items-center full-width"><span class="q-mb-none text-h6 text-weight-light"> Select <span class="text-orange-8 text-h6">{{returnLimit(food.category)}}</span> Choice<span v-show="returnLimit(food.category) > 1">s</span> of {{food.category}}  </span></q-badge>
                      <div class="row q-mt-md q-mb-md">
                            <q-card class="my-card col-4 q-ma-sm cursor-pointer" v-for="(choice,j) in food.foodChoices" :key="j" :style="returnSelectedStatus(choice) ? 'transform: scale(0.95);' : ''" :class="returnSelectedStatus(choice) ? 'bg-orange text-white' : ''" style="border-radius:20px;" @click.native="clickUnclick(choice),checkQty(choice,returnLimit(food.category),food.category)">
                            <q-img 
                              :src="choice.foodPic"
                              :ratio="3/2" />

                            <q-card-section>


                              <div class="row no-wrap items-center">
                                <q-checkbox color="orange-8" v-model="choiceOfFood" :val="choice" @input="checkQty(choice,returnLimit(food.category),food.category)"/>
                                <div class="col text-subtitle2 ellipsis">
                                  {{choice.foodName}} <q-badge v-show="tab === 'CUSTOMIZE'" color="orange-8">P{{choice.foodPrice}}</q-badge>
                                </div>
                              </div>
                            </q-card-section>
                            </q-card>

                      </div>
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
                <div>
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
                </div>
                  <q-separator/>
                  <div v-show="this.tab != 'CUSTOMIZE'">
                    <span class="text-h6 text-weight-light">
                      <q-checkbox color="orange-8" class="text-h6" v-model="addonsFood" label="Select Food Add-Ons?? (OPTIONAL)" />
                    </span>
                  </div>
                  <div v-show="addonsFood === true" class="row">
                    <div v-for="(food,i) in foodChoiceAddons" :key="i">
                      <span class="q-mb-none q-mt-md text-h6 text-weight-light"> Select Additional Choice of {{food.category}}</span>
                      <br>
                      <span class="text-caption">additional ₱{{food.price}} per choice of dish (in per pax price)</span>
                      <div class="row q-mt-md q-mb-md">
                            <q-card class="my-card q-ma-sm cursor-pointer" v-for="(choice,j) in food.foodChoices" :key="j" :style="returnSelectedStatusAdd(choice) ? 'transform: scale(0.95);' : ''" :class="returnSelectedStatusAdd(choice) ? 'bg-orange text-white' : ''" style="border-radius:20px;width:200px" @click.native="clickUnclickAdd(choice)">
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
                     <p class="col-8"><span class="q-pa-sm">Pax:</span> <strong v-show="this.tab != 'FIXED'">{{pax}} Guest</strong><strong v-show="this.tab === 'FIXED'">{{returnFree.adultPax}} adults && {{returnFree.kidPax}} kids</strong></p>
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
                          <div v-show="tab != 'CUSTOMIZE'" class="q-pa-sm col-6">
                              <div style="margin-left: 135px"><b>Choice Of Food:</b></div>
                                  <div class="q-px-md" v-for="(choice,i) in returnChoiceOfFood" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q">
                                      <div dense class="col q-mr-sm">x1 {{pick.foodName}}</div>
                                      <!-- <div dense class="col-1 text-weight-bold">x 1</div> -->
                                    </div>
                                  </div>
                                <div class="q-pa-sm row justify-between" v-for="(choice,i) in choiceOfFoodAdd" :key="i" >
                                    <div>{{choice.foodName}}</div>
                                    <!-- <div class="text-orange-8 text-weight-bold">+ ₱{{choice.foodPrice}}
                                      <span class="text-grey-8 text-weight-light text-caption">per head</span>
                                    </div> -->
                                </div>
                          </div>
                          <div v-show="tab === 'CUSTOMIZE'" class="q-pa-sm col-6">
                              <div><b>Choice Of Food:</b></div>
                                  <div class="q-px-md" v-for="(choice,i) in returnChoiceOfFood" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q">
                                      <div dense class="col q-mr-sm">x1 {{pick.foodName}}</div>
                                      <!-- <div dense class="col-1 text-weight-bold">x 1</div> -->
                                    </div>
                                  </div>
                                  <div class="q-pa-sm row justify-between" v-for="(choice,i) in choiceOfFoodAdd" :key="i" >
                                      <div>{{choice.foodName}}</div>
                                      <!-- <div class="text-orange-8 text-weight-bold">+ ₱{{choice.foodPrice}}
                                        <span class="text-grey-8 text-weight-light text-caption">per head</span>
                                      </div> -->
                                  </div>
                          </div>
                          <div class="q-pa-sm col-6"> 
                              <div v-show="tab != 'CUSTOMIZE'" style="margin-left: 135px"><b>Inclusions: </b></div>
                                  <q-list v-for="(inc,i) in returnFree.inclusions" :key="i" dense>
                                    <q-item>
                                        <q-item-section>
                                          <li>
                                            {{inc.inclusion}}
                                          </li>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                  <q-list v-show="tab === 'FIXED'" v-for="(ser,s) in returnFree.services" :key="s" dense>
                                    <q-item>
                                        <q-item-section>
                                          <li>
                                            {{ser.services}}
                                          </li>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                  <q-list v-show="tab === 'FIXED'" v-for="(add,a) in returnFree.addons" :key="a" dense>
                                    <q-item>
                                        <q-item-section>
                                          <li>
                                            {{add.addons}}
                                          </li>
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
                         <div v-show="this.choiceOfFoodAdd.length != 0" class="row">
                           <strong class="q-pa-sm row">Total Food Add-Ons Price:</strong><span class="text-h6 weight-bold">{{returnTotalPriceAfterFoodAddOns}}</span>
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
                    <q-btn v-show="step < 8" @click="$refs.stepper.next()" color="orange-8" :label="step === 8 ? 'Finish' : 'Continue'" />
                  </q-stepper-navigation>
                </template>
              </q-stepper>
            </div>
            <div class="q-pa-sm col-4">
              <q-page-sticky position="top-right" :offset="[10, 8]">
                <q-card class="my-card" style="height: 540px; width: 440px">
                    <q-card-section v-show="this.step === 1" v-if="this.reservationDetails != 'NO RESERVATIONS ON THIS DATE'">
                        <div class="col items-center text-h6 text-weight-bold">Reservation Details</div>
                        <div class="col q-pl-xl q-pt-xl q-ml-xl items-center text-weight-bold">All Events On This Date {{this.date}}</div>
                        <q-list v-for="(add,a) in this.reservationDetails" :key="a" dense>
                          <q-item dense>
                              <q-item-section>
                                <ul>
                                  <li class="text-weight-bold text-h6">{{add.clientEvent}}</li>
                                      <div class="col items-center q-pl-sm text-weight-bold">Event Place: {{add.clientPlace}}, {{add.clientCity}}</div>
                                      <div class="col items-center q-pl-sm text-weight-bold">Start Time: {{add.clientStartTime}}</div>
                                      <div class="col items-center q-pl-sm text-weight-bold">End Time: {{add.clientEndTime}}</div>
                                </ul>
                              </q-item-section>
                          </q-item>
                        </q-list>

                        <!-- {{reservationDetails}} -->
                    </q-card-section>
                    <q-card-section v-show="this.step === 1" v-else>
                        <div class="col items-center text-h6 text-weight-bold">Reservation Details</div>
                        <div class="col q-pl-xl q-pt-xl q-mt-xl text-h6 items-center text-weight-bold">No Reservations On This Date:</div>
                        <div class="col q-pl-xl q-ml-xl text-h6 items-center text-weight-bold" style="margin-left: 100px;text-color: red"><q-badge color="red" class="text-h6">{{this.date}}</q-badge></div>
                    </q-card-section>
                    <q-card-section v-show="this.step != 1">
                      <div class="row items-center q-pb-sm q-pt-none q-mt-none">
                          <div class="col-3 items-center text-weight-bold">Order Details</div>
                          <div class="col-9">
                            <q-btn-dropdown class="full-width" color="orange-8" dense flat label="View Payment Details">
                              <q-list dense>
                                <q-item>
                                  <q-item-section>
                                    <q-item-label>Pax:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <strong v-show="this.tab != 'FIXED'">{{pax}} Pax</strong><strong v-show="this.tab === 'FIXED'">{{returnFree.adultPax}}adults & {{returnFree.kidPax}}kids</strong>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              <q-list dense>
                                <q-item v-show="this.tab != 'CUSTOMIZE'">
                                  <q-item-section>
                                    <q-item-label>Package Price:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <strong>{{packPrice}}<b v-if="this.tab != 'FIXED'"> Per Pax</b> <b v-else> Pesos</b></strong>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              <q-list dense v-show="this.tab != 'FIXED'">
                                <q-item>
                                  <q-item-section>
                                    <q-item-label>Total Package Price:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                     <b v-if="this.tab != 'CUSTOMIZE'">{{totalPackPrice}}</b><b v-else>{{cpPrice}} per pax</b>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              <q-list dense v-show="this.choiceOfFoodAdd.length != 0">
                                <q-item>
                                  <q-item-section>
                                    <q-item-label>Total Add-Ons Food Price:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                     <b>+{{returnTotalPriceAfterFoodAddOns}}</b>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              <q-list dense v-show="this.servicesSelected.length != 0" >
                                <q-item>
                                  <q-item-section>
                                    <q-item-label>Total Services Price:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <b>{{returnSelectedMinMaxServices}} pesos</b>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              <q-list>
                                <q-item dense v-show="this.addonsSelected.length != 0">
                                  <q-item-section>
                                    <q-item-label>Total Add-Ons Price:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <b>{{returnSelectedMinMaxAddons}} pesos</b>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              <q-list dense>
                                <q-item>
                                  <q-item-section>
                                    <q-item-label>Total Payment:</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <b>{{totalpayment}}</b>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-btn-dropdown>
                          </div>
                      </div>
                      <!-- DISPLAYING OF FOODS FOR CUSTOMIZE FIXED AND PER PAX  -->
                      <div class="row">
                          <div v-show="this.tab === 'CUSTOMIZE'" class="q-pa-sm col-12">
                            <div class="q-px-sm q-mb-sm row">
                                <div class="q-pb-sm col"><b>Choice Of Food: </b></div>
                                <div dense class="col-6 q-pb-sm text-weight-bold">Total Price Per Head: P {{cpPrice}}</div>
                            </div>
                                <q-scroll-area style="height:35vh" :visible="true">
                                  <div class="q-px-md" v-for="(choice,i) in returnChoiceOfFood" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q">
                                      <div dense class="col q-mr-sm">x1 {{pick.foodName}}</div>
                                      <div dense class="col-1 text-weight-bold">P {{pick.foodPrice}}</div>
                                    </div>
                                  </div>
                                </q-scroll-area>
                          </div>
                          <div v-show="this.tab != 'CUSTOMIZE'" class="q-pa-sm col-6">
                              <div><b>Choice Of Food:</b></div>
                                <q-scroll-area style="height:35vh" :visible="true">
                                  <div class="q-px-md" v-for="(choice,i) in returnChoiceOfFood" :key="i">
                                    <!-- <span class="text-weight-bold">{{choice.category}} <q-chip size="sm" :color="choice.foodChoices.length == returnLimit(choice.category) ? 'teal' : 'pink-6'" class="text-white" :label="choice.foodChoices.length+' / '+returnLimit(choice.category)" /></span> -->
                                    <div class="q-px-sm q-mb-sm row" v-for="(pick,q) in choice.foodChoices" :key="q">
                                      <div dense class="col q-mr-sm">x1 {{pick.foodName}}</div>
                                      <!-- <div dense class="col-1 text-weight-bold">x 1</div> -->
                                    </div>
                                  </div>
                                  <div v-show="this.choiceOfFoodAdd.length != 0"><b>Additional Food:{{returnTotalPerPaxAddFood}} per pax</b></div>
                                  <q-list v-for="(choice,i) in choiceOfFoodAdd" :key="i" dense>
                                    <q-item>
                                        <q-item-section>
                                            <div class="row text-orange-8 text-weight-bold">{{choice.foodName}} + ₱{{choice.foodPrice}}
                                              <span class="text-grey-8 text-weight-light text-caption">per head</span>
                                            </div>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-scroll-area>
                          </div>
                          <!-- DISPLAYING OF INCLUSIONS FOR PER PAX AND FIXED PACKAGES -->
                          <div v-show="this.tab === 'PER PAX'" class="q-pa-sm col-6"> 
                              <div><b>Inclusions: </b></div>
                                <q-scroll-area style="height:35vh" :visible="true">
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
                                <q-scroll-area style="height:35vh" :visible="true">
                                  <q-list v-for="(inc,i) in returnFree.inclusions" :key="i" dense>
                                    <q-item>
                                        <q-item-section>
                                          <li>
                                            {{inc.inclusion}}
                                          </li>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                  <q-list v-for="(ser,s) in returnFree.services" :key="s" dense>
                                    <q-item>
                                        <q-item-section>
                                          <li>
                                            {{ser.services}}
                                          </li>
                                        </q-item-section>
                                    </q-item>
                                  </q-list>
                                  <q-list v-for="(add,a) in returnFree.addons" :key="a" dense>
                                    <q-item>
                                        <q-item-section>
                                          <li>
                                            {{add.addons}}
                                          </li>
                                            </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-scroll-area>
                          </div>
                      </div>
                      <div>
                        <q-separator inset class="black"/>
                      </div>
                      <!-- DISPLAYING OF SERVICES AND ADD-ONS FOR FIXED, PER PAX AND CUSTOMIZE PACKAGES -->
                      <div class="row">
                        <div class="q-pa-sm col-6">
                            <div>
                                <div><b>Services:</b> <strong v-show="this.step > 5">{{returnSelectedMinMaxServices}}</strong></div>
                                <q-scroll-area style="height:30vh" :visible="true">
                                <q-item v-show="servicesQty[i.services] != null && servicesQty[i.services] != 0" dense v-for="(i, index) in this.servicesSelected" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense v-if="i.price == undefined">{{servicesQty[i.services]}}x {{i.services}}</q-item-label>
                                        <q-item-label dense v-else>{{servicesQty[i.services]}}<b v-show="servicesQty[i.services] != 0">x</b> {{i.services+' ('+ i.price +' php)'}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                </q-scroll-area>
                            </div>
                        </div>
                        <div class="q-pa-sm col-6">
                            <div>
                                <div><b>Add-Ons:</b> <strong v-show="this.step > 6">{{returnSelectedMinMaxAddons}}</strong></div>
                                <q-scroll-area style="height:30vh" :visible="true">
                                <q-item v-show="addonsQty[i.addons] != null && addonsQty[i.addons] != 0" dense v-for="(i, index) in this.addonsSelected" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense v-if="i.price == undefined">{{addonsQty[i.addons]}}x {{i.addons}}</q-item-label>
                                        <q-item-label dense v-else>{{addonsQty[i.addons]}}<b v-show="addonsQty[i.addons] != 0">x</b> {{i.addons+' ('+ i.price +' php)'}}</q-item-label>
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
        choiceOfFoodAdd: [],
        addonsFood: false,
        choiceOfTheme: [],
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
        endtime: date.formatDate(new Date(), '11:00'),
        starttime: date.formatDate(new Date(), '09:00'),
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
        choiceOfTheme: [],
        choiceOfInclusions: [],
        Services: [],
        Addons: [],
        Event: [],
        City: [],
        selectEvent: '',
        eventName: '',
        selectMotif: '',
        place: '',
        email: '',
        selectCity: '',
        lname: '',
        fname: '',
        step: 1,
        splitterModel: 50,
        Category: [],
        Reservation: [],
        Theme: [],
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
        themecolumns: [
            { themeName: 'name', required: true, label: 'Theme', align: 'center', field: 'themeName', sortable: true },
            { name: 'themeDescription', align: 'center', label: 'Description', field: 'themeDescription', sortable: true },
        ],
    }
  },
  mounted(){
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            }),
         this.$binding('Theme', this.$firestoreApp.collection('Theme'))
            .then(Theme => {
            console.log(Theme, 'Theme')
            }),
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
            }),
        this.$binding('Category', this.$firestoreApp.collection('Category'))
            .then(Category => {
            console.log(Category, 'Category')
            })
  },
  computed: {
      returnTotalPriceAfterFoodAddOns(){
        try {
          return (parseInt(this.returnTotalPerPaxAddFood)*parseInt(this.returnTotalNumberPax))
        } catch (error) {
          return this.returnTotalAfterServicesAddons 
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
      returnTotalPerPaxAddFood(){
        try {
          return this.$lodash.sumBy(this.choiceOfFoodAdd,a=>{return parseInt(a.foodPrice)})
        } catch (error) {
          return 0
        }
      },
      eventsReserve(){
            let events = this.$lodash.map(this.Reservation, a=>{
                let reserve = a.clientReserveDate
                return date.formatDate(reserve,'YYYY/MM/DD')
            })
            return events
        },
      reservationDetails(){
          let events = this.$lodash.filter(this.Reservation, a=>{
              return date.formatDate(a.clientReserveDate,'YYYY/MM/DD') === date.formatDate(this.date,'YYYY/MM/DD')
          })
          if(events.length != 0){
            console.log(events, 'ReservationDetails')
            return events
          }else{
            console.log(events, 'ReservationDetails')
              return 'NO RESERVATIONS ON THIS DATE'
          }
      },
      cpPrice(){
        if(this.choiceOfFood.length === 0){
            return 0
        }else{
        let sum = this.$lodash.sumBy(this.choiceOfFood, a => { 
            return parseInt(a.foodPrice)
            })
        // console.log(sum, 'sum')
        return sum
        }
    },
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
                let totalpack =  parseInt(this.totalPackPrice) + parseInt(this.returnSelectedMinMaxServices) + parseInt(this.returnSelectedMinMaxAddons) + parseInt(this.returnTotalPriceAfterFoodAddOns)
                return totalpack
            } catch(err){
                return 0
            }
      },
      downpayment(){
          try { 
                let totalpacks =  parseInt(this.totalpayment) * .50
                return totalpacks
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
        if(this.tab === 'FIXED'){
          if(this.selectedPackage.length === 0){
            return []
          }else{
              return parseInt(this.selectedPackage[0].price)
          }
        }else if(this.tab === 'CUSTOMIZE'){
            try {
                let totalpack =  parseInt(this.pax) * parseInt(this.cpPrice)
                return totalpack
            } catch(err){
                return 0
            }
        }else{
            try {
                let totalpack =  parseInt(this.pax) * parseInt(this.selectedPackage[0].price)
                return totalpack
            } catch(err){
                return 0
            }
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
      foodChoice(){
        try {
          let viands
          if(this.tab == 'CUSTOMIZE') {
            viands = this.Category
          } else {
            viands = this.selectedPackage[0].category
          }
          let newFood = this.$lodash.filter(this.Food, m => {
              return m.foodType != 'Kiddie Food'
          })    
          console.log(viands,'viands')
          let foodWithPriceInViands = []
          let foods =  newFood
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
    clickUnclickAdd(choice){
      let index = this.findIndexSelection(this.choiceOfFoodAdd,choice)
      
      if(index > -1){
        console.log(index,'index')
        this.choiceOfFoodAdd.splice(index,1)
      } else {
        this.choiceOfFoodAdd.push(choice)
      }

    },
    returnSelectedStatusTheme(choice){
      let count = this.$lodash.findIndex(this.choiceOfTheme, a=>{
        return a.themeName == choice.themeName
      })
      // console.log(count,'index')
      if(count > -1){
        return true
      } else {
        return false
      }
    },
    checkTheme(){
      if(this.choiceOfTheme.length > 1){
        this.choiceOfTheme.splice(0,1)
      }
    },
    clickUnclickAddTheme(choice){
      
      let index = this.findIndexSelection(this.choiceOfTheme,choice)
      
      if(index > -1){
        console.log(index,'index')
        this.choiceOfTheme.splice(index,1)
      } else {
        this.choiceOfTheme.push(choice)
        this.checkTheme()
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
    stepBacker(){
        if(this.step === 3){
          if(this.selectedPackage.length === 0){
              this.$refs.stepper.previous()
          }else{
              this.$q.dialog({
              title: '',
              message: 'Removing Current Selected Package.',
              ok: 'Ok',
              persistent: true
            }).onOk(() => {
              this.selectedPackage = []
              this.$refs.stepper.previous()
            })
          }
        }else if(this.step === 4){
          if(this.choiceOfFood.length === 0){
              this.$refs.stepper.previous()
          }else{
            this.$q.dialog({
              title: '',
              message: 'Removing All Selected Food.',
              ok: 'Ok',
              persistent: true
            }).onOk(() => {
              this.choiceOfFood = []
              this.$refs.stepper.previous()
            })
          }
        }else if(this.step === 5){
          if(this.servicesSelected.length === 0){
              this.$refs.stepper.previous()
          }else {
              this.$q.dialog({
                title: '',
                message: 'Removing All Selected Services.',
                ok: 'Ok',
                persistent: true
              }).onOk(() => {
                this.servicesSelected = []
                this.servicesQty = []
                this.$refs.stepper.previous()
              })
            }
        }else if(this.step === 6){
          if(this.addonsSelected.length === 0){
              this.$refs.stepper.previous()
          }else{
              this.$q.dialog({
                title: '',
                message: 'Removing All Selected Add-Ons.',
                ok: 'Ok',
                persistent: true
              }).onOk(() => {
                this.addonsSelected = []
                this.addonsQty = []
                this.$refs.stepper.previous()
              })
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
            clientEvent: this.eventName,
            clientEventType: this.selectEvent,
            clientMotif: this.selectMotif,
            clientPax: this.pax,
            clientEmail: this.email,
            clientStartTime: this.formatTimeInput(this.starttime),
            clientEndTime: this.formatTimeInput(this.endtime),
            clientSelectTheme: this.choiceOfTheme,
            clientSelectPackage: this.tab === 'CUSTOMIZE' ? 'CUSTOMIZE' : this.selectedPackage[0],
            clientPackageType: this.tab,
            clientFoodChoice: this.choiceOfFood,
            clientAdditionalFood: this.choiceOfFoodAdd,
            clientServices: this.mergePricingServices,
            clientAddons: this.mergePricingAddons,
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
                  clientPaymentDate: date.formatDate(new Date(), 'YYYY-MM-DD')
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
                  this.choiceOfFoodAdd = []
                  this.addonsSelected = []
                  this.step = 1
                  this.choiceOfTheme = []
                  this.$router.push('/reservation')
    },
    reservenowCash(){
        let reserveDetails = {
            clientReserveDate: this.date,
            clientFName: this.fname,
            clientLName: this.lname,
            clientPlace: this.place,
            clientCity: this.selectCity,
            clientEvent: this.eventName,
            clientEventType: this.selectEvent,
            clientMotif: this.selectMotif,
            clientPax: this.pax,
            clientEmail: this.email,
            clientStartTime: this.formatTimeInput(this.starttime),
            clientEndTime: this.formatTimeInput(this.endtime),
            clientSelectTheme: this.choiceOfTheme,
            clientSelectPackage: this.tab === 'CUSTOMIZE' ? 'CUSTOMIZE' : this.selectedPackage[0],
            clientPackageType: this.tab,
            clientFoodChoice: this.choiceOfFood,
            clientAdditionalFood: this.choiceOfFoodAdd,
            clientServices: this.mergePricingServices,
            clientAddons: this.mergePricingAddons,
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
                  clientPayDetails: 'CASH',
                  clientTokenID: 'CASH',
                  clientPaymentType: 'CASH',
                  clientPaymentDate: date.formatDate(new Date(), 'YYYY-MM-DD')
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
                  this.choiceOfFoodAdd = []
                  this.step = 1
                  this.choiceOfTheme = []
                  this.$router.push('/reservation')
    },
    amounttopay(){
           if(this.selectPayment.value == 'Full Payment'){
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
    themeQty(){
        if(this.choiceOfTheme.length > 1){
        this.$q.dialog({
            title: 'Selection Max Reached',
            message: 'Unchecked The First Choice To Select Another One',
            ok: 'Ok',
            persistent: true
          }).onOk(() => {
            this.choiceOfTheme.splice(this.choiceOfTheme.length-1,1)
            console.log('removed last')
          })
      }
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
      if(this.tab === 'CUSTOMIZE'){

      }else{
          try {
            let category = this.selectedPackage[0].category
            let limit = category.filter(a=>{
              return a.category == categoryname
            })
            return limit[0].viandsQty

          }catch(err){
            return ''
          }
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
    dateToday(dates){
        // console.log('dates',dates)
        let eventToConsider = this.selectEvent
        let baseCount = eventToConsider == 'Debut' || eventToConsider == 'Wedding' ? 2 : 1
        // console.log(baseCount,'baseCount')

        let today = new Date()
        let format = date.formatDate(today,'YYYY/MM/DD')
        if(format < dates){
            let eventsBase = []
            let length = 0

            let filter = this.Reservation.forEach(a=>{
              if(date.formatDate(dates,'YYYY-MM-DD') == date.formatDate(a.clientReserveDate,'YYYY-MM-DD')){
                eventsBase.push(a)
              }
            })
            // console.log('dates',dates)
            // console.log(eventsBase,'eventBase')

            eventsBase.forEach(b=>{
              let count = b.clientEventType == 'Debut' || b.clientEventType == 'Wedding' ? 2 : 1
              length = length + count
            })

            // console.log(length,'reservedCount')

            let check = length + baseCount
            
            if(check <= 4){
              console.log(check,dates)
              return true
            } else {
              console.log('BLOCKED',dates)
              return false
            }
        }
    },
  }
}
</script>