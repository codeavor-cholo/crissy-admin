<template>
    <q-page padding="">
        <template>
                 <q-page-sticky position="bottom-right" :offset="[80, 10]">
                    <q-btn label="Add New Food" icon="add" color="orange-8" @click="addFoodDialog = true" />
                        <q-tooltip>
                            Add Food
                        </q-tooltip>
                </q-page-sticky>
                    <div>
                        <q-table grid :data="Food" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                
                                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card"  style="border-radius:20px" >
                                        <div>
                                            <q-img :src="props.row.foodPic" :ratio="3/2" style="border-radius:20px 20px 0 0">
                                            </q-img>
                                        <q-card-section class="q-px-none">
                                            <q-list dense>
                                            <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name" v-show="col.name != 'foodPrice'">
                                                <q-item-section dense>
                                                <q-item-label lines="1">{{ col.label }}</q-item-label>
                                                </q-item-section>
                                                <q-item-section side dense>
                                                <q-item-label lines="2">{{ col.value }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                        </q-card-section>
                                        <q-separator  inset />
                                        <q-card-actions align="center" class=" q-pb-md">
                                            <q-btn flat label="EDIT" icon="edit" color="green"/>
                                            <q-btn flat label="DELETE" icon="delete"/>
                                        </q-card-actions>
                                        </div>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
                    </div>
        </template>
        <q-dialog v-model="addFoodDialog" persistent>
            <q-card style="min-width: 400px" >
                <q-card-section class="q-pb-none">
                <div class="text-h6">New Food</div>
                </q-card-section>

                <q-card-section class="q-pa-md">
                
                <q-input color="orange-8" class="q-ma-md" v-model="foodNames" label="Food Name"/>
                <div class="container row q-ma-md">
                <q-select color="orange-8" class="q-mr-md col" @input="foodPriceByCategory" v-model="selectCategory" :options="categoryOpt" emit-value map-options label="Select Category" />
                <q-input color="orange-8" class="col-3" type="number" readonly v-model="foodPrice" label="Food Price"/>
                </div>
                <q-input v-model="description" class="q-ma-md" color="orange-8" label="Food Description" filled type="textarea" />
                <q-uploader ref="foodref" class="q-ma-md" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="foodpic" label="Upload Photo" color="orange-8" style="width: 400px;" />
                </q-card-section> 

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup color="grey-8" />
                <q-btn flat label="Add Food" @click="addFood" color="orange-8" v-close-popup />
                <!-- <q-btn flat label="merge Food" @click="mergePricing" color="pink-3" /> -->
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
let sri = require('simple-random-id')
export default {
    data(){
        return {
            filter: '',
            foodPrice: 0,
            Food: [],
            Category: [],
            newFoodPic: '',
            picFood: '',
            storageRef: null,
            description: '',
            selectCategory: '',
            foodNames: '',
            foodpic: '',
            addFoodDialog: false,
            isEdit: false,
            filter: '',
            pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 9},
            columns: [
                { name: 'foodName', align: 'center', label: 'Food Name', field: 'foodName', sortable: true },
                { name: 'category', required: true, label: 'Food Category', align: 'center', field: 'category', sortable: true },
                { name: 'foodPrice', align: 'center', label: 'Food Price', field: 'foodPrice', sortable: true },
                { name: 'description', align: 'center', label: 'Description', field: 'foodDescription', sortable: true },

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
            this.storageRef = this.$firebase.storage().ref()
            console.log(this.storageRef, 'store')
    },
    computed: {
        categoryOpt(){
                let optionss = this.Category.map(m => {
                    return {
                        label: m.category,
                        value: m.category
                    }
                })
                return optionss
        }
    },
    methods:{
        foodPriceByCategory(){ 
                   let optionss = this.$lodash.filter(this.Category, m => {
						return m.category === this.selectCategory
                    })    
                        console.log(optionss, 'ss')
                        this.foodPrice = ''
                        this.foodPrice = optionss[0].price
        },
        addFood () {
            let vm = this
            let optionss = this.$lodash.filter(this.Food, m => {
                if(m.foodName === this.foodNames){
                    return m
                }
            })   
                if(this.selectCategory === '' || this.foodNames === ''){
                  this.$q.dialog({
                  title: 'Field Required!',
                  message: 'Fill all Requirements?',
                  ok: 'Ok',
                  persistent: true
                }).onOk(()=>{
                    this.addFoodDialog = true
                })
                }else{
                     if(optionss.length > 0){
                        this.$q.dialog({
                        title: 'Duplicate Entry!',
                        message: 'Unable to save?',
                        ok: 'Ok',
                        persistent: true
                        }).onOk(() => {
                            this.addFoodDialog = true
                        })
                    }else{ 
                    this.$q.dialog({
                    title: 'Add Food',
                    message: 'Add This Food?',
                    ok: 'Yes',
                    color:'orange-8',
                    cancel: 'Cancel',
                    persistent: true
                  }).onOk(() => {
                      vm.uploadFoodPhoto()
                      .then((user) => {
                        var food = {
                            foodName: this.foodNames,
                            category: this.selectCategory,
                            foodPrice: this.foodPrice,
                            foodDescription: this.description,
                            foodPic: this.newFoodPic
                        }

                            vm.$firestoreApp.collection('Food').add(food)
                            this.$q.notify({
                                  message: 'Food Added!',
                                  icon: 'mdi-folder-plus-outline',
                                  color: 'orange-8',
                                  textColor: 'white',
                                  position: 'center'
                              })
                                this.foodNames = ''
                                this.selectCategory = ''
                                this.foodPrice = ''
                                this.description = ''
                          })
                      }).onCancel(()=>{
                            console.log(this.selectCategory)
                            this.addFoodDialog = true
                      })
                  }
              }
        },
        uploadFoodPhoto: async function () {
                let promise = new Promise((resolve, reject ) => {
                
                let foodss = this.picFood
                let random = sri(9)
                console.log(random, 'rand')
                console.log(this.foodpic, 'foodref')
                let vm = this
                let uploadTask = this.storageRef.child(`foodPhotos/${random}`).put(foodss)
                uploadTask.on('state_changed', function (snapshot) {
                }, function (error) {
                // Handle unsuccessful uploads
                // this.$q.notify({
                //     message: 'An error occur',
                //     type: 'negative',
                //     color: 'negative',
                //     textColor: 'white',
                //     icon: 'warning'
                // })
                console.log('error occur', error)
                }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log(uploadTask, 'upload')
                    vm.foodpic = downloadURL
                    resolve(downloadURL)
                    console.log(downloadURL, 'download')
                })
                })
            })
            let result = await promise
            console.log('result',result)
            this.newFoodPic = result
            this.foodpic = this.newFoodPic
            return result
        },
        photoAdded (p) {
            var photo = this.$refs.foodref.files[0]
            
            this.picFood = photo
            console.log('photo2', photo)
        },
    }
}
</script>