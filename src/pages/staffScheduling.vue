<template>
    <q-page padding>
        <div>
            <q-stepper
                v-model="step"
                ref="stepper"
                color="orange-8"
                animated
                vertical=""
                done-color="green"
                active-color="orange-8"
                flat
                style="border-radius: 20px;"
            >
                <q-step
                    :name="1"
                    title="Select Event Reservations"
                    icon="event"
                    :done="step > 1"
                >
                    <div class="text-subtitle2 q-pa-md text-grey-10"><q-icon name="info" /> You can choose multiple reservations as long as it's the same date and doesn't conflict with the time of the first selected event reservations.</div>
                    <q-table grid :data="returnFilterReservation" :columns="columns" :filter="filter"  :pagination.sync="pagination" class="q-px-sm full-width align-center" :selected.sync="selectedReservations" row-key=".key" selection="multiple">
                    <template v-slot:item="props">
                        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                            <q-card :class="props.selected ?  'bg-orange text-white' : 'text-grey-10' " style="border-radius:20px">
                                <q-card-section>
                                    <div class="text-h6 row justify-between">
                                        <span>{{$moment(props.row.clientReserveDate).format('ll')}}</span>
                                        <q-checkbox v-model="props.selected" color="green" @input="consoleSelected"/>
                                    </div>
                                    <div class="text-subtitle2">{{props.row.clientStartTime}} - {{props.row.clientEndTime}}</div>
                                    <div class="text-subtitle2">{{props.row.clientPlace}}, {{props.row.clientCity}}</div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </template>
                    </q-table>
                </q-step>
                <q-step
                    :name="2"
                    title="Select Staff"
                    caption="Select a staff to assign to monitor the event."
                    icon="people"
                    :done="step > 2"
                >
                    <div class="q-mt-lg">
                        <span class="text-subtitle2 q-pl-md"><q-icon name="arrow_right" /> AVAILABLE STAFFS (No schedule for today)</span>
                        <q-table grid :data="returnNoToday" :columns="columns" :filter="filter"  :pagination.sync="pagination" class="q-px-sm full-width align-center" :selected.sync="selectedStaff" row-key=".key" selection="single">
                        <template v-slot:item="props">
                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                <q-card :class="props.selected ?  'bg-orange text-white' : 'text-grey-10' " style="border-radius:20px">
                                <q-card-section>
                                    <q-checkbox v-model="props.selected" color="green"/>{{props.row.position}} ({{props.row.email}})
                                </q-card-section>
                                </q-card>
                            </div>
                        </template>
                        </q-table>
                    </div>
                    <div>
                        <span class="text-subtitle2 q-pl-md"><q-icon name="arrow_right" /> WITH SCHEDULE
                        <span class="text-overline">(no conflicts with the selected schedule) </span> </span>
                        <q-table grid :data="returnWithToday" :columns="columns" :filter="filter"  :pagination.sync="pagination" class="q-px-sm full-width align-center" :selected.sync="selectedStaff" row-key=".key" selection="single">
                        <template v-slot:item="props">
                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                <q-card :class="props.selected ?  'bg-orange text-white' : 'text-grey-10' " style="border-radius:20px">
                                <q-card-section>
                                    <q-checkbox v-model="props.selected" color="green"/>{{props.row.position}} ({{props.row.email}})
                                </q-card-section>
                                </q-card>
                            </div>
                        </template>
                        </q-table>
                    </div>
                </q-step>
                <q-step
                    :name="3"
                    title="Review Staff Schedule"
                    icon="event_note"
                    :done="step > 3"
                >

                    <q-calendar
                        v-model="selectedDate"
                        view="day"
                        locale="en-us"
                        style="height: 85vh;"
                        class="calendar-container"
                        :column-header-before="true"
                        >
                        <template #column-header-before="days">
                            <div class="q-ma-xs text-primary text-overline">
                            </div>
                        </template>
                        <template #day-body="{ date, timeStartPos, timeDurationHeight }">
                            <template v-for="(event, index) in getEvents(date)">
                            <q-badge
                                :key="index"
                                class="my-event text-white"
                                :class="event.colorBg"
                                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
                            >
                            <div class="row q-gutter-xs relative-position full-width">
                            <div class="col-12 text-subtitle2">
                                <span>
                                    <q-icon name="person" /> {{ event.clientFName }} {{ event.clientLName}}
                                </span>
                                <br>
                                <span class="text-caption"><q-icon name="event_note" /> {{event.clientReserveDate}} ({{event.clientStartTime}} - {{event.clientEndTime}})</span>
                                <br>
                                <div class="text-caption"><q-icon name="star" /> {{event.clientEvent}} ({{event.clientEventType}})</div> 
                                <div class="text-caption"><q-icon name="location_on" /> {{event.clientPlace}}, {{event.clientCity}}</div>
                                
                            </div>
                            <q-chip class="bg-white absolute-right" size="md" label="PLOTTING NOW" v-show="returnPlottingNow(event)" removable @remove="removePlotting(event,index)">
                                <q-tooltip>
                                    Click <q-icon name="close" /> icon to remove the event from the schedule plotting.
                                </q-tooltip>
                            </q-chip>
                            </div>

                            </q-badge>
                            </template>
                        </template>

                    </q-calendar>
                </q-step>
                <template v-slot:navigation>
                    <q-stepper-navigation>
                        <q-btn @click="step === 3 ? confirmStaffSchedule() : $refs.stepper.next()" color="orange-8" :label="step === 3 ?'Finish' : 'Continue'" :disable="checkStep"/>
                        <q-btn v-if="step > 1" flat color="orange-8" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                    </q-stepper-navigation>
                </template>
            </q-stepper>
        </div>
    </q-page>
