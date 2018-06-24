import {JWT} from "./verify.js"
import {verifier} from "./verifier.js"

// New API
let ver = new verifier({ alg: 'HS256' })
ver.setSecret('qwertyuiopasdfghjklzxcvbnm123456')

document.querySelector('button').addEventListener('click', ev => {

  let token = document.querySelector('textarea').value.trim();
  let target = document.querySelector('p')

  // Old API
  let old = new JWT(token, {
    alg: 'HS256',
    secret: 'qwertyuiopasdfghjklzxcvbnm123456'
  })
  old.is_valid().then(result => target.innerHTML = target.innerHTML + result)

  let jwt = ver.decode(token)
  ver.is_valid(jwt).then(result => target.innerHTML = target.innerHTML + result)

})

document.querySelector('label').innerHTML = 'Paste JWT here'

console.log('READY')