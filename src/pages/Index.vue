<template>
    <q-page class="flex flex-center">
        <template>  
            <q-splitter v-model="splitterModel" style="height: 92vh; width: 100%;" :limits="[18, 18]">  
                <template v-slot:before>
                    <div class="bg-white fit">
                        <div class="text-h6 text-center q-py-md">FILTER OPTIONS</div>
                        <q-input v-model="filter" clearable type="text" label="Search Packages" color="pink-3" class="q-ma-md" outlined icon="search">
                            <template v-slot:prepend>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </div>
                    
                </template>    
                <template v-slot:after>   
                <q-btn fab icon="mdi-plus-thick" color="pink-3" @click="addPackageDialog = true" class="q-my-md q-ml-md">
                    <q-tooltip>
                                        Add New Package
                    </q-tooltip>
                </q-btn>
                    <div class="q-mx-lg" >
                        <q-table grid :data="Packages" :columns="columns" :filter="filter">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition " :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card" style="border: 2px solid;border-color: grey;" >
                                        <q-card-section side>
                                            <q-list dense>
                                            <q-item class="q-mt-sm">
                                            <span class="full-width text-center text-teal text-h6 text-weight-bold">{{props.row.name}}
                                                <br>
                                                <q-chip class="text-center">{{props.row.price}} per pax</q-chip>
                                            </span>
                                            </q-item>     
                                            <q-separator class="q-mt-sm"/>
                                            <q-item class="q-mt-sm text-grey-8" v-show="props.row.viands">
                                            <span class="full-width text-center text-weight-bold">FOOD CATEGORIES</span>
                                            </q-item>
                                            <q-item v-for="(price, index) in props.row.viands" :key="index" class="text-grey-8">
                                                <q-item-section>
                                                <q-item-label> {{ price.viandsQty }} viand<span v-show="price.viandsQty != '1'">s</span> of {{ price.category }}</q-item-label>
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
                    </div>
                </template>
                </q-splitter>
        </template>
        <q-dialog v-model="addPackageDialog" persistent>
            <q-card style="min-width: 800px">
                <q-banner inline-actions class="text-white bg-warning" v-show="showCompleteBanner">
                    <q-icon name="warning"/>&nbsp;Complete the <b>Viand Qty Input</b> to show <b>Price per Pax</b>
                </q-banner>
                <div class="container row" >
                <q-card-section class="q-pa-md col-8">
                    <div class="text-h6 q-pb-none q-ml-md">New Package</div>
                    <div class="container row q-ma-md">
                    <q-input color="pink-3" outlined class="col-12" dense v-model="packageName" label="Package Name"/>
                    </div>
                    <div class="my-card q-ma-md q-pa-sm q-py-md" style="border: 1.5px solid;border-color: pink;">
                        <div class="q-mx-md text-weight-bold text-grey-8">
                            <span>
                            Select Category
                            </span>
                        </div>
                        <div class="q-gutter-xs">
                            <q-checkbox v-model="selection" :val="i" :label="i.min != undefined ? i.category+' ('+ i.min +' - '+ i.max +' Pesos)' : i.category" color="pink-6" v-for="(i, index) in this.mergeData" :key="index" @input="checkIfRemoved(i.category)"/>
                        </div>
                    </div>
                    <div v-show="this.selection.length != 0">
                        <div class="my-card q-ma-md q-pa-md" style="border: 1.5px solid;border-color: pink;">
                            <div>
                                <div class="q-ml-md text-weight-bold text-grey-8">
                                Food Choices
                                </div>
                                <q-list dense class="text-left text-grey-8 bg-white" >
                                    <q-item dense v-for="(i, index) in this.selection" :key="index">
                                        <q-item-section>
                                            <q-item-label dense class="q-pl-md" lines="1" v-if="i.min == undefined">{{i.category}}</q-item-label>
                                            <q-item-label dense class="q-pl-md" lines="1" v-else>{{i.category+' ('+ i.min +' - '+ i.max +' Pesos)'}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-input color="pink-3" outlined="" class="q-ma-sm" type="number" dense min="0" v-model="viandsQty[i.category]" label="Viands Qty"/>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </div>
                        </div>
                    </div>
                    <div class="my-card q-ma-md q-pa-sm q-py-md" style="border: 1.5px solid;border-color: pink;">
                        <div class="q-mx-md text-weight-bold text-grey-8">
                            <span>
                            Select Inclusions
                            </span>
                        </div>
                        <div class="q-gutter-xs">
                            <q-checkbox v-model="selectedInclusions" :val="i" :label="i.inclusion" color="pink-6" v-for="(i, index) in this.Inclusion" :key="index"/>
                        </div>
                    </div>

                </q-card-section>
                <q-card-section class="col container q-mt-xl q-pl-none q-mr-sm">
                    <q-page-sticky position="top-right" :offset="[320, 0]"> 
                    <div class="my-card q-mt-md q-pa-sm" style="border: 1.5px solid;border-color: teal;">
                        <div class="q-ml-sm q-mr-sm text-weight-bold text-teal">
                            <span>
                            Package Pricing Guide
                            </span>
                        </div>
                        <q-separator/>
                        <q-list dense class="text-left text-grey-8 bg-white">
                            <q-item dense class="text-caption text-weight-bold">
                                <q-item-section>
                                    <q-item-label dense lines="1">Selected Food</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    Viands Qty
                                </q-item-section>
                            </q-item>
                            <q-separator/>
                            <q-scroll-area style="height:22vh" :visible="true">
                            <q-item dense v-for="(i, index) in this.selection" :key="index">
                                <q-item-section class="text-caption">
                                    <q-item-label dense lines="1" v-if="i.min == undefined">{{i.category}}</q-item-label>
                                    <q-item-label dense lines="1" v-else>{{i.category+' ('+ i.min +' - '+ i.max +' Pesos)'}}</q-item-label>
                                </q-item-section>
                                <q-item-section side class="text-teal">
                                    {{viandsQty[i.category]}}
                                </q-item-section>
                            </q-item>
                            </q-scroll-area>
                            <q-separator/>
                            <q-item dense class="text-caption text-weight-bold">
                                <q-item-section>
                                    <q-item-label dense lines="1">Selected Inclusion</q-item-label>
                                </q-item-section>
                                <q-item-section side class="">
                                    x {{selectedInclusions.length}}
                                </q-item-section>
                            </q-item>
                            <q-separator/>
                            <q-scroll-area style="height:18vh" :visible="true">
                            <q-item dense v-for="(i, index) in this.selectedInclusions" :key="index">
                                <q-item-section class="text-caption">
                                    <q-item-label dense lines="1">{{i.inclusion}}</q-item-label>
                                </q-item-section>
                                <q-item-section side class="text-teal text-overline">
                                    FREE
                                </q-item-section>
                            </q-item>
                            </q-scroll-area>
                            <q-item class="text-caption text-weight-bold">
                                <q-item-section>
                                    <q-item-label dense lines="1">Price per Pax</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    {{returnSelectedMinMax}}
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div class="my-card q-mt-md q-pa-sm" style="border: 1.5px solid;border-color: pink;">
                        <div class="q-ml-sm q-mr-sm text-weight-bold text-grey-8">
                            <span>
                            Package Pricing
                            </span>
                        </div>
                    <q-input color="pink-3" outlined class="q-mt-sm" type="number" v-model="packagePrice" label="Package Price"/>
                    <!-- <q-input color="pink-3" outlined class="q-mt-md" type="number" dense v-model="packagePrice" label="Inclusion Price"/> -->
                    </div>
                </q-page-sticky>
                </q-card-section>
                </div>

                <q-card-actions align="left" class="text-primary col-12 q-mr-md">
                <q-btn flat label="Add Package" color="pink-3" v-close-popup @click="addPackage"/>
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
            FoodCategory: [],
            PartyTrayLabel: [],
            filter: '',
            pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
            columns: [
                { name: 'name', required: true, label: 'Package name', align: 'center', field: 'name', sortable: true },
                { name: 'price', align: 'center', label: 'Package Per Head Price', field: 'price', sortable: true },
            ]
        }
    },
    mounted () {
        this.$binding('PartyTrayLabel', this.$firestoreApp.collection('PartyTrayLabel'))
            .then(PartyTrayLabel => {
            console.log(PartyTrayLabel, 'PartyTrayLabel')
            }),
        this.$binding('FoodCategory', this.$firestoreApp.collection('FoodCategory'))
            .then(FoodCategory => {
            console.log(FoodCategory, 'FoodCategory')
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
    },
    computed: {
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

                return '(P '+sumMin+' - P '+sumMax+')'
            } catch(err){
                return ''
            }
        },
        mergeData(){
            try {
                let categories = this.FoodCategory
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
                        let max = this.$lodash.maxBy(forPush.foods, 'foodPrice')

                        let getMin = {...min}
                        let getMax = {...max}
                        forPush.min = getMin.foodPrice
                        forPush.max = getMax.foodPrice
                        console.log('min',getMin.foodPrice)
                        console.log('max',getMax.foodPrice)
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
        categoryOpt(){
                let optionss = this.FoodCategory.map(m => {
                    return {
                        label: m.category,
                        value: m.category
                    }
                })

                return optionss
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
                  color:'pink-6',
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
                          price: this.packagePrice,
                          viands: this.mergePricing,
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
                                color: 'pink-3',
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
            var index = this.findIndexSelection(this.selection,category)
            if(index == -1){
                delete this.viandsQty[category]
                console.log(this.viandsQty,'this.viandsQty')
            }

        },


    }
}
</script>