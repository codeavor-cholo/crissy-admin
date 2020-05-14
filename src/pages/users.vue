<template>
    <q-page padding>
        <div class="row justify-between q-pt-md">
            <div class="q-pl-md">
                <q-btn label="Add New User" icon="add" color="orange-8" @click="addUserDialog = true, isEdit = false">
                    <q-tooltip>
                        Add User
                    </q-tooltip>
                </q-btn>    
            </div>
            <div class="q-pr-xl">    
                <q-input dense v-model="filter" clearable type="text" label="Search User" color="orange-6" class="bg-white" outlined icon="search">
                    <template v-slot:prepend>
                        <q-icon name="search" color="orange-6"/>
                    </template>
                </q-input>
            </div>
        </div>
        <div class="q-pt-md">
        <q-table grid :data="DashboardUsers" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm"  style="border-radius:20px">
                                            <q-list>
                                                <q-item>
                                                    <q-item-section class="">
                                                        <q-item-label style="font-size:17px"><b>{{props.row.email}}</b></q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item>
                                                    <q-item-section class="text-caption">
                                                        <q-item-label >Position</q-item-label>                                                    
                                                    </q-item-section>
                                                    <q-item-section class="text-caption" side>
                                                        <q-item-label>{{props.row.position}}</q-item-label>   
                                                    </q-item-section>
                                                </q-item>
                                                <!-- <q-item>
                                                    <q-item-section class="text-caption">
                                                        <q-item-label >Permissions</q-item-label>                                                    
                                                    </q-item-section>
                                                    <q-item-section class="text-caption" side>
                                                        <q-item-label v-for="per in props.row.permissions" :key="per">{{per}}</q-item-label>   
                                                    </q-item-section>
                                                </q-item> -->
                                            </q-list>
                                            <q-separator inset />
                                            <q-card-actions class="row justify-between">
                                                <q-btn flat dense label="edit" color="green" icon="mdi-pencil" @click="getedit(props.row)" disabled>
                                                    <q-tooltip>
                                                        Edit
                                                    </q-tooltip>
                                                </q-btn>
                                                <q-btn flat icon="delete" label="delete" dense style="color: #010A43" @click="deletedialog(props.row)" disabled>
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
        <q-dialog v-model="addUserDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit User': 'Add New User'}}</div>
                </q-card-section>

                <q-card-section>
                    <div class="q-gutter-md">
                        <q-select v-model="newUser.position" :options="positionOpt" label="Select Position" color="orange" outlined="" emit-value="" map-options=""/>
                        <q-input v-model="newUser.email" type="email" label="Email Address" color="orange" outlined=""/>
                        <q-input v-model="newUser.password" type="password" label="Password" color="orange" outlined=""/>
                        <q-input v-model="newUser.confirmPassword" type="password" label="Confirm Password" color="orange" outlined=""/>
                        <!-- <div>
                        <span class="text-weight-bold">PERMISSIONS</span>
                        <q-option-group
                            v-model="newUser.permissions"
                            type="checkbox"
                            color="orange"
                            inline=""
                            :options="permissionOpt"
                        />
                        </div> -->
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Save User" v-close-popup @click="addNewUser"/>
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
            }),
        this.$binding('DashboardUsers', this.$firestoreApp.collection('DashboardUsers').where('position','>=','Secretary').where('position','<=','Staff'))
            .then(DashboardUsers => {
            console.log(DashboardUsers, 'DashboardUsers')
            })
    },
    data () {
        return {
            isEdit: false,
            addUserDialog: false,
            editDialog: false,
            newUser: {
                position: '',
                email: '',
                password: '',
                confirmPassword: '',
                permissions: []
            },
            filter: '',
            Position: [],
            DashboardUsers: [],
            filter: '',
            columns: [
                    { name: 'position', required: true, label: 'Position', align: 'left', field: 'position', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    computed: {
        permissionOpt(){
            try {
                let arr = ['walkin','reservations','status','file maintanance','users']
                return arr.map(a=>{
                    return {
                        label: a.toUpperCase(),
                        value: a
                    }
                })             
            } catch (error) {
                return []
            }
        },
        positionOpt(){
            try {
                let map = this.Position.map(a=>{
                        return {
                            label: a.position,
                            value: a.position
                        }
                })
                return map.filter(b=>{return b.value !== 'Admin'})
            } catch (error) {
                return []
            }
        }
    },
    methods: {
        clear(){
            this.newUser = {
                position: '',
                email: '',
                password: '',
                confirmPassword: '',
                permissions: []
            }
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
                        this.addUserDialog = false  
                }).onCancel(()=>{
                    this.addUserDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.positionID = task['.key']
            this.position = task.position
			this.addUserDialog = true
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
        addNewUser () {
                let user = this.newUser
                let optionss = this.$lodash.filter(this.DashboardUsers, m => {
                    if(m.email === user.email){
                        return m
                    }
                })   
                console.log(optionss, 'option')
                 
                if(user.position == '' || user.email == '' || user.password == '' || user.confirmPassword == '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addUserDialog = true
                })
                }else{
                    if(optionss.length > 0){
                        this.$q.dialog({
                        title: 'Duplicate Entry!',
                        message: 'Unable to save?',
                        ok: 'Ok',
                        persistent: true
                            }).onOk(() => {
                                this.addUserDialog = true
                            })
                    } else if (user.password !== user.confirmPassword){
                        this.$q.dialog({
                        title: 'Password does not match!',
                        message: 'Re-enter your password.',
                        ok: 'Ok',
                        persistent: true
                            }).onOk(() => {
                                this.addUserDialog = true
                            })                        
                    } else{
                        this.$q.dialog({
                        title: 'Save User',
                        message: 'Save This User?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$auth.createUserWithEmailAndPassword(user.email, user.password)
                                .then((res)=> {
                                    delete user.password
                                    delete user.confirmPassword
                                    console.log(user,'finalSaveDatabase')
                                    this.$firestoreApp.collection('DashboardUsers').doc(res.user.uid).set(user)
                                    this.$q.notify({
                                            message: 'New User Added!',
                                            icon: 'mdi-folder-plus-outline',
                                            color: 'orange-8',
                                            textColor: 'white',
                                            position: 'center'
                                    })
                                        this.clear()
                                        this.addUserDialog = false
                                })
                            }).onCancel(()=>{
                                this.addUserDialog = true
                            })
                    }
                }
            }
            
    }
}
</script>