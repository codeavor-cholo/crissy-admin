<template>
    <q-page padding>
        <q-table grid :data="Category" :columns="columns" :filter="filter" class="q-px-sm full-width align-center " :pagination.sync="pagination"> 
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card q-pa-sm" style="border-radius:20px" >
                                            <q-list>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label class="text-h6"> {{props.row.category}} <b class="float-right text-orange-8">{{props.row.price}}php</b></q-item-label>
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
            <q-btn label="Add New Category" icon="add" color="orange-8" @click="addCategoryDialog = true, isEdit = false" />
                <q-tooltip>
                    Add Category
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addCategoryDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{isEdit ? 'Edit Category': 'Add New Category'}}</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" outlined color="orange-8" v-model="category" label="Category"/>
                    <q-input type="number" class="q-ma-sm" outlined color="orange-8" v-model="price" label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="orange-8" label="Add Category" v-close-popup @click="addCategory"/>
                    <q-btn v-if="isEdit" flat label="Update Category" color="orange-8" v-close-popup v-on:click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
        this.$binding('Category', this.$firestoreApp.collection('Category'))
            .then(Category => {
            console.log(Category, 'Category')
            })
    },
    data () {
        return {
            isEdit: false,
            addCategoryDialog: false,
            editDialog: false,
            category: '',
            price: 0,
            Category: [],
            filter: '',
            columns: [
                    { name: 'category', required: true, label: 'Category', align: 'left', field: 'category', sortable: true },
                    { name: 'price', required: true, label: 'Price', align: 'left', field: 'price', sortable: true },
                    { name: 'action', label: 'Action' }
            ],
            pagination: {
                sortBy: 'desc',
                descending: false,
                page: 1,
                rowsPerPage: 21
                // rowsNumber: xx if getting data from a server
            },
        }
    },
    methods: {
        clear(){
            this.category = ''
            this.price = 0
        },
        setTask(){
                var categoryBago = {
                    category: this.category,
                    price: this.price
                }
                if(this.category === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Category',
                    message: 'Update This Category?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Category').doc(this.categoryID).set(categoryBago)
                    this.$q.notify({
                            message: 'Category Updated!',
                            icon: 'mdi-update',
                            color: '#FFC2C2',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.category = ''
                        this.addCategoryDialog = false  
                }).onCancel(()=>{
                    this.addCategoryDialog = true
                })  
            },
        getedit (task) {
            console.log(task, 'task')
            this.categoryID = task['.key']
            this.category = task.category
            this.price = task.price
			this.addCategoryDialog = true
			this.isEdit = true
		    },
        deletedialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Category?',
                    message: 'Delete This Category?',
                    ok: 'Yes',
                    color: 'orange-8',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Category').doc(id).delete()
                    this.$q.notify({
                            message: 'Category Deleted!',
                            icon: 'mdi-delete',
                            color: '#010A43',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
        addCategory () {
            var category = {
                category: this.category,
                price: this.price
            }   
            let optionss = this.$lodash.filter(this.Category, m => {
                if(m.category === this.category){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.category === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addCategoryDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addCategoryDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Category',
                        message: 'Add This Category?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Category').add(category)
                            this.$q.notify({
                                    message: 'Category Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'orange-8',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.category = ''
                            }).onCancel(()=>{
                                this.addCategoryDialog = true
                            })
                    }
                }
            },
            
    }
}
</script>