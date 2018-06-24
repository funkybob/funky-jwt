import {JWT} from "./verify.js"
import {decode, verify} from "./verifier.js"


document.querySelector('button').addEventListener('click', ev => {

  let token = document.querySelector('textarea').value.trim();
  let target = document.querySelector('p')

  // Old API
  let old = new JWT(token, {
    alg: 'HS256',
    secret: 'qwertyuiopasdfghjklzxcvbnm123456'
  })
  old.isValid().then(result => target.innerHTML = target.innerHTML + result)

  let jwt = decode(token)
  verify(jwt, {
    alg: 'HS256',
    secret: 'qwertyuiopasdfghjklzxcvbnm123456'
  }).then(result => target.innerHTML = target.innerHTML + result)

})

document.querySelector('label').innerHTML = 'Paste JWT here'
