<template>
    <q-page padding>
        <q-table grid :data="Addons" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card" style="border: 2px solid;border-color: purple;" >
                                            <q-list>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label overline> {{props.row.addons}} <b>{{props.row.price}}php</b></q-item-label>
                                                    </q-item-section>
                                                    <q-item-section class="row">
                                                        <q-btn flat dense label="edit" style="color: #FFC2C2" icon="mdi-pencil" @click="getedit(props.row)">
                                                            <q-tooltip>
                                                                Edit
                                                            </q-tooltip>
                                                        </q-btn>
                                                        <q-btn flat icon="delete" label="delete" dense style="color: #010A43" @click="deletedialog(props.row)">
                                                            <q-tooltip>
                                                                Delete
                                                            </q-tooltip>
                                                        </q-btn>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[80, 50]">
            <q-btn label="Add New Addons" icon="add" color="accent" @click="addAddonsDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Addons
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addAddonsDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Add-Ons': 'Add New Add-Ons'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="purple" v-model="addons" label="Add-Ons"/>
                    <q-input type="number" class="q-ma-sm" outlined color="purple" v-model="price" label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="purple" label="Add Add-Ons" v-close-popup @click="addAddons"/>
                    <q-btn v-if="isEdit" flat label="Update Add-ons" style="color: #FFC2C2" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Addons', this.$firestoreApp.collection('Addons'))
            .then(Addons => {
            console.log(Addons, 'Addons')
            })
    },
    data () {
        return {
            isEdit: false,
            addAddonsDialog: false,
            editDialog: false,
            addons: '',
            price: 0,
            Addons: [],
            filter: '',
            columns: [
                    { name: 'addons', required: true, label: 'Addons', align: 'left', field: 'addons', sortable: true },
                    { name: 'price', required: true, label: 'Price', align: 'left', field: 'price', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.addons = ''
            this.price = 0

        },
        setTask(){
                var addonsBago = {
                    addons: this.addons,
                    price: this.price
                }
                if(this.addons === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Add-Ons',
                    message: 'Update This Add-Ons?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Addons').doc(this.addonsID).set(addonsBago)
                    this.$q.notify({
                            message: 'Add-Ons Updated!',
                            icon: 'mdi-update',
                            color: '#FFC2C2',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.addons = ''
                        this.addAddonsDialog = false  
                }).onCancel(()=>{
                    this.addAddonsDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.addonsID = task['.key']
            this.addons = task.addons
            this.price = task.price
			this.addAddonsDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Add-Ons?',
                    message: 'Delete This Add-Ons?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Addons').doc(id).delete()
                    this.$q.notify({
                            message: 'Add-Ons Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addAddons () {
            var addons = {
                addons: this.addons,
                price: this.price
            }   
            let optionss = this.$lodash.filter(this.Addons, m => {
                if(m.addons === this.addons){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.addons === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addAddonsDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addAddonsDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Add-Ons',
                        message: 'Add This Add-Ons?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Addons').add(addons)
                            this.$q.notify({
                                    message: 'Add-Ons Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'purple',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.addons = ''
                            }).onCancel(()=>{
                                this.addAddonsDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>