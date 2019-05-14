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
      'appPublicKey'
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
        window.open(url)
      }
      this.$router.push({ name: 'login' })
    },
    register () {
      this.$router.push({ name: 'register' })
    }
  }
}
