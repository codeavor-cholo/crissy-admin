<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-purple text-white" style="background-color: #fc000d" height-hint="64">
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

        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <!-- <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg"> -->
          <span class="q-ml-sm">Crissy's Meal Magic Catering Services</span>
        </q-toolbar-title>

        <q-space />

        <q-input class="GNL__toolbar-input" outlined dense v-model="search" color="bg-white " placeholder="Search for topics, locations & sources">
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
        </q-input>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="$q.screen.gt.sm" round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="blue" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white"
      :width="280"
      overlay
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-purple">
          <q-item @click="filterDashboard(link)" class="GNL__drawer-item" v-ripple v-for="link in links1" :key="link.text" clickable>
            <q-item-section avatar>
              <q-icon class="text-purple" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />
          <q-expansion-item :content-inset-level="0.5" icon="settings" label="File Maintenance"  default-close>
          <q-item @click="filterDashboardII(link)" class="GNL__drawer-item" v-ripple v-for="link in links2" :key="link.text" clickable>
            <q-item-section avatar>
              <q-icon class="text-purple" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { fasGlobeAmericas, fasFlask } from '@quasar/extras/fontawesome-v5'
export default {
  name: 'GoogleNewsLayout',
  data () {
    return {
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
        { icon: 'dashboard', text: 'DashBoard' },
        { icon: 'mdi-calendar', text: 'Reservation' },
        { icon: 'search', text: 'Saved searches' }
      ],
      links2: [
        { icon: 'mdi-format-list-bulleted-type', text: 'Food Category' },
        { icon: 'mdi-city', text: 'City' },
        { icon: 'mdi-food', text: 'Food' },
        { icon: 'mdi-room-service', text: 'Services' },
        { icon: 'mdi-table-chair', text: 'Inclusions' },
        { icon: 'mdi-database-plus', text: 'Add-Ons' },
        { icon: 'mdi-palette', text: 'Motif' },
        { icon: 'mdi-briefcase-plus', text: 'Position' },
        { icon: 'mdi-calendar', text: 'Event' },
        { icon: 'mdi-package', text: 'Packages' }
      ],
      links3: [
        { icon: '', text: 'Language & region' },
        { icon: '', text: 'Settings' },
        { icon: 'open_in_new', text: 'Get the Android app' },
        { icon: 'open_in_new', text: 'Get the iOS app' },
        { icon: '', text: 'Send feedback' },
        { icon: 'open_in_new', text: 'Help' }
      ]
    }
  },
  computed:{
  
  },
  methods: {
    filterDashboard(link){
            let party = this.$lodash.filter(this.links1, a=>{
                    return a.text == link.text
            })
            console.log(party, 'party')
            if(party[0].text == 'Walk-In Reservation'){
                this.$router.push('/walkin')
            } else if(party[0].text == 'DashBoard') {
                this.$router.push('/dashboard')
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
            } else if(party[0].text == 'Food') {
                this.$router.push('/food')
            } else if(party[0].text == 'Services') {
                this.$router.push('/services')
            } else if(party[0].text == 'Inclusions') {
                this.$router.push('/inclusion')
            } else if(party[0].text == 'Add-Ons') {
                this.$router.push('/addons')
            } else if(party[0].text == 'Motif') {
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
    }
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