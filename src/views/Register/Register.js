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
      step: 0,
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
      ],
      didLeavePage: false,
      rechecked: false,
      scannedFlag: false,
      mailsent: false
    }
  },
  computed: {
    ...mapGetters([
      'keys',
      'doubleName',
      'hash',
      'signed',
      'redirectUrl',
      'scannedFlagUp',
      'scope',
      'appId',
      'appPublicKey',
      'emailVerificationStatus'
    ]),
    qrText () {
      return JSON.stringify({
        hash: this.hash,
        privateKey: this.keys.privateKey,
        doubleName: this.doubleName,
        email: this.email,
        scope: this.scope,
        appId: this.appId,
        appPublicKey: this.appPublicKey
      })
    }
  },
  mounted () {
    this.generateKeys()
    window.onblur = this.lostFocus
    window.onfocus = this.gotFocus
  },
  methods: {
    ...mapActions([
      'generateKeys',
      'registerUser',
      'forceRefetchStatus',
      'checkEmailVerification',
      'sendValidationEmail'
    ]),
    lostFocus () {
      console.log(`Lost focus, set flag`)
      this.didLeavePage = true
    },
    gotFocus () {
      console.log(`--- Got focus again, flag is ${this.didLeavePage}`)
      if (this.didLeavePage) {
        if (!this.rechecked) {
          this.forceRefetchStatus()
        }
        this.rechecked = true
      }
    },
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
    },
    openApp () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log(`threebot://register/?privateKey=${encodeURIComponent(this.keys.privateKey)}&hash=${encodeURIComponent(this.hash)}&scope=${encodeURIComponent(this.scope)}&appId=${encodeURIComponent(this.appId)}&appPublicKey=${encodeURIComponent(this.appPublicKey)}&doubleName=${encodeURIComponent(this.doubleName)}&email=${encodeURIComponent(this.email)}`)
        window.open(`threebot://register/?privateKey=${encodeURIComponent(this.keys.privateKey)}&hash=${encodeURIComponent(this.hash)}&scope=${encodeURIComponent(this.scope)}&appId=${encodeURIComponent(this.appId)}&appPublicKey=${encodeURIComponent(this.appPublicKey)}&doubleName=${encodeURIComponent(this.doubleName)}&email=${encodeURIComponent(this.email)}`, '_self')
      }
    }
  },
  watch: {
    alone (val) {
      if (val) {
        this.wasEverAlone = true
      }
    },
    step (val) {
      if (val === 2) {
        this.registerUser({
          email: this.email
        })
      } else if (val === 3) {
        this.openApp()
      }
    },
    scannedFlagUp () {
      this.scannedFlag = true
    },
    signed (val) {
      if (val) {
        this.step = 4
        if (!this.mailsent) {
          this.sendValidationEmail({ email: this.email })
          this.mailsent = true
        }
      }
    }
  }
}