</template>
<script>
import { date } from 'quasar'
import { QCalendar } from '@quasar/quasar-ui-qcalendar'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

function luminosity (color) {
  if (typeof color !== 'string' && (!color || color.r === void 0)) {
    throw new TypeError('Expected a string or a {r, g, b} object as color')
  }

  const
    rgb = typeof color === 'string' ? textToRgb(color) : color,
    r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255,
    R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}
const reRGBA = /^\s*rgb(a)?\s*\((\s*(\d+)\s*,\s*?){2}(\d+)\s*,?\s*([01]?\.?\d*?)?\s*\)\s*$/

function textToRgb (color) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string')
  }

  const m = reRGBA.exec(color)
  if (m) {
    const rgb = {
      r: Math.min(255, parseInt(m[2], 10)),
      g: Math.min(255, parseInt(m[3], 10)),
      b: Math.min(255, parseInt(m[4], 10))
    }
    if (m[1]) {
      rgb.a = Math.min(1, parseFloat(m[5]))
    }
    return rgb
  }
  return hexToRgb(color)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  } else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  const num = parseInt(hex, 16)

  return hex.length > 6
    ? { r: num >> 24 & 255, g: num >> 16 & 255, b: num >> 8 & 255, a: Math.round((num & 255) / 2.55) }
    : { r: num >> 16, g: num >> 8 & 255, b: num & 255 }
}

