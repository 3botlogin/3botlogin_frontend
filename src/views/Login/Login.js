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
        console.log(val)
        var signedHash = encodeURIComponent(val.signedHash)
        var data = encodeURIComponent(JSON.stringify(val.data))
        var url = `${this.redirectUrl}?username=${this.doubleName}&signedhash=${signedHash}&data=${data}`
        
        console.log(url)
        window.location.href = url
      }
    }
  }
}
