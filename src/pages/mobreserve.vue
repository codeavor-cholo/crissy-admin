<template>
    <q-page class="q-pt-md q-pa-md">
        <div class="text-right">
            <q-btn dense style="width:100px" color="orange-7" label="Payment" @click="payment = true" />
        </div>
        <div class="q-pt-sm text-weight-bold" style="font-size:25px">    
            <i>Event Name</i>
        </div>
        <div class="column q-pt-sm q-gutter-sm">
            <div class="text-weight-bold">Name of Customer:</div>
            <div class="text-weight-bold">Email Address:</div>
            <div class="text-weight-bold">Date of Event:</div>
            <div class="text-weight-bold">Time Start:</div> 
            <div class="text-weight-bold">Time End: </div>
            <div class="text-weight-bold">Event Place:</div>
            <div class="text-weight-bold">Pax:</div>
            <div class="text-weight-bold">Balance Payment:</div>    
            <div class="text-weight-bold">Motif: </div>
            <div class="text-weight-bold">Theme: </div>
            <div class="text-weight-bold">Package Name: </div>
        </div>
                <div class="q-pt-sm text-weight-bold">
                    Foods: 
                </div>
                <q-list>
                        <q-item>
                            <q-item-section>
                            <div class="text-center">
                                <q-item-label class="text-weight-bold">Food Name</q-item-label>
                            </div>
                            <div class="row items-center justify-around">
                                <div>
                                    <q-item-label caption>(Food Category)</q-item-label>
                                </div>
                                <img src="statics/bg/wallpaper.jpg" style="width:50px;height:45px">
                            </div>
                            </q-item-section>
                        </q-item>
                         <q-item>
                            <q-item-section>
                            <div class="text-center">
                                <q-item-label class="text-weight-bold">Food Name</q-item-label>
                            </div>
                            <div class="row items-center justify-around">
                                <div>
                                    <q-item-label caption>(Food Category)</q-item-label>
                                </div>
                                <img src="statics/bg/wallpaper.jpg" style="width:50px;height:45px">
                            </div>
                            </q-item-section>
                        </q-item>
                         <q-item>
                            <q-item-section>
                            <div class="text-center">
                                <q-item-label class="text-weight-bold">Food Name</q-item-label>
                            </div>
                            <div class="row items-center justify-around">
                                <div>
                                    <q-item-label caption>(Food Category)</q-item-label>
                                </div>
                                <img src="statics/bg/wallpaper.jpg" style="width:50px;height:45px">
                            </div>
                            </q-item-section>
                        </q-item>
                         <q-item>
                            <q-item-section>
                            <div class="text-center">
                                <q-item-label class="text-weight-bold">Food Name</q-item-label>
                            </div>
                            <div class="row items-center justify-around">
                                <div>
                                    <q-item-label caption>(Food Category)</q-item-label>
                                </div>
                                <img src="statics/bg/wallpaper.jpg" style="width:50px;height:45px">
                            </div>
                            </q-item-section>
                        </q-item>
                </q-list>
                <div class="row q-gutter-sm">
                    <div class="text-weight-bold q-pt-md">
                        Add Ons: 
                    </div>
                    <q-list>
                        <q-item>
                            <q-item-section>* Item</q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>* Item</q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>* Item</q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div class="row">
                    <div class="text-weight-bold q-pt-md">
                        Inclusions: 
                    </div>
                    <q-list>
                        <q-item>
                            <q-item-section>* Item</q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>* Item</q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>* Item</q-item-section>
                        </q-item>
                    </q-list>
                </div>


<!-- PAYMENT DIALOG -->
        <q-dialog v-model="payment" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Payment</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Add address" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
<!-- END OF PAYMENT -->
    </q-page>
</template>

<script>
export default {
  data () {
    return {
      payment: false,
    }
  }
}
</script>
