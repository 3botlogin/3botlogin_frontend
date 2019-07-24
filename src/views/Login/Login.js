import { mapGetters, mapActions } from 'vuex'
// import config from '../../../public/config'

export default {
  name: 'login',
  components: {},
  props: [],
  data() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      cancelLogin: false,
      didLeavePage: false
    }
  },
  computed: {
    ...mapGetters([
      'signed',
      'redirectUrl',
      'doubleName',
      'firstTime',
      'randomImageId',
      'cancelLoginUp',
      'hash',
      'scope',
      'appId',
      'appPublicKey'
    ])
  },
  mounted() {
  },
  methods: {
    ...mapActions([
      'resendNotification',
      'forceRefetchStatus'
    ]),
    openApp() {
      if (this.isMobile) {
        var url = `threebot://login/?state=${encodeURIComponent(this.hash)}&mobile=true`
        if (this.scope) url += `&scope=${encodeURIComponent(this.scope)}`
        if (this.appId) url += `&appId=${encodeURIComponent(this.appId)}`
        if (this.appPublicKey) url += `&appPublicKey=${encodeURIComponent(this.appPublicKey)}`
        console.log(url)
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.replace(url)
        } else if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          window.open(url)
        }
      }
    },
    lostFocus() {
      console.log(`Lost focus, set flag`)
      this.didLeavePage = true
    },
    gotFocus() {
      console.log(`--- Got focus again, flag is ${this.didLeavePage}`)
      if (this.didLeavePage) {
        if (!this.rechecked) {
          this.forceRefetchStatus()
        }
        this.rechecked = true
      }
    }
  },
  watch: {
    signed(val) {
      if (val) {
        window.localStorage.setItem('username', this.doubleName)
        var signedHash = encodeURIComponent(val.signedHash)
        var data = encodeURIComponent(JSON.stringify(val.data))
        var union = '?'
        if (this.redirectUrl.indexOf('?') >= 0) {
          union = '&'
        }

        var safeRedirectUri;
        // Otherwise evil app could do appid+redirecturl = wallet.com + .evil.com = wallet.com.evil.com
        // Now its wallet.com/.evil.com
        if (this.redirectUrl[0] === "/") {
          safeRedirectUri = this.redirectUrl
        } else {
          safeRedirectUri = '/' + this.redirectUrl
        }

        var url = `//${this.appId}${safeRedirectUri}${union}username=${this.doubleName}&signedhash=${signedHash}&data=${data}`
        window.location.href = url
      }
    },
    cancelLoginUp(val) {
      console.log(val)
      this.cancelLogin = true

      var safeRedirectUri;
      if (this.redirectUrl[0] === "/") {
        safeRedirectUri = this.redirectUrl
      } else {
        safeRedirectUri = '/' + this.redirectUrl
      }

      var url = `//${this.appId}${safeRedirectUri}?error=CancelledByUser`
      window.location.href = url
    }
  }
}
