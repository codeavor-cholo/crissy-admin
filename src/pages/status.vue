<template>
    <q-page>
        <q-list bordered separator>
            <q-item class="q-py-md">
                    <q-item-section>
                        <div class="row items-center">
                        <div class="col">
                            <q-chip color="orange-7" text-color="white" icon="event">
                                2020-20-2
                            </q-chip>
                        </div>
                        <div>
                            <q-btn flat size="xl" color="grey-7" @click="view = true" icon="info" />
                        </div>
                        </div>
                        <div style="font-size:19px" class="text-center"><b>Event Name</b></div>
                        <div style="font-size:16px"><b>Name: </b></div>
                        <div style="font-size:16px"><b>Where: </b></div>
                        <div class="row">
                            <div class="col" style="font-size:16px"><b>From: </b></div>
                            <div class="col" style="font-size:16px"><b>To: </b></div>
                        </div>
                        <div class="q-pt-sm">
                            <q-btn dense class="full-width" @click="upd = true" color="orange-7" label="Update Status" />
                        </div>
                    </q-item-section>           
            </q-item>
        </q-list>


        <!-- VIEWING OF CATERING STATUS -->
            <q-dialog v-model="view" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6 text-center">Status</div>
                <q-timeline color="orange-7">
                    <div class="q-pl-md">
                    <q-timeline-entry
                        title="Your Event is Today!" 
                        subtitle="10:00am"   
                    >
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Food is being prepared!" 
                        subtitle="10:30am"   
                    >
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Catering personnel is on the way to the venue!"
                        subtitle="11:30am"    
                    >
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Catering personnel is on the venue!"
                        subtitle="12:00pm"    
                    >
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Preparing Setup!"
                        subtitle="12:30pm"    
                    >
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="Setup complete!"
                        subtitle="12:30pm"    
                    >
                    </q-timeline-entry>

                    <q-timeline-entry
                        title="The venue is ready! Enjoy!"
                        subtitle="12:30pm"    
                    >
                    </q-timeline-entry>
                    </div>
                </q-timeline>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" color="orange-7" v-close-popup />
                </q-card-actions>
            </q-card>
            </q-dialog>
<!-- END OF VIEWING OF CATERING STATUS -->

<!-- UPDATE CATERING STATUS -->
            <q-dialog v-model="upd" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6 text-center">Update Event Status</div>
                </q-card-section>

                <q-card-section class="column">
                    <q-checkbox v-model="today" color="orange-7" label="Your Event is Today!" />
                    <q-checkbox v-model="prep_food" color="orange-7" label="Food is being prepared!" />
                    <q-checkbox v-model="route" color="orange-7" label="Catering personnel is on the way to the venue!" />
                    <q-checkbox v-model="area" color="orange-7" label="Catering personnel is on the venue!" />
                    <q-checkbox v-model="process" color="orange-7" label="Preparing Setup!" />
                    <q-checkbox v-model="done" color="orange-7" label="Setup complete!" />
                    <q-checkbox v-model="ready" color="orange-7" label="The venue is ready! Enjoy!" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" color="orange-7" v-close-popup />
                <q-btn flat label="Update" color="orange-7" v-close-popup />
                </q-card-actions>
            </q-card>
            </q-dialog>
<!-- END OF UPDATE CATERING STATUS -->
    </q-page>
</template>


<script>
export default {
  data () {
    return {
      tab: 'catering',
      view: false,
      upd: false,
      view_tray: false,
      update_tray: false,
      today: false,
      prep_food: false,
      prep_set: false,
      route: false,
      area: false,
      process: false,
      done: false, 
      ready: false,
    }
  }
}
</script>