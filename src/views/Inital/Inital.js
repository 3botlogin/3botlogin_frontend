import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'inital',
  components: {},
  props: [],
  data () {
    return {
      doubleName: '',
      valid: false,
      nameRegex: new RegExp(/^(\w+\.\w+)$/),
      nameRules: [
        v => !!v || 'Name is required',
        v => this.nameRegex.test(v) || 'Name must contain 2 sections separated by a dot'
      ]
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.state && this.$route.query.redirecturl) {
      this.$store.dispatch('saveState', {
        hash: this.$route.query.state,
        redirectUrl: this.$route.query.redirecturl
      })
      if (this.$route.query.scope && this.$route.query.appid && this.$route.query.publickey) {
        this.setScope(this.$route.query.scope.split(','))
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
      'hash'
    ])
  },
  methods: {
    ...mapActions([
      'identify',
      'loginUser',
      'setScope',
      'setAppId',
      'setAppPublicKey'
    ])
  },
  watch: {
    nameCheckStatus (val) {
      if (val.checked && val.available) {
        this.$router.push({ name: 'register' })
      } else if (val.checked && !val.available) {
        this.loginUser()
        window.open(`threebot://login/?hash=${encodeURIComponent(this.hash)}`, '_self')
        this.$router.push({ name: 'login' })
      }
    }
  }
}
