<template>
    <q-page padding="">
    <template>
        <div class="row justify-between q-pt-md">
            <div class="q-pl-md">
                <q-btn label="Add New Theme" icon="add" color="orange-8" @click="addThemeDialog = true, cancel()">
                    <q-tooltip>
                        Add Theme
                    </q-tooltip>
                </q-btn>
            </div>
            <div class="q-pr-xl">
                <q-input dense v-model="filter" clearable type="text" label="Search Theme" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
            </div>               
        </div>
                    <div class="q-pt-md">
                        <q-table grid :data="Theme" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                
                                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card"  style="border-radius:20px" >
                                        <div>
                                            <q-img :src="props.row.themePic" :ratio="3/2" style="border-radius:20px 20px 0 0">
                                            </q-img>
                                            <div class="column items-center justify-center q-pa-sm">
                                                <span class="text-weight-light">Theme</span>
                                                <span class="text-weight-bold">{{props.row.themeName}}</span>
                                                <span class="text-weight-light">Description</span>
                                                <span class="text-weight-bold">{{props.row.themeDescription}}</span>
                                            </div>
                                        <q-separator  inset />
                                        <q-card-actions class="row justify-between q-pb-md">
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
        <q-dialog v-model="addThemeDialog" persistent>
            <q-card style="width: 600px" >
                <q-card-section class="q-pb-none">
                <div class="text-h6">{{isEdit ? 'Edit Theme': 'Add New Theme'}}</div>
                </q-card-section>

                <q-card-section class="q-pa-md">
                <q-input outlined rounded color="orange-8" class="q-ma-sm col" v-model="themeNames" label="Theme Name"/>
                <q-input outlined rounded v-model="description" class="q-ma-sm col" color="orange-8" label="Theme Description" type="textarea" />
                <div v-if="isEdit">
                    <q-img :src="this.selectedTheme.themePic" v-show="hideThemeImage" class="full-width" style="height: 300px">
                        <q-btn @click="hideThemeUploaderTwo = true, hideThemeImage = false" round color="green" icon="mdi-pencil">
                            <q-tooltip>
                                Update Image
                            </q-tooltip>  
                        </q-btn> 
                    </q-img>
                </div>
                <div v-else v-show="hideThemeUploader">
                    <q-btn v-show="isEdit = false" @click="hideThemeUploader = false, hideThemeImage = true" flat round dense icon="close">
                        <q-tooltip>
                            cancel
                        </q-tooltip>  
                    </q-btn> 
                    <q-uploader outlined rounded ref="themeref" class="q-ma-sm col" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="themepic" label="Upload Photo" color="orange-8" style="width: 512px;" />
                </div>
                <div v-if="isEdit" v-show="hideThemeUploaderTwo">
                    <q-btn @click="hideThemeUploaderTwo = false, hideThemeImage = true" flat round dense icon="close">
                        <q-tooltip>
                            cancel
                        </q-tooltip>  
                    </q-btn> 
                    <q-uploader outlined rounded ref="themeref" class="q-ma-sm" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" :url="themepic" label="Upload Photo" color="green" style="width: 400px;" />
                </div>
                </q-card-section> 

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" @click="cancel" v-close-popup color="grey-8" />
                <q-btn flat v-if="!isEdit" label="Add Theme" @click="addTheme" color="orange-8" v-close-popup />
                <q-btn v-if="isEdit" flat label="Update Theme" color="orange-8" v-close-popup v-on:click="setTask"/>
                <!-- <q-btn flat label="merge Theme" @click="mergePricing" color="pink-3" /> -->
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
            hideThemeUploader: true, 
            hideThemeImage: true,
            hideThemeUploaderTwo: false,
            filter: '',
            Theme: [],
            newThemePic: '',
            picTheme: '',
            storageRef: null,
            description: '',
            selectedTheme: [],
            themeNames: '',
            themepic: '',
            isEdit: false,
            addThemeDialog: false,
            isEdit: false,
            filter: '',
            pagination: { sortBy: 'Theme', descending: false, page: 1, rowsPerPage: 9},
            columns: [
                { name: 'themeName', align: 'center', label: '', field: 'themeName', sortable: true },
                { name: 'themeDescription', align: 'center', label: '', field: 'themeDescription', sortable: true },

            ]
        }
    },
    mounted () {
        this.$binding('Theme', this.$firestoreApp.collection('Theme'))
            .then(Theme => {
            console.log(Theme, 'Theme')
        }),
            this.storageRef = this.$firebase.storage().ref()
            console.log(this.storageRef, 'store')
    },
    computed: {
        
    },
    methods:{
        setTask(){
            if(this.$refs.themeref.files.length === 0){
                  var themeBago = {
                    themeName: this.themeNames,
                    themeDescription: this.description,
                    themePic: this.selectedTheme.themePic,
                }
                  if(this.themeNames === '' && this.description === ''){
                      this.$q.dialog({
                      title: 'Field Required!',
                      message: 'Fill all Requirements?',
                      ok: 'Ok',
                      cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Theme',
                    message: 'Update This Theme?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Theme').doc(this.themeID).set(themeBago)
                    this.$q.notify({
                            message: 'Theme Updated!',
                            icon: 'mdi-update',
                            color: 'green',
                            textColor: 'white',
                            position: 'center'
                        })
                            this.addThemeDialog = false  
                            this.hideThemeUploaderTwo = false
                            this.hideThemeImage = true
                            this.themeNames = ''
                            this.description = ''
                            this.selectedTheme = []
                })  
          }else{
                let vm = this
                  if(this.themeNames === '' && this.description === ''){
                        this.$q.dialog({
                        title: 'Field Required!',
                        message: 'Fill all Requirements?',
                        ok: 'Ok',
                        cancel: 'Cancel'
                      })
                      }else
                      this.$q.dialog({
                      title: 'Update Theme',
                      message: 'Update This Theme?',
                      ok: 'Yes',
                      cancel: 'Cancel'
                  }).onOk(() => { 
                      vm.uploadThemePhoto()
                      .then((user)=>{
                          var themeBago = {
                            themeName: this.themeNames,
                            themeDescription: this.description,
                            themePic: this.newThemePic,
                        }
                          this.$firestoreApp.collection('Theme').doc(this.themeID).set(themeBago)
                          this.$q.notify({
                                  message: 'Theme Updated!',
                                  icon: 'mdi-update',
                                  color: 'green',
                                  textColor: 'white',
                                  position: 'center'
                              })
                                this.addThemeDialog = false  
                                this.hideThemeUploaderTwo = false
                                this.hideThemeImage = true
                          })
                  })
          }
        },
        cancel(){
            this.themeNames = ''
            this.description = ''
            this.selectedTheme = []
            this.isEdit = false
            this.hideThemeImage = true
        },
        getedit (task) {
            console.log(task, 'task')
            this.selectedTheme = task
            this.themeID = task['.key']
            this.themeNames = task.themeName
            this.description = task.themeDescription
            this.addThemeDialog = true
            this.isEdit = true
        },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Theme?',
                    message: 'Delete This Theme?',
                    ok: 'Yes',
                    color: 'orange-8',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Theme').doc(id).delete()
                    this.$q.notify({
                            message: 'Theme Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addTheme () {
            let vm = this
            let optionss = this.$lodash.filter(this.Theme, m => {
                if(m.themeName === this.themeNames){
                    return m
                }
            })   
                if(this.description === '' || this.themeNames === ''){
                  this.$q.dialog({
                  title: 'Field Required!',
                  message: 'Fill all Requirements?',
                  ok: 'Ok',
                  persistent: true
                }).onOk(()=>{
                    this.addThemeDialog = true
                })
                }else{
                     if(optionss.length > 0){
                        this.$q.dialog({
                        title: 'Duplicate Entry!',
                        message: 'Unable to save?',
                        ok: 'Ok',
                        persistent: true
                        }).onOk(() => {
                            this.addThemeDialog = true
                        })
                    }else{ 
                    this.$q.dialog({
                    title: 'Add Theme',
                    message: 'Add This Theme?',
                    ok: 'Yes',
                    color:'orange-8',
                    cancel: 'Cancel',
                    persistent: true
                  }).onOk(() => {
                      vm.uploadThemePhoto()
                      .then((user) => {
                        var theme = {
                            themeName: this.themeNames,
                            themeDescription: this.description,
                            themePic: this.newThemePic,
                        }

                            vm.$firestoreApp.collection('Theme').add(theme)
                            this.$q.notify({
                                  message: 'Theme Added!',
                                  icon: 'mdi-folder-plus-outline',
                                  color: 'orange-8',
                                  textColor: 'white',
                                  position: 'center'
                              })
                                this.themeNames = ''
                                this.description = ''
                            })
                      }).onCancel(()=>{
                            this.addThemeDialog = true
                      })
                  }
              }
        },
        uploadThemePhoto: async function () {
                let promise = new Promise((resolve, reject ) => {
                
                let themess = this.picTheme
                let random = sri(9)
                console.log(random, 'rand')
                console.log(this.themepic, 'themeref')
                let vm = this
                let uploadTask = this.storageRef.child(`themePhotos/${random}`).put(themess)
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
                    vm.themepic = downloadURL
                    resolve(downloadURL)
                    console.log(downloadURL, 'download')
                })
                })
            })
            let result = await promise
            console.log('result',result)
            this.newThemePic = result
            this.themepic = this.newThemePic
            return result
        },
        photoAdded (p) {
            var photo = this.$refs.themeref.files[0]
            
            this.picTheme = photo
            console.log('photo2', photo)
        },
    }
}
</script>