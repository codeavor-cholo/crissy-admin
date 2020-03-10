<template>
    <q-page padding>
        <div class="row justify-between q-pt-md">
            <div class="q-pl-md">
                <q-btn label="Add New Motif" icon="add" color="orange-8" @click="addMotifDialog = true, isEdit = false" >
                    <q-tooltip>
                        Add Motif
                    </q-tooltip>
                </q-btn>
            </div>
            <div class="q-pr-xl">
                <q-input dense v-model="filter" clearable type="text" label="Search Motif" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
            </div>
        </div>
        <div class="q-pt-md">
        <q-table grid :data="Motif" :columns="columns" :pagination.sync="pagination" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px" >
                                            <q-list>
                                                <q-item>
                                                    <q-item-section class="text-center">
                                                        <q-item-label style="font-size:17px"><b>{{props.row.motif}}</b></q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                            <q-separator  inset />
                                            <q-card-actions class="row justify-between">
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
        </div>
        <!--Modal For add Food-->
        <q-dialog v-model="addMotifDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Motif': 'Add New Motif'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="motif" label="Motif"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Motif" v-close-popup @click="addMotif"/>
                    <q-btn v-if="isEdit" flat label="Update Motif" color="orange-8" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Motif', this.$firestoreApp.collection('Motif'))
            .then(Motif => {
            console.log(Motif, 'Motif')
            })
    },
    data () {
        return {
            isEdit: false,
            addMotifDialog: false,
            editDialog: false,
            motif: '',
            Motif: [],
            filter: '',
            columns: [
                    { name: 'motif', required: true, label: 'Motif', align: 'left', field: 'motif', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.motif = ''
        },
        setTask(){
                var motifBago = {
                    motif: this.motif,
                }
                if(this.motif === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Motif',
                    message: 'Update This Motif?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Motif').doc(this.motifID).set(motifBago)
                    this.$q.notify({
                            message: 'Motif Updated!',
                            icon: 'mdi-update',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.motif = ''
                        this.addMotifDialog = false  
                }).onCancel(()=>{
                    this.addMotifDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.motifID = task['.key']
            this.motif = task.motif
			this.addMotifDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Motif?',
                    message: 'Delete This Motif?',
                    color:'orange-8',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Motif').doc(id).delete()
                    this.$q.notify({
                            message: 'Motif Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addMotif () {
            var motif = {
                motif: this.motif,
            }   
            let optionss = this.$lodash.filter(this.Motif, m => {
                if(m.motif === this.motif){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.motif === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addMotifDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addMotifDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Motif',
                        message: 'Add This Motif?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Motif').add(motif)
                            this.$q.notify({
                                    message: 'Motif Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.motif = ''
                            }).onCancel(()=>{
                                this.addMotifDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>