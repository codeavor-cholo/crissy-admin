<template>
    <q-page padding>
        <q-table grid :data="City" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                     <q-card class="my-card q-pa-sm" style="border-radius:20px" >
                                            <q-list>
                                                <q-item class="text-h6">
                                                    <q-item-section>
                                                        <q-item-label> {{props.row.city}}</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section class="row">

                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                            <q-separator  inset />
                                            <q-card-actions align="center">
                                                <q-btn flat dense label="edit" color="green" icon="mdi-pencil" @click="getedit(props.row)">
                                                    <q-tooltip>
                                                        Edit
                                                    </q-tooltip>
                                                </q-btn>
                                                <q-btn flat icon="delete" label="delete" dense style="color: #010A43" @click="deletedialog(props.row)">
                                                    <q-tooltip> 
                                                        Delete
                                                    </q-tooltip>
                                                </q-btn>
                                            </q-card-actions>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[80, 50]">
            <q-btn label="Add New City" icon="add" color="orange-8" @click="addCityDialog = true, isEdit = false" />
                <q-tooltip>
                    Add City
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addCityDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit City': 'Add New City'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="city" label="City"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add City" v-close-popup @click="addCity"/>
                    <q-btn v-if="isEdit" flat label="Update City" color="orange-8" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('City', this.$firestoreApp.collection('City'))
            .then(City => {
            console.log(City, 'City')
            })
    },
    data () {
        return {
            isEdit: false,
            addCityDialog: false,
            editDialog: false,
            city: '',
            City: [],
            filter: '',
            columns: [
                    { name: 'city', required: true, label: 'City', align: 'left', field: 'city', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.city = ''
        },
        setTask(){
                var cityBago = {
                    city: this.city,
                }
                if(this.city === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update City',
                    message: 'Update This City?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('City').doc(this.cityID).set(cityBago)
                    this.$q.notify({
                            message: 'City Updated!',
                            icon: 'mdi-update',
                            color: '#FFC2C2',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.city = ''
                        this.addCityDialog = false  
                }).onCancel(()=>{
                    this.addCityDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.cityID = task['.key']
            this.city = task.city
			this.addCityDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete City?',
                    message: 'Delete This City?',
                    ok: 'Yes',
                    color: 'orange-8',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('City').doc(id).delete()
                    this.$q.notify({
                            message: 'City Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addCity () {
            var city = {
                city: this.city,
            }   
            let optionss = this.$lodash.filter(this.City, m => {
                if(m.city === this.city){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.city === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addCityDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addCityDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add City',
                        message: 'Add This City?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('City').add(city)
                            this.$q.notify({
                                    message: 'City Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.city = ''
                            }).onCancel(()=>{
                                this.addCityDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>