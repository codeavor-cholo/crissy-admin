<template>
    <q-page padding>
        <q-table grid :data="Category" :columns="columns" :filter="filter" class="q-px-sm full-width align-center ">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="my-card" style="border: 2px solid;border-color: purple;" >
                                            <q-list>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label overline> {{props.row.category}} <b>{{props.row.price}}php</b></q-item-label>
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
            <q-btn label="Add New Category" icon="add" color="accent" @click="addCategoryDialog = true, isEdit = false" />
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
                    <q-input class="q-ma-sm" outlined color="purple" v-model="category" label="Category"/>
                    <q-input type="number" class="q-ma-sm" outlined color="purple" v-model="price" label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat style="color: #010A43" label="Cancel" @click="clear" v-close-popup/>
                    <q-btn v-if="!isEdit" flat color="purple" label="Add Category" v-close-popup @click="addCategory"/>
                    <q-btn v-if="isEdit" flat label="Update Category" style="color: #FFC2C2" v-close-popup v-on:click="setTask"/>
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
            ]
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
                                    color: 'purple',
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