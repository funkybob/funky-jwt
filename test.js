import {JWT} from "./verify.js"
import {decode, verify} from "./verifier.js"


const config = {
  alg: 'HS256',
  secret: 'qwertyuiopasdfghjklzxcvbnm123456'
}

document.querySelector('button').addEventListener('click', ev => {

  let token = document.querySelector('textarea').value.trim();
  let target = document.querySelector('p')

  // Old API
  let old = new JWT(token, config)
  old.isValid().then(result => target.innerHTML = target.innerHTML + result)

  let jwt = decode(token)
  verify(jwt, config).then(result => target.innerHTML = target.innerHTML + result)

})

document.querySelector('label').innerHTML = 'Paste JWT here'
