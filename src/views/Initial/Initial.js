import { mapActions, mapGetters } from 'vuex'
var cookies = require('vue-cookies')

export default {
  name: 'initial',
  components: {},
  props: [],
  data () {
    return {
      firstvisit: false,
      appid: '',
      doubleName: '',
      valid: false,
      nameRegex: new RegExp(/^(\w+)$/),
      nameRules: [
        v => !!v || 'Name is required',
        v => this.nameRegex.test(v) || 'Name can only contain alphanumeric characters.'
      ],
      continueToLogin: false,
      url: '',
      spinner: false
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.query.logintoken && this.$route.query.doublename) {
      this.doubleName = this.$route.query.doublename
      this.setDoubleName(this.$route.query.doublename)
      this.url = `${this.$route.query.doublename} && ${this.$route.query.logintoken}`
      this.loginUser({ mobile: true, firstTime: false, logintoken: this.$route.query.logintoken })
    }
    if (this.$route.query.logintoken) {
      this.spinner = true
    }
    this.firstvisit = !cookies.get('firstvisit')
    if (this.firstvisit) {
      cookies.set('firstvisit', true)
    }
    this.appid = this.$route.query.appid
    if (this.$route.query) {
      this.$store.dispatch('saveState', {
        hash: this.$route.query.state,
        redirectUrl: this.$route.query.redirecturl
      })
      this.setScope(this.$route.query.scope || null)
      this.setAppId(this.$route.query.appid || null)
      this.setAppPublicKey(this.$route.query.publickey || null)
    } else {
      this.$router.push('error')
    }
  },
  computed: {
    ...mapGetters([
      'nameCheckStatus',
      'hash',
      'scope',
      'appId',
      'appPublicKey',
      'signed',
      'redirectUrl'
    ])
  },
  methods: {
    ...mapActions([
      'setDoubleName',
      'loginUser',
      'setScope',
      'setAppId',
      'setAppPublicKey',
      'checkName'
    ]),
    registerOrLogim () {
      this.setDoubleName(this.doubleName)
      if (this.nameCheckStatus.checked && this.nameCheckStatus.available) this.register()
      else this.login()
    },
    login () {
      var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      this.loginUser({ mobile: isMobile, firstTime: false })
      if (isMobile) {
        var url = `threebot://login/?state=${encodeURIComponent(this.hash)}&mobile=true`
        if (this.scope) url += `&scope=${encodeURIComponent(this.scope)}`
        if (this.appId) url += `&appId=${encodeURIComponent(this.appId)}`
        if (this.appPublicKey) url += `&appPublicKey=${encodeURIComponent(this.appPublicKey)}`
        if (this.$route.query.logintoken) url += `&logintoken=${encodeURIComponent(this.$route.query.logintoken)}`
        window.open(url)
      }
      this.$router.push({ name: 'login' })
    },
    register () {
      this.$router.push({ name: 'register' })
    }
  },
  watch: {
    signed (val) {
      this.url = 'url'
      console.log(`signed`)
      if (val) {
        console.log(`------`)
        console.log(`------`)
        console.log(`------`)
        console.log(`------`)
        console.log(`------`)
        console.log(`Signed, continue`)
        var signedHash = encodeURIComponent(val.signedHash)
        var data = encodeURIComponent(JSON.stringify(val.data))
        var union = '&'
        if (this.redirectUrl.indexOf('?') >= 0) {
          union = '&'
        } else {
          union = '?'
        }
        var url = `${this.$route.query.redirecturl}${union}username=${this.doubleName}&signedhash=${signedHash}&data=${data}`
        console.log(`Redirecting to ${url}`)
        this.url = url
        window.location.href = url
      }
    }
  }
}
