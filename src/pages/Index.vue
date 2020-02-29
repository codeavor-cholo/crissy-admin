<template>
  <q-page padding>
    <q-table title="" :data="Food" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
      <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="foodPic" :props="props">
              <q-img :src="props.row.foodPic" style="width: 150px" :ratio="1" basic spinner-color="white"></q-img>
            </q-td>
            <q-td key="dishType" :props="props">{{props.row.dishType}}</q-td>
            <q-td key="category" :props="props">{{props.row.category}}</q-td>
            <q-td key="foodName" :props="props">{{props.row.foodName}}</q-td>
            <q-td autogrow key="foodDescription" :props="props">{{props.row.foodDescription}}</q-td>
            <q-td key="addedPrice" :props="props">{{props.row.addedPrice}} per Head</q-td>
            <q-td key="price" :props="props">{{props.row.foodPrice}} per Head</q-td>
            <q-td key="foodTotalPrice" :props="props">{{props.row.foodTotalPrice}} per Head</q-td>
            <q-td key="action" :props="props">
              <q-btn no-caps dense color="primary" label="Update Food" icon="mdi-pencil" @click="editDialog = true,openEditDialog(props.row)"></q-btn>
              <!-- <q-btn no-caps icon="delete" dense color="negative" @click="openDeleteDialog(props.row)"></q-btn> -->
            </q-td>  
          </q-tr>
      </template>
      <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
      </template>  
    </q-table>

    <!--FLOATING BUTTON-->
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="addFoodDialog = true" />
        <q-tooltip>
            Add Food
        </q-tooltip>
    </q-page-sticky>
    <!--Modal For add Food-->
    <q-dialog v-model="addFoodDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Food</div>
        </q-card-section>

        <q-card-section>
          <q-uploader ref="foodref" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="foodpic" label="Upload Photo" color="purple" square flat bordered style="width: 500px" />
          <q-select class="q-ma-sm" filled v-model="selectDishType" :options="foodDishOptions" emit-value map-options label="Dish Type" style="width: 500px" />
          <q-select class="q-ma-sm" filled @input="foodPriceByCategory" v-model="selectFoodCategory" :options="foodCategoryType" label="Category" emit-value map-options style="width: 500px"/>
          <q-input class="q-ma-sm" dense v-model="foodNames" label="Food Name"/>
          <q-input class="q-ma-sm" v-model="foodDesc" label="Food Descriptions" filled autogrow />
          <q-input class="q-ma-sm" type="number" @change="addedPriceZero" placeholder="Optional" v-model="additionalPrice" prefix="Php" suffix="Added Price Per Head" label="Food Additional Price">
            <template v-slot:prepend>
              <q-icon name="mdi-currency-php" />
            </template>
          </q-input>
          <q-input class="q-ma-sm" readonly type="number" v-model="foodPrice" prefix="Php" suffix="Price Per Head" label="Food Category Price">
            <template v-slot:prepend>
              <q-icon name="mdi-currency-php" />
            </template>
          </q-input>
          <q-input class="q-ma-sm" readonly type="number" v-model="totalFoodPrice" prefix="Php" label="Food Total Price">
            <template v-slot:prepend>
              <q-icon name="mdi-currency-php" /> {{foodTotalPriceforCustomize}}
            </template>
          </q-input>
        </q-card-section> 

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Food" v-close-popup v-on:click="addFood" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="width: 1000px">
        <q-card-section>
          <div class="text-h6">Edit Food</div>
        </q-card-section>

        <q-card-section>
         <q-img :src="this.selectedFoodPic.foodPic" v-show="hideFoodImage" class="full-width" style="height: 300px">
              <q-btn @click="hideFoodUploader = true, hideFoodImage = false" round color="blue" icon="mdi-pencil">
                <q-tooltip>
                    Update Image
                </q-tooltip>  
              </q-btn> 
          </q-img>
          <div v-show="hideFoodUploader">
          <q-btn @click="hideFoodUploader = false, hideFoodImage = true" flat round dense icon="close">
              <q-tooltip>
                  cancel
              </q-tooltip>  
          </q-btn> 
            <q-uploader ref="foodref" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="foodpic" label="Upload Photo" color="purple" square flat bordered style="width: 500px" />
          </div>
          <q-select  class="q-ma-sm" filled :options="foodDishOptions" v-model="editDishType" label="Dish Type"/>
          <q-select class="q-ma-sm" v-model="editCategory" :options="foodCategoryOptions" filled label="Food Type"/>
          <q-input class="q-ma-sm" v-model="editFoodName" label="Food Name" />
          <q-input class="q-ma-sm" v-model="editFoodDesc" label="Food Description" filled autogrow />
          <q-input class="q-ma-sm" type="number" @input="editfoodTotalPriceforCustomize" placeholder="Optional" dense v-model="editAdditionalPrice" prefix="Php" suffix="Added Price Per Head" label="Food Additional Price">
            <template v-slot:prepend>
              <q-icon name="mdi-cash" />
            </template>
          </q-input>
          <q-input class="q-ma-sm" suffix="price per head" type="number" label="Food Price" v-model="editFoodPrice" />
          <q-input class="q-ma-sm" type="number" v-model="edittotalFoodPrice" prefix="Php" label="Food Total Price">
            <template v-slot:prepend>
              <q-icon name="mdi-currency-php" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="hideFoodUploader = false, hideFoodImage = true" v-close-popup />
          <q-btn flat label="Update" @click="setTask"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
        let sri = require('simple-random-id')
