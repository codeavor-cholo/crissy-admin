<template>
    <q-page padding>
        <q-table grid :data="Extras" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                    <q-card class="my-card q-pa-sm"  style="border-radius:20px"  >
                            <q-list>
                                <q-item>
                                    <q-item-section>
                                        <q-item-label class="text-h6"> {{props.row.extras}} <b class="float-right text-orange-8">{{props.row.price}}php</b></q-item-label>
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
            <q-btn label="Add New Extras" icon="add" color="orange-8" @click="addExtrasDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Extras
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addExtrasDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Extras': 'Add New Extras'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="extras" label="Extras"/>
                    <q-input type="number" class="q-ma-sm" outlined color="orange-8" v-model="price" label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Extras" v-close-popup @click="addExtras"/>
                    <q-btn v-if="isEdit" flat label="Update Extras" style="color: #FFC2C2" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Extras', this.$firestoreApp.collection('Extras'))
            .then(Extras => {
            console.log(Extras, 'Extras')
            })
    },
    data () {
        return {
            isEdit: false,
            addExtrasDialog: false,
            editDialog: false,
            extras: '',
            price: 0,
            Extras: [],
            filter: '',
            columns: [
                    { name: 'extras', required: true, label: 'Extras', align: 'left', field: 'extras', sortable: true },
                    { name: 'price', required: true, label: 'Price', align: 'left', field: 'price', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.extras = ''
            this.price = 0

        },
        setTask(){
                var extrasBago = {
                    extras: this.extras,
                    price: this.price
                }
                if(this.extras === ''){Extras
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Extras',
                    message: 'Update This Extras?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Extras').doc(this.extrasID).set(extrasBago)
                    this.$q.notify({
                            message: 'Extras Updated!',
                            icon: 'mdi-update',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.extras = ''
                        this.addExtrasDialog = false  
                }).onCancel(()=>{
                    this.addExtrasDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.extrasID = task['.key']
            this.extras = task.extras
            this.price = task.price
			this.addExtrasDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Extras?',
                    message: 'Delete This Extras?',
                    color: 'orange-8',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Extras').doc(id).delete()
                    this.$q.notify({
                            message: 'Extras Deleted!',
                            icon: 'mdi-delete',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addExtras () {
            var extras = {
                extras: this.extras,
                price: this.price
            }   
            let optionss = this.$lodash.filter(this.Extras, m => {
                if(m.extras === this.extras){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.extras === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addExtrasDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addExtrasDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Extras',
                        message: 'Add This Extras?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Extras').add(extras)
                            this.$q.notify({
                                    message: 'Extras Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.extras = ''
                            }).onCancel(()=>{
                                this.addExtrasDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>