<template>
    <q-page>
        <div>
        <div class="text-h6 q-pt-md q-px-md">UPCOMING SCHEDULES</div>
        <q-list bordered separator class="bg-white q-ma-md " style="border-radius: 10px">
        <div v-for="(base,i) in returnStaffScheduleInOrder" :key="i">
        <q-item-label header class="text-center">{{$moment(base.dateBase).format('LL')}}</q-item-label>
        <q-separator inset=""  />
            <q-item class="q-py-md q-mb-md" v-for="(sched,j) in returnStaffScheduleInOrder[i].events" :key="j">
                    <q-item-section>
                        <div class="row justify-between q-mb-md">
                            <div style="font-size:19px" class=""><b>{{sched.clientEvent}}</b>
                                <div class="text-caption">{{sched.clientEventType}}</div>
                            </div>
                            <div>
                                <q-btn flat size="lg" color="grey-7" @click="view = true,selectedEvent = sched" icon="info" />
                            </div>
                        </div>

                        <div style="font-size:16px"><b>Name: </b>{{sched.clientFName}} {{sched.clientLName}}</div>
                        <div style="font-size:16px"><b>Where: </b>{{sched.clientPlace}}, {{sched.clientCity}}</div>
                        <div class="row">
                            <div class="col" style="font-size:16px"><b>From: </b>{{sched.clientStartTime}}</div>
                            <div class="col" style="font-size:16px"><b>To: </b>{{sched.clientEndTime}}</div>
                        </div>
                        <div>
                            <q-btn dense class="full-width q-mb-md" color="orange-7" label="view Reservation Details" @click="$router.push('/mobreserve/'+sched.reservationKey)" outline=""/>
                            <q-btn class="full-width" color="orange-7" @click="updateStatus(sched)" v-if="returnSelectedEventStatus(sched).length < StatusArr.length">Update Status <div class="full-width text-caption text-capitalize">Next: {{returnNextStatus(sched)}}</div></q-btn>
                            <q-btn class="full-width" color="green" v-else disable=""><q-icon name="check" class="q-mr-md" /> Event Venue is Ready !</q-btn>
                        </div>
                    </q-item-section>           
            </q-item>
        </div>
        </q-list>
        <br>
        </div>
        <!-- -->
        <!-- VIEWING OF CATERING STATUS -->
            <q-dialog v-model="view">
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6 text-center">Status</div>
                <q-timeline color="orange-7" v-if="returnReversed.length > 0">
                    <div class="q-px-md">

                    <q-timeline-entry v-for="(status,i) in returnReversed"
                        :key="i"
                        :title="status.status" 
                        :subtitle="$moment(status.dateTime).format('LT')"   
                    >
                    </q-timeline-entry>

                    </div>
                </q-timeline>
                <div v-else class="text-center q-pt-md"> No Status Updates Yet </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" color="orange-7" v-close-popup @click="view = false"/>
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
import { date } from 'quasar'
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
      StaffSchedules: [],
      DashboardUsers: [],
      accountLoggedIn: null,
      EventStatus: [],
      selectedEvent: null,
      StatusArr: ['Food is being prepared!','Catering personnel is on the way to the venue!','Arrived at the venue. Preparing Setup!','The venue is ready! Enjoy!'] 
    }
  },
    created() {
        let self = this
        this.$firebase.auth().onAuthStateChanged(function(user) {
            
            if (user) {
            let gg = {...user}
            console.log('createdUser',user)
            console.log('createdUser',user.uid)
            let username = gg.email.toString().split('@')
            // self.userEmail = username[0]
            self.accountLoggedIn = gg

            } else {
                // self.$router.push('/')
            }
        })
    },
  mounted(){
        this.$binding('StaffSchedules', this.$firestoreApp.collection('StaffSchedules'))
        .then(StaffSchedules => {
        console.log(StaffSchedules, 'StaffSchedules')
        }),
         this.$binding('EventStatus', this.$firestoreApp.collection('EventStatus'))
        .then(EventStatus => {
        console.log(EventStatus, 'EventStatus')
        }),
        this.$binding('DashboardUsers', this.$firestoreApp.collection('DashboardUsers'))
        .then(DashboardUsers => {
        console.log(DashboardUsers, 'DashboardUsers')
        })      
  },
  computed:{
      returnStaffScheduleInOrder(){
          try {
              let today = date.formatDate(new Date(), 'YYYY/MM/DD')
              let filter = this.$lodash.filter(this.StaffSchedules,a=>{
                let dates = date.formatDate(a.clientReserveDate, 'YYYY/MM/DD')
                let dateArr = dates.split('/')
                let start = a.clientStartTime.split(':')
                let base

                let AMPM = start[1].split(' ')
                console.log(start[0]+' '+AMPM[1])
                
                if(AMPM[1] == 'PM' && parseInt(start[0]) !== 12){
                    base = parseInt(start[0]) + 12
                } else {
                    base = parseInt(start[0])
                }

                let create = date.buildDate({ year:dateArr[0], month:dateArr[1], date:dateArr[2], hours:base, minutes: parseInt(start[1]), seconds: 0})
                console.log(create,'createDate') 

                a.dateBasis = create

                return a.staffKey == this.accountLoggedIn.uid || this.returnUserPosition(this.accountLoggedIn.uid) == 'Admin' && dates >= today
              })
              console.log(filter,'filter')

              let order = this.$lodash.orderBy(filter,'dateBasis','asc')
              console.log(order,'order')

                let group = this.$lodash.groupBy(order,'clientReserveDate')
                console.log(group,'group')

                let map = this.$lodash.map(group,function(value,key){
                    return {
                        dateBase: key,
                        events: value
                    }
                })

                console.log(map,'map')

              return map
          } catch (error) {
              return []
          }
      },
      returnReversed(){
          try {
            let event = this.selectedEvent
            return this.$lodash.orderBy(this.returnSelectedEventStatus(event),'dateTime','asc')             
          } catch (error) {
              return []
          }
      }

  },
  methods:{
      returnUserPosition(uid){
          try {
              return this.DashboardUsers.filter(a=>{
                  return a['.key'] == uid
              })[0].position
          } catch (error) {
              return 'Admin'
          }
      },
      returnSelectedEventStatus(event){
          try {
              console.log('returnSelectedEventStatus',this.$lodash.filter(this.EventStatus,a=>{return a.scheduleKey == event['.key']}))
             return this.$lodash.filter(this.EventStatus,a=>{return a.scheduleKey == event['.key']})
          } catch (error) {
              return []
          }
         
      },
      returnNextStatus(event){
          try {
            let length = this.returnSelectedEventStatus(event).length
            return this.StatusArr[length]        
          } catch (error) {
            return this.StatusArr[0]
          } 
      },
      updateStatus(event){
        this.$q.dialog({
            title: 'Update Event Status to "'+this.StatusArr[this.returnSelectedEventStatus(event).length]+'" ?',
            message:'This action cannot be undone.',
            ok: 'YES',
            cancel: 'NO',
            persistent: true
        }).onOk(() => {    
            console.log(event,'selectedEvent')
            let payload = {
                reservationKey: event.reservationKey,
                scheduleKey: event['.key'],
                status: this.StatusArr[this.returnSelectedEventStatus(event).length],
                dateTime: new Date().toString()
            }
            console.log(payload,'payload')
            this.$firestoreApp.collection('EventStatus').add(payload)
                .then(()=>{
                    console.log('done')
                })
                .catch(()=>{
                    console.log('error')
                })

            this.$q.notify('STATUS UPDATED = '+payload.status)
        }).onCancel(() =>{
        })
      }
  }

}
</script>