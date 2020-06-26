<template>
    <q-page id="page" class="q-pb-md">
        <div id="noti" class="text-weight-bold">
            New Notifications
        </div>
        <div id="list">
            <q-list separator>
                <div v-for="(notif,i) in returnUserNotifications" :key="notif['.key']+i">
                <q-item clickable v-ripple v-if="notif.typeOf == 'reserve'">
                    <q-item-section>
                        <div id="newreserve" class="text-weight-medium">New Reservation Created</div>
                        <div class="column q-py-sm">
                            <q-item-label class="text-orange-8" caption>{{notif.clientName}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientReserveDate}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientStartTime}} - {{notif.clientEndTime}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientPlace}}, {{notif.clientCity}}</q-item-label> 
                        </div>
                        <q-item-label class="text-teal text-overline text-right">{{$moment(notif.dateTime).fromNow()}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple v-if="notif.typeOf == 'resched'">
                    <q-item-section>
                        <div id="newreserve" class="text-weight-medium">Reschedule Event Application</div>
                        <div class="column q-py-sm">
                            <q-item-label class="text-orange-8" caption>{{notif.clientName}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientReserveDate}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientStartTime}} - {{notif.clientEndTime}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientPlace}}, {{notif.clientCity}}</q-item-label> 
                        </div>
                        <q-item-label class="text-teal text-overline text-right">{{$moment(notif.dateTime).fromNow()}}</q-item-label>
                    </q-item-section>
                </q-item>

                <!-- <q-item clickable v-ripple v-else-if="notif.typeOf == 'order'">
                    <q-item-section>
                        <div id="newreserve" class="text-weight-medium">We have new Party Tray Order.</div>
                        <div class="column q-py-sm">
                            <q-item-label class="text-orange-8" caption>{{notif.clientName}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.deliveryDate}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.deliveryTime}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientAddress}}, {{notif.city}}</q-item-label> 
                        </div>
                        <q-item-label class="text-teal text-overline text-right">{{$moment(notif.dateTime).fromNow()}}</q-item-label>
                    </q-item-section>
                </q-item> -->

                <q-item clickable v-ripple v-else-if="notif.typeOf == 'schedule'">
                    <q-item-section>
                        <div id="newreserve" class="text-weight-medium" v-if="returnUserPosition() == 'Admin'">New Staff Schedule Created</div>
                        <div id="newreserve" class="text-weight-medium" v-else>You have new Schedule.</div>
                        <div class="column q-py-sm">
                            <q-item-label class="text-orange-8" caption>{{notif.type}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientName}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientReserveDate}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientStartTime}} - {{notif.clientEndTime}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.clientPlace}}, {{notif.clientCity}}</q-item-label> 
                        </div>
                        <q-item-label class="text-teal text-overline text-right">{{$moment(notif.dateTime).fromNow()}}</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple v-else-if="notif.typeOf == 'payment'">
                    <q-item-section>
                        <div id="newreserve" class="text-weight-medium">New Payment Recieved</div>
                        <div class="column q-py-sm">
                            <q-item-label class="text-orange-8" caption>{{notif.clientName}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>₱ {{formatNumber(notif.amount)}}.00</q-item-label>
                        </div>
                        <q-item-label class="text-teal text-overline text-right">{{$moment(notif.dateTime).fromNow()}}</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple v-else-if="notif.typeOf == 'status'">
                    <q-item-section>
                        <div id="newreserve" class="text-weight-medium">New Event Status Update.</div>
                        <div class="column q-py-sm">
                            <q-item-label class="text-orange-8" caption>{{notif.clientName}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.transactionType}}</q-item-label>
                            <q-item-label class="text-orange-8" caption>{{notif.status}}</q-item-label>
                        </div>
                        <q-item-label class="text-teal text-overline text-right">{{$moment(notif.dateTime).fromNow()}}</q-item-label>
                    </q-item-section>
                </q-item>
                </div>
            </q-list>
        </div>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            DashboardUsers: [],
            AdminNotifications: [],
            Reservation: [],
            partyTrayOrders: [],
            Payments: [],
            StaffSchedules: [],
            Customers: [],
            userPosition: '',
            Reschedule: []
        }
    },
    created(){
        let user = this.$firebase.auth().currentUser

        let details =  this.DashboardUsers.filter(a=>{
            return a['.key'] == user.uid
        })[0]

        this.userPosition = details.position


    },
    mounted(){
        this.$binding('DashboardUsers', this.$firestoreApp.collection('DashboardUsers')),
        this.$binding('AdminNotifications', this.$firestoreApp.collection('AdminNotifications')),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation')),
        this.$binding('partyTrayOrders', this.$firestoreApp.collection('partyTrayOrders')),
        this.$binding('Payments', this.$firestoreApp.collection('Payments')),
        this.$binding('StaffSchedules', this.$firestoreApp.collection('StaffSchedules')),
        this.$binding('Customers', this.$firestoreApp.collection('Customers'))
        this.$binding('Reschedule', this.$firestoreApp.collection('Reschedule'))
    },
    computed:{
        returnUserNotifications(){
            try {
                let user = this.$firebase.auth().currentUser

                let details =  this.DashboardUsers.filter(a=>{
                    return a['.key'] == user.uid
                })[0]

                console.log(details,'details user')
                if(details.position == 'Admin'){
                    console.log(this.$lodash.orderBy(this.returnNotifsWithTypes,a=>{
                        return new Date(a.dateTime)
                    },'desc'),'admin Notifs')
                    return this.$lodash.orderBy(this.returnNotifsWithTypes,a=>{
                        return new Date(a.dateTime)
                    },'desc') 
                } else if(details.position == 'Staff' || details.position == 'Delivery Boy'){
                    let filter = this.returnNotifsWithTypes.filter(a=>{
                        return a.typeOf == 'schedule' && a.staffKey == user.uid
                    })
                    return this.$lodash.orderBy(filter,a=>{
                        return new Date(a.dateTime)
                    },'desc') 
                } else {
                    let filter = this.returnNotifsWithTypes.filter(a=>{
                        return a.typeOf != 'schedule' || a.typeOf != 'status'
                    })     
                    return this.$lodash.orderBy(filter,a=>{
                        return new Date(a.dateTime)
                    },'desc')               
                }

                
                return ''
            } catch (error) {
                console.log(error,'error sa return')
                return []
            }
        },
        returnNotifsWithTypes(){
            try {
                let notifs = this.AdminNotifications.map(a=>{
                if(a.message.includes('Reservation')){
                    if(a.message.includes('Reschedule')){
                        a.typeOf = 'resched'
                        return {...a,...this.returnDataOfNotifs('resched',a.reservationKey)}                        
                    } else {
                        a.typeOf = 'reserve'
                        return {...a,...this.returnDataOfNotifs('reserve',a.reservationKey)}
                    }

                } else if (a.message.includes('Order')) {
                    a.typeOf = 'order'
                    return {...a,...this.returnDataOfNotifs('order',a.reservationKey)}
                } else if (a.message.includes('Payment')){
                    a.typeOf = 'payment'
                    if(a.userID == 'WALK-IN'){
                        a.clientName = 'WALK-IN'
                    } else {
                        a.clientName = this.returnCustomerData(a.userID).displayName
                    }
                    return {...a,...this.returnDataOfNotifs('payment',a.paymentKey)}
                } else if (a.message.includes('Schedule')){
                    a.typeOf = 'schedule'
                    a.clientName = a.clientFName+ ' '+a.clientLName
                    return a
                } else {
                    a.typeOf = 'status'
                    return {...a,...this.returnDataOfNotifs('status',a.reservationKey)}
                }
                })

                
                return notifs
            } catch (error) {
                console.log(error,'notif with types')
                return []
            }
        }
    },
    methods:{
        returnDataOfNotifs(typeOf,key){
            try {
                if(typeOf == 'reserve'){
                    console.log(this.Reservation.filter(a=>{
                        return a['.key'] == key
                    })[0],'get reserve')
                    return this.Reservation.filter(a=>{
                        return a['.key'] == key
                    })[0]
                } else if(typeOf == 'order'){
                    return this.partyTrayOrders.filter(a=>{
                        return a['.key'] == key
                    })[0]
                } else if(typeOf == 'resched'){
                    return this.Reschedule.filter(a=>{
                        return a['.key'] == key
                    })[0]
                } else if(typeOf == 'payment'){
                    return this.Payments.filter(a=>{
                        return a['.key'] == key
                    })[0]
                } else {
                    let reserve = this.Reservation.concat(this.partyTrayOrders)
                    reserve.forEach(a=>{
                        if(a.deliveryDate == null){
                            a.transactionType = 'EVENT RESERVATION'
                            a.clientName = a.clientFName+ ' '+a.clientLName
                        } else {
                            a.transactionType = 'PARTY TRAY ORDER'
                            a.clientName= a.firstName+ ' '+a.lastName
                        }
                    })
                    console.log(reserve,'concat orders and reservation')
                    return reserve.filter(a=>{
                        return a['.key'] == key
                    })[0]
                }
            } catch (error) {
                console.log(error,'returnDataOfNotifs')
                return []
            }
        },
        returnCustomerData(key){
            try {
                return this.Customers.filter(a=>{
                    return a['.key'] == key
                })[0]
            } catch (error) {
                console.log(error,'returnCustomerData')
                return {}
            }
        },
        returnUserPosition(){
          try {
            let user = {...this.$firebase.auth().currentUser}
            return this.DashboardUsers.filter(a=>{
              return a['.key'] == user.uid
            })[0].position
          } catch (error) {
            return ''
          }
        },
        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        },
    }
}
</script>


<style type = "text/css">
    /* #page {
        padding-top:50px;
    } */
    #noti {
        font-size:30px;
        padding-left:10px;
        padding-bottom:10px;
        padding-top:20px;
    }
    #eve {
        font-size:17px;
        font-weight: bold;
    }
    #row {
        padding-right:25px;
    }
    #newreserve {
        font-size:22px;
    }
    #list{
        padding: 0;
    }
    

@media only screen and (min-width: 700px){
  #noti {
      padding-top:25px;
      padding-bottom:20px;
      font-size:30px;
      padding-left:200px;
  }
  #list{
      padding-left:200px;
      padding-right:200px;
  }
}

</style>