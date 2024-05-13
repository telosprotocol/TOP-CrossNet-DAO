import { sha256 } from 'js-sha256'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const apiHost = process.env.NEXT_PUBLIC_API_HOST || ''

let _appname = '',
  _category = '',
  _baseUrl = '',
  isInit = false
const eventPool: any = []
let ostype: any
export function initTrack({ appname, category, baseUrl }: any) {
  if (!appname) {
    throw new Error('Need appname')
  }
  if (!category) {
    throw new Error('Need category')
  }
  _appname = appname
  _category = category
  if (baseUrl) {
    _baseUrl = baseUrl
  }
  getOsVersion()
  isInit = true
  eventPool.forEach(async (item: any) => {
    await track(item)
  })
}

export function trackPV(params = {}) {
  track({
    ...params,
    event: 'pageview',
  })
}

export async function getVisitorId() {
  const fpPromise: any = await loadFP()
  const fp = await fpPromise.load()
  const result = await fp.get()
  return result.visitorId
}

export async function track(params: any = {}) {
  if (!isInit) {
    eventPool.push(params)
    return
  }
  try {
    const timestamp = Date.now()
    const visitorId = await getVisitorId()
    const event = params.event
    delete params.event
    // result.visitorId
    const ip = await getIp()
    const msg = {
      ip,
      ostype,
      actiontime: timestamp,
      category: _category,
      appname: _appname,
      event: event,
      properties: {
        source: '1',
        evn: process.env.NEXT_PUBLIC_REPORT_ENV, // dn|pn
        chain_name: localStorage.getItem('_netName') || '',
        chain_id: localStorage.getItem('_netId') || '',
        account: localStorage.getItem('_account') || '',
        language: navigator.language,
        local_timestamp: timestamp,
        time_zone_offset: `GMT+${new Date().getTimezoneOffset() / -60}:00`,
        visitor_id: visitorId,
        user_agent: navigator.userAgent,
        href: window.location.href,
        ...params,
      },
    }
    const msgStr = JSON.stringify(msg)
    await fetch(_baseUrl + '/report/log/async', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'tz_block',
        sign: msgHash(msgStr),
        msg: msgStr,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}

function msgHash(msgStr: string) {
  if (msgStr.length <= 128) {
    return sha256(msgStr)
  }
  return sha256(
    msgStr.substring(0, 64) +
      msgStr.substring(msgStr.length - 64, msgStr.length)
  )
}

function getOsVersion() {
  ostype = 'Unknown'
  if (window.navigator.userAgent.indexOf('Windows') !== -1) ostype = 'Windows'
  if (window.navigator.userAgent.indexOf('Mac') !== -1) ostype = 'Mac/iOS'
  if (window.navigator.userAgent.indexOf('X11') !== -1) ostype = 'UNIX'
  if (window.navigator.userAgent.indexOf('Linux') !== -1) ostype = 'Linux'
}

export async function getIp() {
  return '';
}

function loadFP() {
  return new window.Promise((resolve) => {
    if (window.FingerprintJS) {
      resolve(window.FingerprintJS)
      return
    }
    var script = document.createElement('script')
    script.onload = function () {
      resolve(window.FingerprintJS)
    }
    script.src = '/vid.js'

    document.head.appendChild(script) //or something of the likes
  })
}

export function useInitTrack() {
  const router = useRouter()
  useEffect(() => {
    initTrack({
      appname: 'deshareDao',
      category: 'website',
      baseUrl: '',
    })
  }, [])
  useEffect(() => {
    trackPV()
  }, [router])
}
