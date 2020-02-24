<template>
    <q-page padding>
        <q-table grid :data="Services" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px" >
                                            <q-list>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label class="text-h6"> {{props.row.services}} <b class="float-right text-orange-8">{{props.row.price}}php</b></q-item-label>
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
            <q-btn label="Add New Services" icon="add" color="orange-8" @click="addServicesDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Services
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addServicesDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Services': 'Add New Services'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="services" label="Services"/>
                    <q-input type="number" class="q-ma-sm" outlined color="orange-8" v-model="price" label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Services" v-close-popup @click="addServices"/>
                    <q-btn v-if="isEdit" flat label="Update Services" color="orange-8" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Services', this.$firestoreApp.collection('Services'))
            .then(Services => {
            console.log(Services, 'Services')
            })
    },
    data () {
        return {
            isEdit: false,
            addServicesDialog: false,
            editDialog: false,
            services: '',
            price: 0,
            Services: [],
            filter: '',
            columns: [
                    { name: 'services', required: true, label: 'Services', align: 'left', field: 'services', sortable: true },
                    { name: 'price', required: true, label: 'Price', align: 'left', field: 'price', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.services = ''
            this.price = 0

        },
        setTask(){
                var servicesBago = {
                    services: this.services,
                    price: this.price
                }
                if(this.services === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Services',
                    message: 'Update This Services?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Services').doc(this.servicesID).set(servicesBago)
                    this.$q.notify({
                            message: 'Services Updated!',
                            icon: 'mdi-update',
                            color: '#FFC2C2',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.services = ''
                        this.addServicesDialog = false  
                }).onCancel(()=>{
                    this.addServicesDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.servicesID = task['.key']
            this.services = task.services
            this.price = task.price
			this.addServicesDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Services?',
                    message: 'Delete This Services?',
                    ok: 'Yes',
                    color: 'orange-8',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Services').doc(id).delete()
                    this.$q.notify({
                            message: 'Services Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addServices () {
            var services = {
                services: this.services,
                price: this.price
            }   
            let optionss = this.$lodash.filter(this.Services, m => {
                if(m.services === this.services){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.services === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addServicesDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addServicesDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Services',
                        message: 'Add This Services?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Services').add(services)
                            this.$q.notify({
                                    message: 'Services Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.services = ''
                            }).onCancel(()=>{
                                this.addServicesDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>