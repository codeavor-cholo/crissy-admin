<template>
    <q-page padding>
        <div class="row justify-between q-pt-md">
            <div class="q-pl-md">
                <q-btn label="Add New Event" icon="add" color="orange-8" @click="addEventDialog = true, isEdit = false" />
                    <q-tooltip>
                        Add Event
                    </q-tooltip>
            </div>
            <div class="q-pr-xl">
                <q-input dense v-model="filter" clearable type="text" label="Search Event" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
            </div>
        </div>
        <div class="q-pt-md">
        <q-table grid :data="Event" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px">
                                            <q-list>
                                                <q-item>
                                                    <q-item-section align="center">
                                                        <q-item-label style="font-size:17px"><b>{{props.row.event}}</b></q-item-label>
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
        <q-dialog v-model="addEventDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Event': 'Add New Event'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="event" label="Event"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Event" v-close-popup @click="addEvent"/>
                    <q-btn v-if="isEdit" flat label="Update Event" color="orange-8" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Event', this.$firestoreApp.collection('Event'))
            .then(Event => {
            console.log(Event, 'Event')
            })
    },
    data () {
        return {
            isEdit: false,
            addEventDialog: false,
            editDialog: false,
            event: '',
            Event: [],
            filter: '',
            columns: [
                    { name: 'event', required: true, label: 'Event', align: 'left', field: 'event', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
            this.event = ''
        },
        setTask(){
                var eventBago = {
                    event: this.event,
                }
                if(this.event === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Event',
                    message: 'Update This Event?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Event').doc(this.eventID).set(eventBago)
                    this.$q.notify({
                            message: 'Event Updated!',
                            icon: 'mdi-update',
                            color: 'orange-8',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.event = ''
                        this.addEventDialog = false  
                }).onCancel(()=>{
                    this.addEventDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.eventID = task['.key']
            this.event = task.event
			this.addEventDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Event?',
                    message: 'Delete This Event?',
                    ok: 'Yes',
                    color: 'orange-8',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Event').doc(id).delete()
                    this.$q.notify({
                            message: 'Event Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addEvent () {
            var event = {
                event: this.event,
            }   
            let optionss = this.$lodash.filter(this.Event, m => {
                if(m.event === this.event){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.event === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addEventDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addEventDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Event',
                        message: 'Add This Event?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Event').add(event)
                            this.$q.notify({
                                    message: 'Event Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.event = ''
                            }).onCancel(()=>{
                                this.addEventDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>