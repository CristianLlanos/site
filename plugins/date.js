export default (_, inject) => {
  inject('longDate', (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('es-PE', options)
  })
}
