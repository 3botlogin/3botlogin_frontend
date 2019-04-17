import VueQr from 'vue-qr'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'register',
  components: {
    VueQr
  },
  props: [],
  data () {
    return {
      step: 1,
      email: '',
      valid: false,
      alone: false,
      wasEverAlone: false,
      areYouSureDialog: false,
      youWereNeverAloneDialog: false,
      proceedAnyway: false,
      emailRegex: new RegExp(/.+@.+\..+/),
      emailRules: [
        v => !!v || 'Email is required',
        v => this.emailRegex.test(v) || 'Email doesn\'t seems valid'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'keys',
      'doubleName',
      'hash',
      'scannedFlagUp'
    ]),
    qrText () {
      return JSON.stringify({
        hash: this.hash,
        privateKey: this.keys.privateKey
      })
    }
  },
  mounted () {
    this.generateKeys()
    console.log(`ddddddddd`)
  },
  methods: {
    ...mapActions([
      'generateKeys',
      'registerUser'
    ]),
    confirmDialog () {
      if (this.wasEverAlone) {
        this.step++
        this.areYouSureDialog = false
      } else {
        this.youWereNeverAloneDialog = true
      }
    },
    giveMeAnOtherChance () {
      this.areYouSureDialog = false
      this.youWereNeverAloneDialog = false
      this.proceedAnyway = false
    },
    proceed () {
      this.areYouSureDialog = false
      this.youWereNeverAloneDialog = false
      this.step++
    }
  },
  watch: {
    alone (val) {
      if (val) {
        this.wasEverAlone = true
      }
    },
    step (val) {
      if (val === 3) {
        this.registerUser({
          email: this.email
        })
        window.location.href = `threebot://register/?privateKey=${encodeURIComponent(this.keys.privateKey)}&hash=${this.hash}`
      }
    },
    scannedFlagUp (val) {
      console.log(`SCANNEDFLAG CHANGED`)
      if (val && this.step === 3) {
        this.$router.push({ name: 'login' })
      }
    }
  }
}