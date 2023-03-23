<template>
  <v-app>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png" />
      <h1>Build Ver 0012</h1>
      <p>
        Content ver 12
      </p>
      <v-icon
        color="success"
        icon="mdi-check-circle"
        size="large"
        @click = "updateExists = true"
      ></v-icon>
      <v-snackbar class="mb-5" bottom v-model="updateExists" :timeout="-1" color="success" height="90">
        <div class="mx-auto" style="width: 200px">
          <div class="mb-3">
            <v-icon class="mr-2" icon="mdi-download"></v-icon>
            <span>An update is available</span>
          </div>
          <div>
            <v-btn outlined text @click="refreshApp">
              Update application
            </v-btn>
          </div>
        </div>
      </v-snackbar>
      <v-snackbar class="pa-0 mb-5q" :timeout="3000" app top centered elevation="24" :color="snackbar.color"
        v-model="snackbar.show" height="60">
        <div class="mx-auto" style="width: 200px">
          <v-icon class="pr-1" small color="white">
            {{ snackbar.icon }}
          </v-icon>
          <span style="font-weight: 600" color="white">
            {{ snackbar.text }}
          </span>
        </div>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
// import EventUpdate from "./mixins/EventUpdate";
import mitt from 'mitt'
const emitter = mitt()

export default {
  // mixins: [EventUpdate],
  name: "App",
  data () {
    return {
      refreshing: false,
      registration: null,
      updateExists: false,
      snackbar: {
        show: false,
        text: "",
        color: "",
        icon: "",
      },
    };
  },
  created () {
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      // Here the actual reload of the page occurs
      window.location.reload()
    })
    emitter.on("SHOW_SNACKBAR", (e) => {
      console.log(`🌊 | file: App.vue:83 | e:`, e);
      if (e) {
        this.snackbar = {
          show: true,
          text: e.text ? e.text : "",
          color: e.color ? e.color : "",
          icon: e.icon ? e.icon : "",
        };
      }
    });
    emitter.emit('SHOW_SNACKBAR')
  },
  mounted () {
    if (typeof window !== undefined && window._VMA === undefined) {
      window._VMA = this;
    }
  },
  methods: {
     // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for

    updateAvailable(event) {
      console.log(`🌊 | file: App.vue:95 | event:`, event);
      this.registration = event.detail
      this.updateExists = true
      // this.refreshBrowser()
    },

    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window._VMA.$emit("SHOW_SNACKBAR", {
        text: "Update Complete",
        color: "success",
        icon: "mdi-checkbox-marked-circle"
      })
    },
  }

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
