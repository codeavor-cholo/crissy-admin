<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-4">

    <q-header elevated class="bg-grey-8 text-white" style="background-color: #fc000d" height-hint="64">
<!-- START OF DESKTOP HEADER -->
      <div class="desktop-only">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />
        <q-img
          src="statics/logo.png"
          :ratio="1"
          style="width:3.5em;"
          class="q-ml-sm"
        />
        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <span>Crissy's Meal Magic Catering Services</span>
        </q-toolbar-title>

        <q-space />

        <!-- <q-input class="GNL__toolbar-input text-white" outlined dense v-model="search" color="white" placeholder="Search for topics, locations & sources">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" color="white" name="search" />
            <q-icon v-else name="clear" color="white" class="cursor-pointer" @click="search = ''" />
          </template>
          <template v-slot:append>
            <q-btn
              flat
              dense
              round
              aria-label="Menu"
              icon="arrow_drop_down"
            >
              <q-menu anchor="bottom right" self="top right">
                <div class="q-pa-md" style="width: 400px">
                  <div class="text-body2 text-grey q-mb-md">
                    Narrow your search results
                  </div>

                  <div class="row items-center">
                    <div class="col-3 text-subtitle2 text-grey">
                      Exact phrase
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="exactPhrase" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Has words
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="hasWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Exclude words
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="excludeWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Website
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="byWebsite" />
                    </div>

                    <div class="col-12 q-pt-lg row justify-end">
                      <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;" label="Search" v-close-popup />
                      <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;" @click="onClear" label="Clear" v-close-popup />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </template>
        </q-input> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="$q.screen.gt.sm" round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications" @click="$router.push('/notifications')">
            <q-badge color="orange-8" text-color="white" floating>
              {{returnLengthNotif}}
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn-dropdown round flat>

              <template v-slot:label>
                <q-avatar size="26px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
                <span class="q-ml-md">{{userEmail}}</span>
              </template>
                  <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Account Settings</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
      </div>
<!-- END OF DESKTOP HEADER -->

