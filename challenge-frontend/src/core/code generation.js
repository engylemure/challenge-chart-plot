function generate(interval, periodo, withSpan = true, os = ['linux', 'windows'], browser = ['chrome', 'firefox']) {
    let initialTimeStamp = new Date().getTime()
    let data = ''
    data += `{ type: 'start', timestamp: ${initialTimeStamp}, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser'] }\n`
    if (withSpan)
        data += `{type: 'span', timestamp: ${initialTimeStamp}, begin: ${initialTimeStamp}, end: ${initialTimeStamp + interval} }\n`
    let timestamp = initialTimeStamp
    while (timestamp < initialTimeStamp + interval) {
        timestamp += periodo
        for (let oIdx in os) {
            for (let bIdx in browser) {
                data += `{type: 'data', timestamp: ${timestamp}, os: '${os[oIdx]}', browser: '${browser[bIdx]}', min_response_time: ${parseFloat((Math.random() * 1).toFixed(1))}, max_response_time: ${parseFloat((Math.random() * 1).toFixed(1)) + 1}}\n`
            }
        }
    }
    data += `{type: 'stop', timestamp: ${timestamp + interval} }\n`
    return data;
}


function generateStrict(interval, periodo, withSpan = true, os = ['linux', 'windows'], browser = ['chrome', 'firefox']) {
    let initialTimeStamp = new Date().getTime()
    let data = ''
    data += `{ "type": "start", "timestamp": ${initialTimeStamp}, "select": ["min_response_time", "max_response_time"], "group": ["os", "browser"] }\n`
    if (withSpan)
        data += `{"type": "span", "timestamp": ${initialTimeStamp}, "begin": ${initialTimeStamp}, "end": ${initialTimeStamp + interval} }\n`
    let timestamp = initialTimeStamp
    while (timestamp < initialTimeStamp + interval) {
        timestamp += periodo
        for (let oIdx in os) {
            for (let bIdx in browser) {
                data += `{"type": "data", "timestamp": ${timestamp}, "os": "${os[oIdx]}", "browser": "${browser[bIdx]}", "min_response_time": ${parseFloat((Math.random() * 1).toFixed(1))}, "max_response_time": ${parseFloat((Math.random() * 1).toFixed(1)) + 1}}\n`
            }
        }
    }
    data += `{"type": "stop", "timestamp": ${timestamp + interval} }\n`
    return data;
}

console.log(generate(60000, 10))