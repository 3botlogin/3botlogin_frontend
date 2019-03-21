import VueQr from 'vue-qr'

export default {
  name: 'register',
  components: {
    VueQr
  },
  props: [],
  data () {
    return {
      privateKey: '',
      step: 1
    }
  },
  computed: {

  },
  mounted () {
    // TODO: Generate keys
    // TODO: Show seed phrase
    // TODO: Show dialogbox to confirm user has written down the seed phrase
    // TODO: Show private key in QR
  },
  methods: {
    showQR () {
      console.log(`Go On`)
    }
  }
}