export default {
  methods: {
        editfoodTotalPriceforCustomize() {
                    if(this.editAdditionalPrice === 0 && this.editFoodPrice === 0){
                        return 0
                    }else{
                    let sum = parseInt(this.editAdditionalPrice) + parseInt(this.editFoodPrice)
                     this.edittotalFoodPrice = sum
                    }
            },
        foodPriceByCategory(){ 
                   let optionss = this.$lodash.filter(this.Dishprice, m => {
						return m.category === this.selectFoodCategory && m.dishName === this.selectDishType
                    })    
                        console.log(optionss, 'ss')
                        this.foodPrice = ''
                        this.foodPrice = optionss[0].maxPrice
        },
        photoAdded (p) {
            var photo = this.$refs.foodref.files[0]
            
            this.picFood = photo
            console.log('photo2', photo)
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
        clear(){
                this.selectDishType = ''
                this.selectFoodCategory = ''
                this.foodNames = ''
                this.foodDesc = ''
                this.foodPrice = 0
                this.foodref = null
                this.additionalPrice = 0
                this.foodTotalPriceforCustomize = 0
          },
        foodDishType(){ 
                   let optionss = this.$lodash.filter(this.Category, m => {
						        return m.category == this.selectFoodCategory 
                    })    
                        console.log(optionss, 'ss')
                        this.selectDishType = optionss[0].dishType
                },
        foodEditDishType(){ 
                   let optionss = this.$lodash.filter(this.Category, m => {
						        return m.category == this.editCategory 
                    })    
                        console.log(optionss, 'ss')
                        this.editDishType = optionss[0].dishType
                },
        addFood () {
            let vm = this
            let optionss = this.$lodash.filter(this.Food, m => {
                if(m.foodName === this.foodNames){
                    return m
                }
            })   
                if(this.selectDishType === '' || this.selectFoodCategory === '' || this.foodNames === '' || this.foodPrice === '' || this.foodDesc === ''){
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
                    cancel: 'Cancel',
                    persistent: true
                  }).onOk(() => {
                      vm.uploadFoodPhoto()
                      .then((user) => {
                        var food = {
                        dishType: this.selectDishType,
                        category: this.selectFoodCategory,
                        foodName: this.foodNames,
                        foodDescription: this.foodDesc,
                        foodPrice: this.foodPrice,
                        foodPic: this.newFoodPic,
                        addedPrice: this.additionalPrice,
                        foodTotalPrice: this.foodTotalPriceforCustomize
                        }
                            vm.$firestoreApp.collection('Food').add(food)
                            this.$q.notify({
                                  message: 'Food Added!',
                                  icon: 'mdi-folder-plus-outline',
                                  color: 'positive',
                                  textColor: 'white',
                                  position: 'center'
                              })
                                this.additionalPrice = 0
                                this.selectDishType = ''
                                this.selectFoodCategory = ''
                                this.foodDesc = ''
                                this.foodNames = ''
                                this.foodPrice = 0
                          })
                      }).onCancel(()=>{
                            this.addFoodDialog = true
                      })
                  }
              }
        },
        openEditDialog (props) {
          this.selectedFoodPic = props
          this.foodId = props['.key']
          this.editFoodName = props.foodName
          this.editFoodDesc = props.foodDescription
          this.editFoodPrice = props.foodPrice
          this.editAdditionalPrice = props.addedPrice
          this.edittotalFoodPrice = props.foodTotalPrice
          this.editDishType = { label: props.dishType, value: props.dishType }
          this.editCategory = { label: props.category, value: props.category }
          console.log(props, 'props')
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Food',
            message: 'Delete This Food?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Food').doc(id).delete()
            this.$q.notify({
                    message: 'Food Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })

        },  
        setTask(){
          if(this.$refs.foodref.files.length === 0){
                  var foodBago = {
                    dishType: this.editDishType.value,
                    category: this.editCategory.value,
                    foodName: this.editFoodName,
                    foodDescription: this.editFoodDesc,
                    addedPrice: this.editAdditionalPrice,
                    foodPrice: this.editFoodPrice,
                    foodTotalPrice: this.edittotalFoodPrice,
                    foodPic: this.selectedFoodPic.foodPic
                  }
                  if(this.editCategory === '' && this.editDishType === '' && this.editFoodName === '' && this.editFoodPrice === '' && this.editFoodDesc === ''){
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
                    this.$firestoreApp.collection('Food').doc(this.foodId).set(foodBago)
                    this.$q.notify({
                            message: 'Food Updated!',
                            icon: 'mdi-update',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                          this.editDialog = false  
                })  
          }else{
                let vm = this
                  if(this.editCategory === '' && this.editDishType === '' && this.editFoodName === '' && this.editFoodPrice === '' && this.editFoodDesc === ''){
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
                            dishType: this.editDishType.value,
                            category: this.editCategory.value,
                            foodName: this.editFoodName,
                            foodDescription: this.editFoodDesc,
                            addedPrice: this.editAdditionalPrice,
                            foodPrice: this.editFoodPrice,
                            foodTotalPrice: this.edittotalFoodPrice,
                            foodPic: this.newFoodPic
                          }
                          this.$firestoreApp.collection('Food').doc(this.foodId).set(foodBago)
                          this.$q.notify({
                                  message: 'Food Updated!',
                                  icon: 'mdi-update',
                                  color: 'positive',
                                  textColor: 'white',
                                  position: 'center'
                              })
                                this.editDialog = false  
                                hideFoodUploader = false
                                hideFoodImage = true
                      })
                  })
          }
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
        })
            this.$binding('Dish', this.$firestoreApp.collection('Dish'))
            .then(Dish => {
            console.log(Dish, 'Dish')
        }),
        this.$binding('Dishprice', this.$firestoreApp.collection('Dishprice'))
            .then(Dishprice => {
            console.log(Dishprice, 'Dishprice')
        }), 
            this.storageRef = this.$firebase.storage().ref()
            console.log(this.storageRef, 'store')
    },
  computed:{
            foodTotalPriceforCustomize() {
                    if(this.additionalPrice === 0 && this.foodPrice === 0){
                        return 0
                    }else{
                    let sum = parseInt(this.additionalPrice) + parseInt(this.foodPrice)
                    return sum
                    }
            },
            foodCategoryType(){
                    let optionss = this.$lodash.filter(this.Category, m => {
                            return m.dishType == this.selectDishType    
                        })
                        let opt = this.$lodash.map(optionss, n => {
                            return { label: n.category, value: n.category }
                        })
                        console.log(optionss, 'opt')
                        console.log(opt, 'opoopst')
                        return opt
            },
            foodEditCategoryType(){
                    let optionss = this.$lodash.filter(this.Category, m => {
                            return m.dishType == this.editDishType    
                        })
                        let opt = this.$lodash.map(optionss, n => {
                            return { label: n.category, value: n.category }
                        })
                        console.log(optionss, 'opt')
                        console.log(opt, 'opoopst')
                        return opt
            },
            foodCategoryOptions(){
                let options = this.Category.map(Category => {
                    return {
                        label: Category.category,
                        value: Category.category
                    }
                })

                return options
            },
            foodDishOptions(){
                let optionss = this.Dish.map(Dish => {
                    return {
                        label: Dish.dishName,
                        value: Dish.dishName
                    }
                })

                return optionss
            },
            addedPriceZero(){
                if(this.additionalPrice === ''){
                    return 0
                }else{
                  return 0
                }
            }
        },
            

  data() {
    return {
      hideFoodUploader: false,
      hideFoodImage: true,
      editAdditionalPrice: 0,
      additionalPrice: 0,
      Dishprice: [],
      newFoodPic: '',
      picFood: '',
      storageRef: null,
      foodpic: '',
      foodDesc: '',
      editFoodDesc: '',
      editFoodPrice: '',
      editCategory: '',
      selectDishType: '',
      editDishType: '',
      deleteFoodDialog: false,
      confirmFood: false,
      editDialog: false,
      addFoodDialog: false,
      foodName: '',
      totalFoodPrice: '',
      edittotalFoodPrice: '',
      selectFoodCategory: '',
      Category: [],
      selectedFoodPic: [],
      Dish: [],
      foodPrice: 0,
      editFoodName: '',
      foodNames: '',
      Food: [],
      filter: '',
      addcategory: '',
      pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
      columns: [
        { name: 'foodPic', align: 'left', label: 'Picture', field: 'foodPic', sortable: true },
        { name: 'dishType', align: 'left', label: 'Dish Type', field: 'dishType', sortable: true },
        { name: 'category', required: true, label: 'Food Type', align: 'center', field: 'category', sortable: true },
        { name: 'foodName', align: 'center', label: 'Food Name', field: 'foodName', sortable: true },
        { name: 'foodDescription', align: 'center', label: 'Description', field: 'foodDescription', sortable: true },
        { name: 'addedPrice', align: 'center', label: 'Additional Price', field: 'addedPrice', sortable: true },
        { name: 'price', label: 'Food Category Price per Head', field: 'foodPrice', sortable: true },
        { name: 'foodTotalPrice', label: 'Food Total Price per Head', field: 'foodTotalPrice', sortable: true },
        { name: 'action', align:'center', label: 'Action' }
      ]
    }
  }
}
</script>