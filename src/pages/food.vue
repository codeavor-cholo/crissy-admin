<template>
    <q-page padding="">
        <template>
                 <!-- <q-page-sticky position="top-left" :offset="[20, 10]"> -->
            <div class="row justify-between q-pt-md">    
                <div class="q-pl-md">    
                    <q-btn label="Add New Food" icon="add" color="orange-8" @click="addFoodDialog = true, cancel()">
                        <q-tooltip>
                            Add Food
                        </q-tooltip>
                    </q-btn>
                </div>
                <div class="q-pr-xl">
                <q-input dense v-model="filter" clearable type="text" label="Search Food" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
                </div>
            </div>
                <!-- </q-page-sticky> -->
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
                                            <q-btn flat label="EDIT" @click="getedit(props.row)" icon="edit" color="green"/>
                                            <q-btn flat label="DELETE" @click="deletedialog(props.row)" icon="delete"/>
                                        </q-card-actions>
                                        </div>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
                    </div>
        </template>
        <q-dialog v-model="addFoodDialog" persistent>
            <q-card style="width: 600px" >
                <q-card-section class="q-pb-none">
                <div class="text-h6">{{isEdit ? 'Edit Food': 'Add New Food'}}</div>
                </q-card-section>

                <q-card-section class="q-pa-md">
                <div class="row">
                    <q-input outlined rounded color="orange-8" class="q-ma-sm col-8" v-model="foodNames" label="Food Name"/>
                    <!-- <q-checkbox class="q-ma-sm col-3" color="orange-8" v-model="kidsfood" label="Kiddie Food" /> -->
                </div>
                <div class="container row q-ma-sm">
                <q-select outlined rounded color="orange-8" class="q-mr-md col" @input="foodPriceByCategory" v-model="selectCategory" :options="categoryOpt" emit-value map-options label="Select Category" />
                <q-input outlined rounded color="orange-8" class="col-3" type="number" readonly v-model="foodPrice" label="Food Price"/>
                </div>
                <q-input outlined rounded v-model="description" class="q-ma-sm" color="orange-8" label="Food Description" type="textarea" />
                <div v-if="isEdit">
                    <q-img :src="this.selectedFood.foodPic" v-show="hideFoodImage" class="full-width" style="height: 300px">
                        <q-btn @click="hideFoodUploaderTwo = true, hideFoodImage = false" round color="green" icon="mdi-pencil">
                            <q-tooltip>
                                Update Image
                            </q-tooltip>  
                        </q-btn> 
                    </q-img>
                </div>
                <div v-else v-show="hideFoodUploader">
                    <q-btn v-show="isEdit = false" @click="hideFoodUploader = false, hideFoodImage = true" flat round dense icon="close">
                        <q-tooltip>
                            cancel
                        </q-tooltip>  
                    </q-btn> 
                    <q-uploader outlined rounded ref="foodref" class="q-ma-sm" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="foodpic" label="Upload Photo" color="orange-8" style="width: 400px;" />
                </div>
                <div v-if="isEdit" v-show="hideFoodUploaderTwo">
                    <q-btn @click="hideFoodUploaderTwo = false, hideFoodImage = true" flat round dense icon="close">
                        <q-tooltip>
                            cancel
                        </q-tooltip>  
                    </q-btn> 
                    <q-uploader outlined rounded ref="foodref" class="q-ma-sm" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="foodpic" label="Upload Photo" color="green" style="width: 400px;" />
                </div>
                </q-card-section> 

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" @click="cancel" v-close-popup color="grey-8" />
                <q-btn flat v-if="!isEdit" label="Add Food" @click="addFood" color="orange-8" v-close-popup />
                <q-btn v-if="isEdit" flat label="Update Food" color="orange-8" v-close-popup v-on:click="setTask"/>
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
            hideFoodUploader: true, 
            hideFoodImage: true,
            hideFoodUploaderTwo: false,
            filter: '',
            foodPrice: 0,
            Food: [],
            Category: [],
            newFoodPic: '',
            picFood: '',
            storageRef: null,
            description: '',
            selectCategory: '',
            selectedFood: [],
            foodNames: '',
            foodpic: '',
            isEdit: false,
            addFoodDialog: false,
            isEdit: false,
            filter: '',
            // kidsfood: false,
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
        setTask(){
            if(this.$refs.foodref.files.length === 0){
                  var foodBago = {
                    foodName: this.foodNames,
                    category: this.selectCategory.value,
                    foodPrice: this.foodPrice,
                    foodDescription: this.description,
                    foodPic: this.selectedFood.foodPic,
                    // foodType: this.kidsfood === true ? 'Kiddie Food' : 'Adult Food'
                  }
                  if(this.selectCategory.value === '' && this.foodPrice === '' && this.foodNames === '' && this.description === ''){
                      this.$q.dialog({
                      title: 'Field Required!',
                      message: 'Fill all Requirements?',
                      ok: 'Ok',
                      cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Food',
                    message: 'Update This Food?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Food').doc(this.foodID).set(foodBago)
                    this.$q.notify({
                            message: 'Food Updated!',
                            icon: 'mdi-update',
                            color: 'green',
                            textColor: 'white',
                            position: 'center'
                        })
                            this.addFoodDialog = false  
                            this.hideFoodUploaderTwo = false
                            this.hideFoodImage = true
                            this.foodNames = ''
                            // this.kidsfood = false
                            this.selectCategory = ''
                            this.foodPrice = 0
                            this.description = ''
                            this.selectedFood = []
                })  
          }else{
                let vm = this
                  if(this.selectCategory.value === '' && this.foodPrice === '' && this.foodNames === '' && this.description === ''){
                        this.$q.dialog({
                        title: 'Field Required!',
                        message: 'Fill all Requirements?',
                        ok: 'Ok',
                        cancel: 'Cancel'
                      })
                      }else
                      this.$q.dialog({
                      title: 'Update Food',
                      message: 'Update This Food?',
                      ok: 'Yes',
                      cancel: 'Cancel'
                  }).onOk(() => { 
                      vm.uploadFoodPhoto()
                      .then((user)=>{
                          var foodBago = {
                            foodName: this.foodNames,
                            category: this.selectCategory.value,
                            foodPrice: this.foodPrice,
                            foodDescription: this.description,
                            foodPic: this.newFoodPic,
                            // foodType: this.kidsfood === true ? 'Kiddie Food' : 'Adult Food'
                          }
                          this.$firestoreApp.collection('Food').doc(this.foodID).set(foodBago)
                          this.$q.notify({
                                  message: 'Food Updated!',
                                  icon: 'mdi-update',
                                  color: 'green',
                                  textColor: 'white',
                                  position: 'center'
                              })
                                this.addFoodDialog = false  
                                this.hideFoodUploaderTwo = false
                                this.hideFoodImage = true
                          })
                  })
          }
        },
        cancel(){
            this.foodNames = ''
            // this.kidsfood = false
            this.selectCategory = ''
            this.foodPrice = 0
            this.description = ''
            this.selectedFood = []
            this.isEdit = false
            this.hideFoodImage = true
        },
        getedit (task) {
            console.log(task, 'task')
            this.selectedFood = task
            this.foodID = task['.key']
            this.foodNames = task.foodName
            // this.kidsfood = task.foodType
            this.selectCategory = { label: task.category, value: task.category }
            this.foodPrice = task.foodPrice
            this.description = task.foodDescription
            this.addFoodDialog = true
            this.isEdit = true
        },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Food?',
                    message: 'Delete This Food?',
                    ok: 'Yes',
                    color: 'orange-8',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Food').doc(id).delete()
                    this.$q.notify({
                            message: 'Food Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
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
                            foodPic: this.newFoodPic,
                            // foodType: this.kidsfood === true ? 'Kiddie Food' : 'Adult Food'
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
                                // this.kidsfood = false
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