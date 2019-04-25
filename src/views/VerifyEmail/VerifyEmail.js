import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'verify-email',
  components: {},
  props: [],
  data () {
    return {

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
      'validateEmail'
    ])
  }
}
