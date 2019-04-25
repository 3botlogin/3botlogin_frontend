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
    } else {
      this.$router.push('error')
    }
  },
  computed: {
    ...mapGetters([
      'nameCheckStatus',
      'hash',
      'redirectUrl'
    ])
  },
  methods: {
    ...mapActions([
      'identify',
      'loginUser'
    ])
  },
  watch: {
    nameCheckStatus (val) {
      if (val.checked && val.available) {
        this.$router.push({ name: 'register' })
      } else if (val.checked && !val.available) {
        this.loginUser()
        var redirectUrl = `${this.redirectUrl}?username=${this.doubleName}&signedhash=`
        window.open(`threebot://login/?hash=${encodeURIComponent(this.hash)}&redirectUrl=${encodeURIComponent(redirectUrl)}`, '_self').close()
        this.$router.push({ name: 'login' })
      }
    }
  }
}
