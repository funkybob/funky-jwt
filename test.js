import {decode, verify} from "./verify.js"


const config = {
  alg: 'HS256',
  secret: 'qwertyuiopasdfghjklzxcvbnm123456'
}

document.querySelector('button').addEventListener('click', ev => {

  let token = document.querySelector('textarea').value.trim();
  let target = document.querySelector('p')

  let jwt = decode(token)
  verify(jwt, config).then(result => target.innerHTML = target.innerHTML + result)

})

document.querySelector('label').innerHTML = 'Paste JWT here'
