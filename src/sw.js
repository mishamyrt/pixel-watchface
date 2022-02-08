'use strict'

function handle (e) {
  console.log(e)
}

self.addEventListener('fetch', handle)
