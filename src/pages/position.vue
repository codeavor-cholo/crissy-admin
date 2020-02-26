<template>
    <q-page padding>
        <q-table grid :data="Position" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px">
                                            <q-list>
                                                <q-item class="text-h6">
                                                    <q-item-section>
                                                        <q-item-label> {{props.row.position}}</q-item-label>
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
            <q-btn label="Add New Position" icon="add" color="orange-8" @click="addPositionDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Position
                </q-tooltip>
        </q-page-sticky>
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