<!-- START OF MOBILE ONLY HEADER -->
      <div class="mobile-only">
        <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />
        <q-img
          src="statics/logo.png"
          :ratio="1"
          style="width:3.5em;"
          class="q-ml-sm"
        />
        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <span>Crissy's Meal Magic Catering Services</span>
        </q-toolbar-title>

        <q-space />

        <!-- <q-input class="GNL__toolbar-input text-white" outlined dense v-model="search" color="white" placeholder="Search for topics, locations & sources">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" color="white" name="search" />
            <q-icon v-else name="clear" color="white" class="cursor-pointer" @click="search = ''" />
          </template>
          <template v-slot:append>
            <q-btn
              flat
              dense
              round
              aria-label="Menu"
              icon="arrow_drop_down"
            >
              <q-menu anchor="bottom right" self="top right">
                <div class="q-pa-md" style="width: 400px">
                  <div class="text-body2 text-grey q-mb-md">
                    Narrow your search results
                  </div>

                  <div class="row items-center">
                    <div class="col-3 text-subtitle2 text-grey">
                      Exact phrase
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="exactPhrase" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Has words
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="hasWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Exclude words
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="excludeWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Website
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="byWebsite" />
                    </div>

                    <div class="col-12 q-pt-lg row justify-end">
                      <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;" label="Search" v-close-popup />
                      <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;" @click="onClear" label="Clear" v-close-popup />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </template>
        </q-input> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="$q.screen.gt.sm" round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications" @click="$router.push('/notifications')">
            <q-badge color="orange-8" text-color="white" floating>
              {{returnLengthNotif}}
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          
          <q-btn-dropdown round flat>
              <template v-slot:label>
                <q-avatar size="26px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
              </template>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label><b>CURRENT USER:</b></q-item-label>
                        <q-item-label class="text-orange-9 text-center">{{userEmail}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />      
                    <q-item clickable v-close-popup>
                      <q-item-section>
                        <q-item-label>Account Settings</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="logout">
                      <q-item-section>
                        <q-item-label>Logout</q-item-label>
                      </q-item-section>
                    </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
      </div>
<!-- END OF MOBILE ONLY HEADER -->
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white"
      :width="300"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-orange-8">
          <q-item @click="filterDashboard(link)" class="GNL__drawer-item" v-ripple v-for="link in links1" :key="link.text" clickable v-show="returnUserPermissions(link.text)">
            <q-item-section avatar>
              <q-icon class="text-orange-8" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />
          <q-expansion-item :content-inset-level="0.5" icon="settings" label="File Maintenance"  default-close v-show="returnUserPermissions('File Maintenance')">
              <q-expansion-item :content-inset-level="0.5" icon="mdi-package-variant" label="Package Management"  default-close>
              <q-item @click="filterDashboardII(link)" class="GNL__drawer-item" v-ripple v-for="link in links2" :key="link.text" clickable>
                <q-item-section avatar>
                  <q-icon class="text-orange-8" :name="link.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ link.text }}</q-item-label>
                </q-item-section>
              </q-item>
              </q-expansion-item>
              <q-expansion-item :content-inset-level="0.5" icon="mdi-database-plus" label="Inclusion Management"  default-close>
                <q-item @click="filterDashboardIII(link)" class="GNL__drawer-item" v-ripple v-for="link in links3" :key="link.text" clickable>
                  <q-item-section avatar>
                    <q-icon class="text-orange-8" :name="link.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ link.text }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
          </q-expansion-item>
          <!-- <q-separator inset class="q-my-sm" />
          <q-expansion-item :content-inset-level="0.5" icon="mail" label="File Maintenance"  default-close>
          <q-item class="GNL__drawer-item" v-ripple v-for="link in links3" :key="link.text" clickable>
            <q-item-section>
              <q-item-label>{{ link.text }} <q-icon v-if="link.icon" :name="link.icon" /></q-item-label>
            </q-item-section>
          </q-item>
          </q-expansion-item> -->

          <div class="q-mt-md">
            <div class="flex flex-center q-gutter-xs">
              <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Privacy">Privacy</a>
              <span> · </span>
              <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Terms">Terms</a>
              <span> · </span>
              <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="About">About Google</a>
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    
    <div class="desktop-only">
    <q-page-container>
      <router-view />
    </q-page-container>
    </div>
    <div class="mobile-only">
    <q-page-container>
      <router-view />
    </q-page-container>
    </div>
  </q-layout>
</template>

<script>
import { fasGlobeAmericas, fasFlask } from '@quasar/extras/fontawesome-v5'
import { QSpinnerFacebook } from 'quasar'
import { date } from 'quasar'
export default {
  name: 'GoogleNewsLayout',
  data () {
    return {
      DashboardUsers: [],
      AdminNotifications: [],
      Reservation: [],
      partyTrayOrders: [],
      Payments: [],
      StaffSchedules: [],
      Customers: [],
      userPosition: '',
      leftDrawerOpen: false,
      search: '',
      showAdvanced: false,
      showDateOptions: false,
      exactPhrase: '',
      hasWords: '',
      excludeWords: '',
      byWebsite: '',
      byDate: 'Any time',
      links1: [
        { icon: 'mdi-walk', text: 'Walk-In Reservation' },
        { icon: 'dashboard', text: 'Dashboard' },
        { icon: 'mdi-calendar', text: 'Reservation' },
        { icon: 'update', text: 'Event Status' },
        { icon: 'update', text: 'Staff Dashboard' },
        { icon: 'update', text: 'Reschedule Events' },
        { icon: 'cancel', text: 'Cancelled Events' },
        { icon: 'supervised_user_circle', text: 'User Management' },
        { icon: 'event_note', text: 'Event Staff Scheduling' },
        { icon: 'assessment', text: 'Sales Reports' },
        { icon: 'bar_chart', text: 'Most Popular Choices' },
        { icon: 'local_atm', text: 'Payment Reports' },
        // { icon: 'mdi-calendar', text: 'Reserve' },
      ],
      links2: [
        // { icon: 'mdi-briefcase-plus', text: 'Position' },
        { icon: 'mdi-city', text: 'City' },
        { icon: 'mdi-palette', text: 'Motif' },
        { icon: 'mdi-brightness-6', text: 'Theme' },
        { icon: 'mdi-calendar', text: 'Event' },
        { icon: 'mdi-format-list-bulleted-type', text: 'Food Category' },
        { icon: 'mdi-food', text: 'Food' },
        { icon: 'mdi-package', text: 'Packages' }
      ],
      links3: [
        { icon: 'mdi-table-chair', text: 'Inclusions' },
        // { icon: 'mdi-alarm-plus', text: 'Extras(Other Inclusion)' },
        { icon: 'mdi-room-service', text: 'Services' },
        { icon: 'mdi-database-plus', text: 'Add-Ons' },
        // { icon: 'mdi-candycane', text: 'Freebies' }
      ],
      userEmail: ''
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
        self.userEmail = username[0]
        self.accountLoggedIn = gg

        } else {
            self.$router.push('/')
        }
    })
  },
  mounted(){
        this.$binding('DashboardUsers', this.$firestoreApp.collection('DashboardUsers')),
        this.$binding('AdminNotifications', this.$firestoreApp.collection('AdminNotifications')),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation')),
        this.$binding('partyTrayOrders', this.$firestoreApp.collection('partyTrayOrders')),
        this.$binding('Payments', this.$firestoreApp.collection('Payments')),
        this.$binding('StaffSchedules', this.$firestoreApp.collection('StaffSchedules')),
        this.$binding('Customers', this.$firestoreApp.collection('Customers'))    
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
                    console.log(this.$lodash.orderBy(this.returnNotifsWithTypes,'dateTime','desc'),'types')
                    // return this.$lodash.orderBy(this.returnNotifsWithTypes,'dateTime','desc')
                    return this.$lodash.orderBy(this.returnNotifsWithTypes,a=>{
                        return this.$moment(a.dateTime).toString()
                    },'desc') 
                } else if(details.position == 'Staff' || details.position == 'Delivery Boy'){
                    let filter = this.returnNotifsWithTypes.filter(a=>{
                        return a.typeOf == 'schedule' && a.staffKey == user.uid
                    })
                    console.log(this.$lodash.orderBy(filter,'dateTime','desc'),'types')
                    return this.$lodash.orderBy(filter,a=>{
                        return this.$moment(a.dateTime).toString()
                    },'desc') 
                } else {
                    let filter = this.returnNotifsWithTypes.filter(a=>{
                        return a.typeOf != 'schedule' || a.typeOf != 'status'
                    })     
                    return this.$lodash.orderBy(filter,a=>{
                        return this.$moment(a.dateTime).toString()
                    },'desc')               
                }

                
                return ''
            } catch (error) {
                return []
            }
        },
        returnLengthNotif(){
          try {
            let today = date.formatDate(new Date(),'MM-DD-YYYY')
            let filter = this.returnUserNotifications.filter(a=>{
              return date.formatDate(new Date(a.dateTime),'MM-DD-YYYY') == today
            })
            return filter.length
          } catch (error) {
            return 0
          }
        },
        returnNotifsWithTypes(){
            try {
                let notifs = this.AdminNotifications.map(a=>{
                if(a.message.includes('Reservation')){
                    a.typeOf = 'reserve'
                    return {...a,...this.returnDataOfNotifs('reserve',a.reservationKey)}
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
                return []
            }
        }  
  },
  methods: {
        returnUserPermissions(linkText){
          try {
            let user = this.$firebase.auth().currentUser

            let details =  this.DashboardUsers.filter(a=>{
                return a['.key'] == user.uid
            })[0]     
            
            console.log('position return',details.position)
            
            if(details.position == 'Admin'){
              if(linkText == 'Staff Dashboard'){
                return false
              } else {
                return true
              }
            } else if (details.position == 'Secretary'){
              if(linkText == 'User Management'){
                return false
              } else {
                return true
              }
            } else {
              if(linkText == 'Staff Dashboard'){
                return true
              } else {
                return false
              }
            }         
          } catch (error) {
            return true
          }
        },
    filterDashboard(link){
            let party = this.$lodash.filter(this.links1, a=>{
                    return a.text == link.text
            })
            console.log(party, 'party')
            if(party[0].text == 'Walk-In Reservation'){
                this.$router.push('/walkin')
            } else if(party[0].text == 'Dashboard') {
                this.$router.push('/dashboard')
            } else if(party[0].text == 'Reservation') {
                this.$router.push('/reservation')
            } else if(party[0].text == 'Event Status' || party[0].text == 'Staff Dashboard') {
                this.$router.push('/status')  
            } else if(party[0].text == 'User Management') {
                this.$router.push('/users')  
            } else if(party[0].text == 'Event Staff Scheduling') {
                this.$router.push('/staffscheduling')
            } else if(party[0].text == 'Reschedule Events') {
                this.$router.push('/reschedule')
            } else if(party[0].text == 'Sales Reports') {
                this.$router.push('/reports')    
            } else if(party[0].text == 'Most Popular Choices') {
                this.$router.push('/bestReports') 
            } else if(party[0].text == 'Payment Reports') {
                this.$router.push('/paymentReports')                   
            } else if(party[0].text == 'Reserve') {
                this.$router.push('/mobreserve')
            } else if(party[0].text == 'Cancelled Events') {
                this.$router.push('/cancel')
            } else {
                this.$router.push('/Error404')
            } 
        },
    filterDashboardII(link){
            let party = this.$lodash.filter(this.links2, a=>{
                    return a.text == link.text
            })
            console.log(party, 'party')
            if(party[0].text == 'Food Category'){
                this.$router.push('/foodcategory')
            } else if(party[0].text == 'City') {
                this.$router.push('/city')
            } else if(party[0].text == 'Theme') {
                this.$router.push('/theme')
            } else if(party[0].text == 'Food') {
                this.$router.push('/food')
            }else if(party[0].text == 'Motif') {
                this.$router.push('/motif')
            } else if(party[0].text == 'Event') {
                this.$router.push('/event')
            } else if(party[0].text == 'Position') {
                this.$router.push('/position')
            } else if(party[0].text == 'Packages') {
                this.$router.push('/packages')
            } else {
                this.$router.push('/Error404')
            }
        },
        filterDashboardIII(link){
            let party = this.$lodash.filter(this.links3, a=>{
                    return a.text == link.text
            })
            console.log(party, 'party')
            if(party[0].text == 'Services') {
                this.$router.push('/services')
            } else if(party[0].text == 'Inclusions') {
                this.$router.push('/inclusion')
            } else if(party[0].text == 'Add-Ons') {
                this.$router.push('/addons')
            }else if(party[0].text == 'Freebies') {
                this.$router.push('/freebies')
            } else if(party[0].text == 'Extras(Other Inclusion)') {
                this.$router.push('/extras')
            } else {
                this.$router.push('/Error404')
            }
        },
    onClear () {
      this.exactPhrase = ''
      this.hasWords = ''
      this.excludeWords = ''
      this.byWebsite = ''
      this.byDate = 'Any time'
    },
    changeDate (option) {
      this.byDate = option
      this.showDateOptions = false
    },
      logout(){
      this.$q.dialog({
                title: `Are you sure you want to logout?`,
                type: 'orange-8',
                color: 'orange-8',
                textColor: 'white',
                icon: 'info',
                ok: 'Ok',
                cancel: 'Cancel'
                
            }).onOk(()=>{
                    /* This is for Codepen (using UMD) to work */
                  const spinner = typeof QSpinnerFacebook !== 'undefined'
                    ? QSpinnerFacebook // Non-UMD, imported above
                    : Quasar.components.QSpinnerFacebook // eslint-disable-line
                  /* End of Codepen workaround */
                  this.$q.loading.show({
                  message: 'Logging out',
                  spinner,
                  spinnerColor: 'orange-8',
                  backgroundColor: 'grey-10',
                  messageColor: 'orange-8'
                  })
                  this.timer = setTimeout(() => {
                  this.$q.loading.hide()
                  this.timer = void 0
                  }, 2000)  
                  // hiding in 3s  
                    this.$firebase.auth().signOut()
                    .then(() => {
                    this.$router.push('/')
                  })
            })
            
    },
    returnDataOfNotifs(typeOf,key){
        try {
            if(typeOf == 'reserve'){
                return this.Reservation.filter(a=>{
                    return a['.key'] == key
                })[0]
            } else if(typeOf == 'order'){
                return this.partyTrayOrders.filter(a=>{
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
            return []
        }
    },
    returnCustomerData(key){
        try {
            return this.Customers.filter(a=>{
                return a['.key'] == key
            })[0]
        } catch (error) {
            return []
        }
    },
    returnUserPosition(){
      try {
        let user = {...this.$firebase.auth().currentUser}
        return this.DashboardUsers.filter(a=>{
          return a['.key'] == user.uid
        })[0]
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

<style lang="sass">
.GNL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 55%
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      .q-icon
        color: #5f6368
    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>