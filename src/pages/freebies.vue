<template>
    <q-page padding>
        <q-table grid :data="Freebies" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                    <q-card class="my-card q-pa-sm"  style="border-radius:20px"  >
                            <q-list>
                                <q-item>
                                    <q-item-section>
                                        <q-item-label class="text-h6"> {{props.row.freebies}} <b class="float-right text-orange-8">{{props.row.price}}php</b></q-item-label>
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
            <q-btn label="Add New Freebies" icon="add" color="orange-8" @click="addFreebiesDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Freebies
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addFreebiesDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Freebies': 'Add New Freebies'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="freebies" label="Freebies"/>
                    <q-input type="number" class="q-ma-sm" outlined color="orange-8" v-model="price" label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Freebies" v-close-popup @click="addFreebies"/>
                    <q-btn v-if="isEdit" flat label="Update Freebies" style="color: #FFC2C2" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Freebies', this.$firestoreApp.collection('Freebies'))
            .then(Freebies => {
            console.log(Freebies, 'Freebies')
            })
    },
    data () {
        return {
            isEdit: false,
            addFreebiesDialog: false,
            editDialog: false,
            freebies: '',
            price: 0,
            Freebies: [],
            filter: '',
            columns: [
                    { name: 'freebies', required: true, label: 'Freebies', align: 'left', field: 'freebies', sortable: true },
                    { name: 'price', required: true, label: 'Price', align: 'left', field: 'price', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.freebies = ''
            this.price = 0

        },
        setTask(){
                var freebiesBago = {
                    freebies: this.freebies,
                    price: this.price
                }
                if(this.freebies === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Freebies',
                    message: 'Update This Freebies?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Freebies').doc(this.freebiesID).set(freebiesBago)
                    this.$q.notify({
                            message: 'Freebies Updated!',
                            icon: 'mdi-update',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.freebies = ''
                        this.addFreebiesDialog = false  
                }).onCancel(()=>{
                    this.addFreebiesDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.freebiesID = task['.key']
            this.freebies = task.freebies
            this.price = task.price
			this.addFreebiesDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Freebies?',
                    message: 'Delete This Freebies?',
                    color: 'orange-8',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Freebies').doc(id).delete()
                    this.$q.notify({
                            message: 'Freebies Deleted!',
                            icon: 'mdi-delete',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addFreebies () {
            var freebies = {
                freebies: this.freebies,
                price: this.price
            }   
            let optionss = this.$lodash.filter(this.Freebies, m => {
                if(m.freebies === this.freebies){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.freebies === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addFreebiesDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addFreebiesDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Freebies',
                        message: 'Add This Freebies?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Freebies').add(freebies)
                            this.$q.notify({
                                    message: 'Freebies Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.freebies = ''
                            }).onCancel(()=>{
                                this.addFreebiesDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>