export default {
    components: {
        QCalendar,
    },
    data () {
        return {
            selectedDate: '',
            step: 1,
            Reservation: [],
            DashboardUsers: [],
            StaffSchedules: [],
            selectedStaff: [],
            selectedReservations: [],
            filter: '',
            pagination: { sortBy: 'clientFname', descending: false, page: 1, rowsPerPage: 20},
            columns: [
                { name: 'clientFname', required: true, label: 'First Name', align: 'center', field: 'clientFname', sortable: true },
                { name: 'clientEvent', align: 'center', label: 'Event', field: 'clientEvent', sortable: true },
            ],
            colorCode:['bg-blue','bg-red','bg-pink','bg-orange','bg-green','bg-grey','bg-purple','bg-teal','bg-accent','bg-amber']
        }
    },
    mounted(){
        this.$binding('DashboardUsers', this.$firestoreApp.collection('DashboardUsers'))
        .then(DashboardUsers => {
        console.log(DashboardUsers, 'DashboardUsers')
        }),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
        .then(Reservation => {
        console.log(Reservation, 'Reservation')
        }),
        this.$binding('StaffSchedules', this.$firestoreApp.collection('StaffSchedules'))
        .then(StaffSchedules => {
        console.log(StaffSchedules, 'StaffSchedules')
        })
    },
    computed:{
        returnNoConflictSchedules(){
            try {
                let staffs = this.returnStaffs
                //get selected schedules

                let selected = this.selectedReservations    
                //get date of selected
                let datess = date.formatDate(this.selectedReservations[0].clientReserveDate,'YYYY-MM-DD')
                                
                //get staff schedules
                let schedules = []
                for(var x=0;x<this.StaffSchedules.length;x++){
                    let schedule = this.StaffSchedules[x]
                    if(date.formatDate(schedule.clientReserveDate,'YYYY-MM-DD') == datess)
                    {
                        schedules.push(schedule)
                    }
                }

                let map = staffs.map(a=>{
                    let data = {...a}
                    let filter = this.$lodash.filter(schedules,b=>{
                        return b.staffKey == data['.key']
                    })
                    data.events = filter
                    return data
                })
                console.log(schedules,'same date')
                console.log(map,'staffs ss')

                let conflict = this.$lodash.map(map,x=>{
                    let returnData = {...x}
                    let eventss = returnData.events
                    let conflictEvents = []
                    if(eventss.length > 0){
                        for(var q=0;q < eventss.length; q++){
                            let targetStart = this.convertTimeToDate(eventss[q].clientStartTime)
                            let targetEnd = this.convertTimeToDate(eventss[q].clientEndTime)
                            for(var w=0;w < selected.length; w++){
                                let baseStart = this.convertTimeToDate(selected[w].clientStartTime)
                                let baseEnd = this.convertTimeToDate(selected[w].clientEndTime)


                                let yesStart = false
                                let yesEnd = false
                                if(date.isBetweenDates(baseStart,targetStart,targetEnd, { inclusiveFrom: true })){
                                    console.log('start is between')
                                    yesStart = true
                                } 
                                
                                if (date.isBetweenDates(baseEnd,targetStart,targetEnd, { inclusiveTo: true })) {
                                    console.log('end is between')
                                    yesEnd = true
                                }          
                                
                                if(yesStart == true || yesEnd == true){
                                    conflictEvents.push(eventss[q])
                                }
                            }//inner loop end
                            returnData.conflictEvents = conflictEvents
                        }
                    } else {
                        returnData.conflictEvents = conflictEvents
                    }


                    return returnData
                })

                console.log(conflict,'conflict')
                let staffWithOutConflict = this.$lodash.filter(conflict,e=>{
                    return e.conflictEvents.length == 0
                })
                console.log(staffWithOutConflict,'staffWithOutConflict')
                //compare
                return staffWithOutConflict
            } catch (error) {
                return []
            }
        },
        returnNoToday(){
            try {
                return this.$lodash.filter(this.returnNoConflictSchedules,a=>{return a.events.length == 0})
            } catch (error) {
                return this.returnNoConflictSchedules
            }
        },
        returnWithToday(){
            try {
                return this.$lodash.filter(this.returnNoConflictSchedules,a=>{return a.events.length > 0})
            } catch (error) {
                return this.returnNoConflictSchedules
            }
        },
        returnStaffs(){
            try {
                return this.$lodash.filter(this.DashboardUsers, a=> {
                    return a.position.toLowerCase() == 'staff'
                })
            } catch (error) {
                return []
            }
        },
        returnNoScheduleYet(){
            try {
                let withSchedules = []
                for(var x=0;x<this.StaffSchedules.length;x++){
                    let key = this.StaffSchedules[x].reservationKey
                    let filter = this.$lodash.filter(this.Reservation,a=>{
                        if(key == a['.key']){
                            withSchedules.push(a)
                        }
                    })
                }

                let diff = this.$lodash.difference(this.Reservation,withSchedules)

                // console.log(withSchedules,'withSchedules')
                // console.log(diff,'remove with schedules')

                let order = this.$lodash.orderBy(diff,a=>{return date.formatDate(a.clientReserveDate,'YYYY-MM-DD')},'desc')
                console.log('order',order)

                let today = date.formatDate(new Date(),'YYYY-MM-DD')
                let removePassEvents = this.$lodash.filter(order,b=>{
                    return date.formatDate(b.clientReserveDate,'YYYY-MM-DD') > today
                })
                console.log('today',today)
                console.log(removePassEvents,'removepass')

                return removePassEvents
            } catch (error) {
                return this.Reservation
            }
        },
        returnFilterReservation(){
            try {
                let selected = this.selectedReservations

                if(selected.length > 0){
                    let dates = date.formatDate(selected[0].clientReserveDate,'YYYY-MM-DD')
                    let filter = this.$lodash.filter(this.returnNoScheduleYet,a=>{
                        return date.formatDate(a.clientReserveDate,'YYYY-MM-DD') == dates
                    })
                    return filter
                } else {
                    return this.returnNoScheduleYet
                }

            } catch (error) {
                return []
            }
        },
        returnStaffSchedules(){
            //new & old merge
            try {
                // new muna
                this.selectedDate = date.formatDate(this.selectedReservations[0].clientReserveDate,'YYYY-MM-DD')
                console.log('reservations',this.selectedReservations)
                let map = this.selectedReservations.map(a=>{
                    let data = {...a}
                    data.clientEventType = data.clientSelectPackage.event !== undefined ? data.clientSelectPackage.event : ''
                    return data
                })
                console.log('returnStaffSchedules',map)
                return map
            } catch (error) {
                return this.selectedReservations
            }
            
        },
        checkStep(){
            if(this.step === 1 && this.selectedReservations.length == 0){
                return true
            } else if (this.step === 2 && this.selectedStaff.length == 0){
                return true
            } else {
                console.log('false')
                return false
            }
        }
    },
    methods:{
        isCssColor (color) {
            return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
        },
        getEvents(dt){
        //   console.log('dt',dt)
          let ReserveDate = []
          let dateTarget = new Date(2020,0,1)
          let concat = this.$lodash.concat(this.returnStaffSchedules,this.selectedStaff[0].events)
          console.log(concat,'concat')
          for(let x=0; x < concat.length; x++){
            let add = concat[x]
            let dateFormat = date.formatDate(concat[x].clientReserveDate, 'YYYY-MM-DD')
            if(dateFormat == dt){  

                let start = add.clientStartTime.split(":")
                let startBase
                let startArr = start[1].split(" ")
                if(startArr[1] == 'PM'){
                    if(parseInt(start[0]) == 12){
                        startBase = start[0]
                    } else {
                        startBase = 12 + parseInt(start[0])
                    }
                } else {
                    startBase = parseInt(start[0])
                }

                let end = add.clientEndTime.split(":")
                let endBase
                let endArr = end[1].split(" ")
                // console.log(endArr,'endArr')
                if(endArr[1] == 'PM'){
                    if(parseInt(end[0]) == 12){
                        endBase = parseInt(end[0])
                    } else {
                        endBase = 12 + parseInt(end[0])
                    }
                   
                } else {
                    endBase = parseInt(end[0]) 
                } 

                let dateFrom = date.addToDate(dateTarget, { hours: startBase, minutes: parseInt(start[1])})
                let dateTo = date.addToDate(dateTarget, { hours: endBase, minutes: parseInt(end[1])})

                

                console.log(dateTo,'to')
                console.log(dateFrom,'from')

                let diff = date.getDateDiff(dateTo, dateFrom, 'minutes')
                console.log(diff,'diff')
                let random = Math.floor(Math.random() * 10); 
                add.colorBg = this.colorCode[random]
                add.duration = diff

                ReserveDate.push(add)
            }
            
          }
          console.log('ReserveDate',ReserveDate)
          return ReserveDate
        },
        //schedule
        badgeClasses (event, type) {
            
            const cssColor = this.isCssColor('#0000FF')
            const isHeader = type === 'header'
            // console.log('showerror')
            return {
                [`text-white bg-orange`]: !cssColor,
                'full-width': !isHeader && (!event.side || event.side === 'full'),
                'left-side': !isHeader && event.side === 'left',
                'right-side': !isHeader && event.side === 'right'
            }
        },

        badgeStyles (event, type, timeStartPos, timeDurationHeight) {
            
            const s = {}
            // if (this.isCssColor('#0000FF')) {
                
            //     s['background-color'] = '#0000FF'
            //     s.color = luminosity('#0000FF') > 0.5 ? 'black' : 'white'
            // }
            if (timeStartPos) {
                let rev = event.clientStartTime.split(":")
                let endBase
                let endArr = rev[1].split(" ")
                // console.log(endArr,'endArr')
                if(endArr[1] == 'PM'){
                    if(parseInt(rev[0]) == 12){
                        endBase = parseInt(rev[0])
                    } else {
                        endBase = 12 + parseInt(rev[0])
                    }
                    
                } else {
                    endBase = parseInt(rev[0]) 
                } 


                let datess = date.addToDate(new Date(2020,0,1), { hours: endBase, minutes: parseInt(rev[1])})
                s.top = timeStartPos(date.formatDate(datess,'HH:mm')) + 'px'
            }
            if (timeDurationHeight) {
                s.height = timeDurationHeight(event.duration) + 'px'
            }
            s['align-items'] = 'flex-center'
            // console.log(s,'s')
            return s
        },
        consoleSelected(){
            console.log(this.selectedReservations) 
            let index = this.selectedReservations.length - 1
            let latest = this.selectedReservations[index]
            let dateTarget = new Date(2020,0,1)
            let startLatest = latest.clientStartTime.split(":")
            let endLatest = latest.clientEndTime.split(":")

            let sBase
            let startArrLatest = startLatest[1].split(" ")
            if(startArrLatest[1] == 'PM'){
                if(parseInt(startLatest[0]) == 12){
                    sBase = parseInt(startLatest[0])
                } else {
                    sBase = 12 + parseInt(startLatest[0])
                }
            } else {
                sBase = startLatest[0] 
            }            
            let eBase
            let endArrLatest = endLatest[1].split(" ")
            if(endArrLatest[1] == 'PM'){
                if(parseInt(endLatest[0]) == 12){
                    eBase = parseInt(endLatest[0])
                } else {
                    eBase = 12 + endLatest[0]
                }
            } else {
                eBase = endLatest[0] 
            }           

            let dateTargetStart = date.addToDate(dateTarget, { hours: sBase, minutes: parseInt(startLatest[1])})
            let dateTargetEnd = date.addToDate(dateTarget, { hours: eBase, minutes: parseInt(endLatest[1])})

            if(this.selectedReservations.length > 1){
                for(let x = 0;x<this.selectedReservations.length-1;x++){
                    let rev = this.selectedReservations[x]

                    let dateFrom = new Date(2020,0,1)
                    let dateTo = new Date(2020,0,1)

                    let start = rev.clientStartTime.split(":")
                    let startBase
                    let startArr = start[1].split(" ")
                    if(startArr[1] == 'PM'){
                        if(parseInt(start[0]) == 12){
                            startBase = parseInt(start[0])
                        } else {
                            startBase = 12 + parseInt(start[0])
                        }
                        
                    } else {
                        startBase = start[0] 
                    }


                    let end = rev.clientEndTime.split(":")
                    let endBase
                    let endArr = end[1].split(" ")
                    if(endArr[1] == 'PM'){
                        if(parseInt(end[0]) == 12){
                            endBase = parseInt(start[0])
                        } else {
                            endBase = 12 + parseInt(end[0])
                        }
                        
                    } else {
                        endBase = parseInt(end[0])
                    }

                    dateFrom = date.addToDate(dateFrom, { hours: startBase, minutes: parseInt(start[1])})
                    dateTo = date.addToDate(dateTo, { hours: endBase, minutes: parseInt(end[1])})

                    let yesStart = false
                    let yesEnd = false
                    if(date.isBetweenDates(dateTargetStart,dateFrom,dateTo, { inclusiveFrom: true })){
                        console.log('start is between')
                        yesStart = true
                    } 
                    
                    if (date.isBetweenDates(dateTargetEnd,dateFrom,dateTo, { inclusiveTo: true })) {
                        console.log('end is between')
                        yesEnd = true
                    }

                    if(yesStart == true || yesEnd == true){
                        this.$q.dialog({
                            title: 'Selected Event Reservation Conflict',
                            message: 'Removing Last Selected Event Reservation',
                            ok: 'Ok',
                            persistent: true
                            }).onOk(() => {
                                this.selectedReservations.splice(index,1)
                            })
                            break
                    }
                }
            }

        },
        convertTimeToDate(time){
            let dateFrom = new Date(2020,0,1)
            let start = time.split(":")
            let startBase
            let startArr = start[1].split(" ")
            if(startArr[1] == 'PM'){
                if(parseInt(start[0]) == 12){
                    startBase = start[0]
                } else {
                    startBase = 12 + parseInt(start[0])
                }
                
            } else {
                startBase = parseInt(start[0])
            }    

            dateFrom = date.addToDate(dateFrom, { hours: startBase, minutes: parseInt(start[1])})
            return dateFrom
        },
        saveStaffSchedule(reservations){
            let data = {
                clientFName: reservations.clientFName,
                clientLName: reservations.clientLName,
                clientReserveDate: reservations.clientReserveDate,
                clientStartTime: reservations.clientStartTime,
                clientEndTime: reservations.clientEndTime,
                clientEvent: reservations.clientEvent,
                clientEventType: reservations.clientSelectPackage.event !== undefined ? reservations.clientSelectPackage.event : '',
                clientPlace: reservations.clientPlace,
                clientCity: reservations.clientCity,
                reservationKey: reservations['.key'],
                staffKey: this.selectedStaff[0]['.key']
            }
            console.log('saveStaffSchedule',data)

            this.$firestoreApp.collection('StaffSchedules').add(data)
            .then(()=>{
                console.log('done')
            })
            .catch(()=>{
                console.log('error')
            })
        },
        confirmStaffSchedule(){
            this.$q.dialog({
                title: 'Save Staff Schedules ?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                let reservations = this.selectedReservations
                for(var x = 0;x < reservations.length; x++){
                    this.saveStaffSchedule(reservations[x])
                }
                this.$q.notify({
                    message: 'Save Schedules!',
                    icon: 'mdi-update',
                    color: 'orange-8',
                    textColor: 'white',
                    position: 'center'
                })
                this.selectedReservations = []
                this.selectedStaff = []
                this.step = 1
            })
        },
        returnPlottingNow(event){
            let data = {...event}
            if(this.$lodash.findIndex(this.selectedReservations,a=>{return a['.key'] == data['.key']}) > -1){
                console.log('TRUE')
                return true
            } else {
                console.log('FALSE')
                return false
            }
        },
        removePlotting(event,index){
            console.log(event,'to be removed')
            console.log(index)
            if(this.selectedReservations.length == 1){
                this.$q.dialog({
                    title: 'Remove Last Selected Schedule ?',
                    message: 'This will reset the scheduling process.',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.selectedReservations.splice(index,1)
                    this.step = 1
                    this.selectedStaff = []
                })                
            } else {
                this.$q.dialog({
                    title: 'Remove Schedule ?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.selectedReservations.splice(index,1)
                })
            }
        },

    }    
}
</script>
<style src="@quasar/quasar-ui-qcalendar/dist/index.css"></style>
<style lang="sass">
  // this page
  .calendar-container
    position: relative

  .my-event
    width: 100%
    position: absolute
    font-size: 12px

  </style>