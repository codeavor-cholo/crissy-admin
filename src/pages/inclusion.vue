<template>
    <q-page padding>
        <q-table grid :data="Inclusion" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px"  >
                                            <q-list>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label class="text-h6"> {{props.row.inclusion}}</q-item-label>
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
        <q-page-sticky position="top-left" :offset="[20, 10]">
            <q-btn label="Add New Inclusion" icon="add" color="orange-8" @click="addInclusionDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Inclusion
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addInclusionDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Inclusion': 'Add New Inclusion'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="inclusion" label="Inclusion"/>
                    <!-- <q-input type="number" class="q-ma-sm" outlined color="orange-8" v-model="price" label="Price"/> -->
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Inclusion" v-close-popup @click="addInclusion"/>
                    <q-btn v-if="isEdit" flat label="Update Inclusion" style="color: #FFC2C2" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Inclusion', this.$firestoreApp.collection('Inclusion'))
            .then(Inclusion => {
            console.log(Inclusion, 'Inclusion')
            })
    },
    data () {
        return {
            isEdit: false,
            addInclusionDialog: false,
            editDialog: false,
            inclusion: '',
            // price: 0,
            Inclusion: [],
            filter: '',
            columns: [
                    { name: 'inclusion', required: true, label: 'Inclusion', align: 'left', field: 'inclusion', sortable: true },
                    // { name: 'price', required: true, label: 'Price', align: 'left', field: 'price', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.inclusion = ''
            // this.price = 0

        },
        setTask(){
                var inclusionBago = {
                    inclusion: this.inclusion
                    // price: this.price
                }
                if(this.inclusion === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Inclusion',
                    message: 'Update This Inclusion?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Inclusion').doc(this.inclusionID).set(inclusionBago)
                    this.$q.notify({
                            message: 'Inclusion Updated!',
                            icon: 'mdi-update',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.inclusion = ''
                        this.addInclusionDialog = false  
                }).onCancel(()=>{
                    this.addInclusionDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.inclusionID = task['.key']
            this.inclusion = task.inclusion
            // this.price = task.price
			this.addInclusionDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Inclusion?',
                    message: 'Delete This Inclusion?',
                    color: 'orange-8',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Inclusion').doc(id).delete()
                    this.$q.notify({
                            message: 'Inclusion Deleted!',
                            icon: 'mdi-delete',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addInclusion () {
            var inclusion = {
                inclusion: this.inclusion,
                // price: this.price
            }   
            let optionss = this.$lodash.filter(this.Inclusion, m => {
                if(m.inclusion === this.inclusion){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.inclusion === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addInclusionDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addInclusionDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Inclusion',
                        message: 'Add This Inclusion?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Inclusion').add(inclusion)
                            this.$q.notify({
                                    message: 'Inclusion Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.inclusion = ''
                            }).onCancel(()=>{
                                this.addInclusionDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>