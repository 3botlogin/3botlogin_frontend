import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'verify-email',
  components: {},
  props: [],
  data () {
    return {
      url: null
    }
  },
  computed: {
    ...mapGetters([
      'emailVerificationStatus'
    ])
  },
  mounted () {
    this.validateEmail({
      userId: this.$route.query.userId,
      verificationCode: this.$route.query.verificationCode
    })
  },
  methods: {
    ...mapActions([
      'validateEmail',
      'saveState',
      'setDoubleName',
      'setScope',
      'setAppId',
      'setAppPublicKey',
      'loginUser'
    ])
  },
  watch: {
    emailVerificationStatus (val) {
      console.log(`emailVerificationStatus`, val)
      console.log(`this.$route.query`, this.$route.query)
      if (!val.checking && val.checked && val.valid) {
        console.log(`Log in`)
        this.saveState({
          hash: this.$route.query.hash,
          redirectUrl: window.atob(this.$route.query.redirecturl)
        })

        this.setDoubleName(this.$route.query.doublename)

        this.setScope(this.$route.query.scope || null)
        this.setAppId(this.$route.query.appid || null)
        this.setAppPublicKey(this.$route.query.publickey || null)

        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        this.loginUser({ mobile: isMobile, firstTime: false })

        this.$router.push({ name: 'login', params: { again: true } })
      }
    }
  }
}
