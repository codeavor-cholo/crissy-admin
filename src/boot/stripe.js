import Vue from 'vue'
import { StripeCheckout, StripeElements } from 'vue-stripe-checkout'


export default async ({ Vue }) => {
  Vue.use(StripeCheckout)
  Vue.use(StripeElements)
  // Vue.use(VueStripeElements)
}