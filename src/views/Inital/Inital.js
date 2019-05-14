import { mapActions, mapGetters } from 'vuex'
var cookies = require('vue-cookies')

export default {
  name: 'inital',
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
      continueToLogin: false
    }
  },
  mounted () {
    this.firstvisit = !cookies.get('firstvisit')
    if (this.firstvisit) {
      cookies.set('firstvisit', true)
    }
    this.appid = this.$route.query.appid
    if (this.$route.query && this.$route.query.state && this.$route.query.redirecturl) {
      this.$store.dispatch('saveState', {
        hash: this.$route.query.state,
        redirectUrl: this.$route.query.redirecturl
      })
      if (this.$route.query.scope && this.$route.query.appid && this.$route.query.publickey) {
        this.setScope(this.$route.query.scope)
        this.setAppId(this.$route.query.appid)
        this.setAppPublicKey(this.$route.query.publickey)
      }
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
      'appPublicKey'
    ])
  },
  methods: {
    ...mapActions([
      'identify',
      'loginUser',
      'setScope',
      'setAppId',
      'setAppPublicKey',
      'checkName'
    ]),
    registerOrLogim () {
      if (this.nameCheckStatus.checked && this.nameCheckStatus.available) this.register()
      else this.login()
    },
    login () {
      this.loginUser()
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.open(`threebot://login/?hash=${encodeURIComponent(this.hash)}&scope=${encodeURIComponent(this.scope)}&appId=${encodeURIComponent(this.appId)}&appPublicKey=${encodeURIComponent(this.appPublicKey)}`, '_self')
      }
      this.$router.push({ name: 'login' })
    },
    register () {
      this.identify(this.doubleName)
      this.$router.push({ name: 'register' })
    }
  }
}
