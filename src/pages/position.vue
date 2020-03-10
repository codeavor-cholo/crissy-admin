<template>
    <q-page padding>
        <div class="row justify-between q-pt-md">
            <div class="q-pl-md">
                <q-btn label="Add New Position" icon="add" color="orange-8" @click="addPositionDialog = true, isEdit = false">
                    <q-tooltip>
                        Add Position
                    </q-tooltip>
                </q-btn>    
            </div>
            <div class="q-pr-xl">    
                <q-input dense v-model="filter" clearable type="text" label="Search Position" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
            </div>
        </div>
        <div class="q-pt-md">
        <q-table grid :data="Position" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px">
                                            <q-list>
                                                <q-item>
                                                    <q-item-section class="text-center">
                                                        <q-item-label style="font-size:17px"><b>{{props.row.position}}</b></q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                            <q-separator inset />
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
        <q-dialog v-model="addPositionDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Position': 'Add New Position'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="position" label="Position"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Position" v-close-popup @click="addPosition"/>
                    <q-btn v-if="isEdit" flat label="Update Position" color="orange-8" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Position', this.$firestoreApp.collection('Position'))
            .then(Position => {
            console.log(Position, 'Position')
            })
    },
    data () {
        return {
            isEdit: false,
            addPositionDialog: false,
            editDialog: false,
            position: '',
            filter: '',
            Position: [],
            filter: '',
            columns: [
                    { name: 'position', required: true, label: 'Position', align: 'left', field: 'position', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.position = ''
        },
        setTask(){
                var positionBago = {
                    position: this.position,
                }
                if(this.position === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Position',
                    message: 'Update This Position?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Position').doc(this.positionID).set(positionBago)
                    this.$q.notify({
                            message: 'Position Updated!',
                            icon: 'mdi-update',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.position = ''
                        this.addPositionDialog = false  
                }).onCancel(()=>{
                    this.addPositionDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.positionID = task['.key']
            this.position = task.position
			this.addPositionDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Position?',
                    message: 'Delete This Position?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Position').doc(id).delete()
                    this.$q.notify({
                            message: 'Position Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addPosition () {
            var position = {
                position: this.position,
            }   
            let optionss = this.$lodash.filter(this.Position, m => {
                if(m.position === this.position){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.position === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addPositionDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addPositionDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Position',
                        message: 'Add This Position?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Position').add(position)
                            this.$q.notify({
                                    message: 'Position Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.position = ''
                            }).onCancel(()=>{
                                this.addPositionDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>