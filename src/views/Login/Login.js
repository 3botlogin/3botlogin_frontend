import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'login',
  components: {},
  props: [],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'signed',
      'redirectUrl',
      'doubleName',
      'firstTime'
    ])
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'resendNotification'
    ])
  },
  watch: {
    signed (val) {
      if (val) {
        var signedHash = encodeURIComponent(val.signedHash)
        var data = encodeURIComponent(JSON.stringify(val.data))
        var union = ''
        if (this.redirectUrl.indexOf('?' >= 0)) {
          union = '?'
        } else {
          union = '&'
        }
        var url = `${this.redirectUrl}${union}username=${this.doubleName}&signedhash=${signedHash}&data=${data}`
        window.location.href = url
      }
    }
  }
}
