<template>
    <q-page padding>
        <template>
            <div class="row justify-between q-pt-md">  
                <div class="q-pl-md">
                    <q-btn label="Add New Package" icon="add" color="orange-8" @click="$router.push('/createpackage')" >
                        <q-tooltip>
                            Add New Package
                        </q-tooltip>
                    </q-btn>
                </div>
                <div class="q-pr-xl">
                    <q-input dense v-model="filter" clearable type="text" label="Search Package" color="orange-6" class="bg-white" outlined icon="search">
                        <template v-slot:prepend>
                            <q-icon name="search" color="orange-6"/>
                        </template>
                    </q-input>
                </div>
            </div>
                    <div class="q-mx-lg q-pt-md" >
                        <q-table grid :data="Packages" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card"  style="border-radius:20px" >
                                        <q-card-section class="text-grey-8">
                                            <q-list dense>
                                            <q-item class="q-mt-sm">
                                                <q-item-section>
                                                    <span class="full-width text-h6  text-weight-bold">{{props.row.name}}</span>
                                                </q-item-section>
                                                 <q-item-section side>
                                                    <span class="text-h6 text-weight-bold text-orange-8">P {{props.row.price}}.00</span>
                                                    <span class=" text-orange-8">per pax</span> 
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
            
                                        <q-card-actions align="center">
                                            <q-btn flat label="Edit" icon="edit" color="green"/>
                                            <q-btn flat label="Delete" icon="delete" color="grey-8" />
                                        </q-card-actions>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
                    </div>
        </template>
        <q-dialog v-model="addPackageDialog" full-width full-height persistent>
            <q-card>
                <!-- <q-banner inline-actions class="text-white bg-warning" v-show="showCompleteBanner">
                    <q-icon name="warning"/>&nbsp;Complete the <b>Category Qty Input</b> to show <b>Price per Pax</b>
                </q-banner> -->
                <div class="container row" >
                <q-card-section class="q-pa-md col-7">
                    <div class="text-h6 q-pb-none q-ml-md">New Package</div>
                    <div class="container row q-ml-sm q-pa-sm q-py-md">
                    <q-input color="orange-8" outlined class="col-7" v-model="packageName" label="Package Name"/>
                    <q-select color="orange-8" class="col-5 q-pa-sm" outlined v-model="selectEvent" :options="eventOpt" emit-value map-options label="Select Event" />
                    </div>
                    
                    <div class="my-card q-ml-md q-mr-md q-mb-md q-pa-sm q-py-md" >
                        <div class="text-grey-8">
                            <span class="text-h6 text-weight-light">
                            Select Category
                            </span>
                        </div>
                        <div class="q-gutter-xs">
                            <q-checkbox v-model="selection" :val="i" :label="i.category+' ('+ i.min +' php)'" color="orange-8" v-for="(i, index) in this.mergeData" :key="index" @input="checkIfRemoved(i.category)"/>
                        </div>
                    </div>
                    <div v-show="this.selection.length != 0">
                        <div class="my-card q-ma-md q-pa-md bg-grey-2" flat>
                            <div>
                                <div class="text-h6 text-weight-light">
                                Please Enter Quantity
                                </div>
                                <q-list dense class="text-left text-grey-8 bg-grey-2" >
                                    <q-item dense v-for="(i, index) in this.selection" :key="index">
                                        <q-item-section>
                                            <!-- <q-item-label dense class="q-pl-md" lines="1" v-if="i.min == undefined">{{i.category}}</q-item-label> -->
                                            <q-item-label dense class="q-pl-md" lines="1">{{i.category+' ('+ i.min +' Pesos)'}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-input color="orange-8" outlined="" class="q-ma-sm" type="number" dense min="0" v-model="viandsQty[i.category]" label="Qty"/>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </div>
                        </div>
                    </div>
                    <div class="my-card q-ma-md q-pa-sm q-py-md">
                        <div class="text-h6 text-weight-light">
                            <span>
                            Select Inclusions
                            </span>
                        </div>
                        <div class="q-gutter-xs">
                            <q-checkbox v-model="selectedInclusions" :val="i" :label="i.inclusion" color="orange-8" v-for="(i, index) in this.Inclusion" :key="index"/>
                        </div>
                    </div>
                    <div class="my-card q-ma-md q-pa-sm q-py-md">
                        <div class="q-ml-sm q-mr-sm text-weight-bold text-grey-8">
                            <span class="text-h6 text-weight-light">
                            Package Pricing
                            </span>
                        </div>
                    <q-input color="orange-8" outlined class="q-mt-sm" type="number" v-model="packagePrice" label="Package Price"/>
                    <!-- <q-input color="pink-3" outlined class="q-mt-md" type="number" dense v-model="packagePrice" label="Inclusion Price"/> -->
                    </div>
                </q-card-section>
                <q-card-section class="q-pa-md container row col-5">
                    <q-page-sticky position="top-right" :offset="[60, 0]"> 
                    <div class="my-card q-mt-md q-pa-sm" style="width: 530px;">
                        <div class="q-ml-sm q-mr-sm text-weight-bold text-orange-8">
                            <span class="text-h6 text-weight-light">
                            Package Pricing Guide
                            </span>
                        </div>
                        <div class="container row">
                            <q-list dense class="q-pa-sm col-6 text-grey-8 bg-white">
                            <div>
                                <q-item dense class=" text-weight-bold">
                                    <q-item-section>
                                        <q-item-label dense lines="1">Selected Food</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        Qty
                                    </q-item-section>
                                </q-item>
                                <q-separator/>
                                <q-scroll-area style="height:60vh" :visible="true">
                                <q-item dense v-for="(i, index) in this.selection" :key="index">
                                    <q-item-section class="">
                                        <q-item-label dense lines="1" v-if="i.min == undefined">{{i.category}}</q-item-label>
                                        <q-item-label dense lines="1" v-else>{{i.category+' ('+ i.min +' php)'}}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side class="text-orange-8">
                                        {{viandsQty[i.category]}}
                                    </q-item-section>
                                </q-item>
                                </q-scroll-area>
                            </div>
                            </q-list>
                            <!-- <q-separator vertical position="top-right" :offset="[60, 0]/> -->
                            <q-list dense class="q-pa-sm col-6 text-grey-8 bg-white">
                                <div>
                                    <q-item dense class=" text-weight-bold">
                                    <q-item-section>
                                        <q-item-label dense lines="1">Selected Inclusion</q-item-label>
                                    </q-item-section>
                                    <q-item-section side class="">
                                        x {{selectedInclusions.length}}
                                    </q-item-section>
                                    </q-item>
                                    <q-separator/>
                                    <q-scroll-area style="height:60vh" :visible="true">
                                    <q-item dense v-for="(i, index) in this.selectedInclusions" :key="index">
                                        <q-item-section class="">
                                            <q-item-label dense lines="1">{{i.inclusion}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    </q-scroll-area>
                                    </div>
                            </q-list>
                                    <q-item class="text-h6 text-weight-bold">
                                        <q-item-section>
                                            <q-item-label dense lines="1">Price per Pax</q-item-label>
                                        </q-item-section>
                                        <q-item-section side class="text-orange-8">
                                            {{returnSelectedMinMax}}
                                        </q-item-section>
                                    </q-item>
                                    
                        </div>
                    </div>
                </q-page-sticky>
                </q-card-section>
                </div>

                <q-card-actions align="left" class="col-12 q-pl-xl">
                <q-btn flat label="Add Package" color="orange-8" v-close-popup @click="addPackage"/>
                <q-btn flat label="Cancel" v-close-popup color="grey-8" @click="resetValues"/>
                <!-- <q-btn flat label="merge Food" @click="mergePricing" color="pink-3" /> -->
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            selectEvent: '',
            Event: [],
            showCompleteBanner: false,
            checkerArray: [],
            filter: '',
            splitterModel: 20,
            Inclusion: [],
            Packages: [],
            viandsArray:[],
            viandsQty: [],
            selection: [],
            selectedInclusions: [],
            hidelabel: true,
            packagePrice: 0,
            Food: [],
            packageName: '',
            addPackageDialog: false,
            Category: [],
            filter: '',
            pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
            columns: [
                { name: 'name', required: true, label: 'Package name', align: 'center', field: 'name', sortable: true },
                { name: 'price', align: 'center', label: 'Package Per Head Price', field: 'price', sortable: true },
            ]
        }
    },
    mounted () {
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
            })
    },
    computed: {
        eventOpt(){
                let optionss = this.Event.map(m => {
                    return {
                        label: m.event,
                        value: m.event
                    }
                })
                return optionss
        },
        returnSelectedMinMax(){
            try {
                let select = this.mergePricing
                let sumMin = this.$lodash.sumBy(select, m=>{
                    return parseInt(m.min) * parseInt(m.viandsQty)
                })
                let sumMax = this.$lodash.sumBy(select, m=>{
                    return parseInt(m.max) * parseInt(m.viandsQty)
                })

                console.log('mergePrice',this.mergePricing)
                console.log('sumMin',sumMin)
                console.log('sumMax',sumMax)

                return '(P '+sumMin+')'
            } catch(err){
                return 0
            }
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
        selectedCategory(){
            console.log(this.selection, 'ssss')
            if(this.selection.length == 0){
                console.log('no pricing')
                return 0
            }else{
                 let filter = this.$lodash.filter(this.Food, m => {
                    console.log(m, 'm')
                    // let selectedCateg = {...this.selection[0]}
                    // delete selectedCateg['.key']
                    // delete selectedCateg.__index
                    // let types = selectedCateg.category
                    return m.category == this.selection.category
                })
                    return filter
            }
        },
        mergePricing(){

                console.log(this.selection.length,'selectionlength')
                console.log(this.selection,'selection')
                console.log(this.viandsQty,'checkviands') 
                
                let keys = this.$lodash.keys(this.viandsQty)
                console.log(keys,'keys')

                if(this.selection.length != keys.length){
                    this.showCompleteBanner = true
                    console.log('no pricing')
                    return 0
                } 
                    this.showCompleteBanner = false
                
                let merge = []
                for( var x = 0; x < this.selection.length; x++){
                    let m = {...this.selection[x]}
                    delete m.foods
                    m.viandsQty = this.viandsQty[m.category]
                    merge.push(m)
                }

                console.log(merge,'merge')
                return merge
            },

    },
    methods:{
        addPackage(){
            if(this.selection.length == 0 || this.selectedInclusions.length == 0 || this.packageName == '' || this.packagePrice == 0){
                this.$q.dialog({
                  title: 'Required Fields is Empty.',
                  message: 'Fill up all Requirements',
                  color:'orange-8',
                  ok: 'Ok',
                  persistent: true
                }).onOk(()=>{
                    this.addPackageDialog = true
                })
            } else {
                this.$q.dialog({
                    title: 'Add Package',
                    message: 'Add This New Package?',
                    ok: 'Yes',
                    color:'orange-8',
                    cancel: 'Cancel',
                    persistent: true
                  }).onOk(() => {
                      let arrayInc = []
                      let removekey = this.$lodash.filter(this.selectedInclusions,a=>{
                          let x = {...a}
                          let key = a['.key']
                          x.incKey = key
                          delete x['.key']
                          arrayInc.push(x)
                      })
                      let newPackage = {
                          name: this.packageName,
                          event: this.selectEvent,
                          price: this.packagePrice,
                          category: this.mergePricing,
                          inclusions: arrayInc,
                          priceBasis: this.returnSelectedMinMax,
                          dateAdded: new Date()
                      }
                      console.log('ok',newPackage)
                      this.$firestoreApp.collection('Packages').add(newPackage)
                      .then(()=>{
                        this.addPackageDialog = false
                        this.$q.notify({
                                message: 'Package Added!',
                                icon: 'mdi-folder-plus-outline',
                                color: 'orange-8',
                                textColor: 'white',
                                position: 'center'
                            })
                        this.resetValues()
                      })
                      
                  })
            }
        },
        resetValues(){
            this.selection = []
            this.selectedInclusions = []
            this.viandsQty = []
            this.packageName = ''
            this.packagePrice = 0
        },
        findIndexSelection(arr,val){
            return this.$lodash.findIndex(arr,val)
        },
        checkIfRemoved(category){
            console.log(category,'cat')
            console.log(this.selection, 'sele')
            var index = this.findIndexSelection(this.selection,category)
            if(index == -1){
                delete this.viandsQty[category]
                console.log(this.viandsQty,'this.viandsQty')
            }

        },


    }
}
</script>