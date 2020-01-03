import {processEventsMapped, processText} from './event_processing_without_wasm';

const text = `{ "type": "start", "timestamp": 1578045339569, "select": ["min_response_time", "max_response_time"], "group": ["os", "browser"] }\n
{ "type": "span", "timestamp": 1578045339569, "begin": 1578045339569, "end": 1578045339574 }\n
{"type": "data", "timestamp": 1578045339570, "os": "linux", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.8}\n
{"type": "data", "timestamp": 1578045339570, "os": "linux", "browser": "firefox", "min_response_time": 0.2, "max_response_time": 1.8}\n
{"type": "data", "timestamp": 1578045339570, "os": "windows", "browser": "chrome", "min_response_time": 0.5, "max_response_time": 1.9}\n
{"type": "data", "timestamp": 1578045339570, "os": "windows", "browser": "firefox", "min_response_time": 0.4, "max_response_time": 1.9}\n
{"type": "data", "timestamp": 1578045339571, "os": "linux", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.5}\n
{"type": "data", "timestamp": 1578045339571, "os": "linux", "browser": "firefox", "min_response_time": 0.5, "max_response_time": 1.7}\n
{"type": "data", "timestamp": 1578045339571, "os": "windows", "browser": "chrome", "min_response_time": 0.5, "max_response_time": 1.4}\n
{"type": "data", "timestamp": 1578045339571, "os": "windows", "browser": "firefox", "min_response_time": 0.6, "max_response_time": 1.6}\n
{"type": "data", "timestamp": 1578045339572, "os": "linux", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.9}\n
{"type": "data", "timestamp": 1578045339572, "os": "linux", "browser": "firefox", "min_response_time": 0.9, "max_response_time": 1.6}\n
{"type": "data", "timestamp": 1578045339572, "os": "windows", "browser": "chrome", "min_response_time": 0.5, "max_response_time": 1.4}\n
{"type": "data", "timestamp": 1578045339572, "os": "windows", "browser": "firefox", "min_response_time": 0.6, "max_response_time": 1}\n
{"type": "data", "timestamp": 1578045339573, "os": "linux", "browser": "chrome", "min_response_time": 0.5, "max_response_time": 1.4}\n
{"type": "data", "timestamp": 1578045339573, "os": "linux", "browser": "firefox", "min_response_time": 0.9, "max_response_time": 1.9}\n
{"type": "data", "timestamp": 1578045339573, "os": "windows", "browser": "chrome", "min_response_time": 0.4, "max_response_time": 1.8}\n
{"type": "data", "timestamp": 1578045339573, "os": "windows", "browser": "firefox", "min_response_time": 0.9, "max_response_time": 1.9}\n
{"type": "data", "timestamp": 1578045339574, "os": "linux", "browser": "chrome", "min_response_time": 0.8, "max_response_time": 1.4}\n
{"type": "data", "timestamp": 1578045339574, "os": "linux", "browser": "firefox", "min_response_time": 0.1, "max_response_time": 1.6}\n
{"type": "data", "timestamp": 1578045339574, "os": "windows", "browser": "chrome", "min_response_time": 1, "max_response_time": 1.9}\n
{"type": "data", "timestamp": 1578045339574, "os": "windows", "browser": "firefox", "min_response_time": 0.2, "max_response_time": 1.8}\n
{"type": "stop", "timestamp": 1578045339579 }`;

const eventsMapped = [{"startEvent":{"type":"start","timestamp":1578045339569,"select":["min_response_time","max_response_time"],"group":["os","browser"]},"stopEvent":{"type":"stop","timestamp":1578045339579},"spanEvent":{"type":"span","timestamp":1578045339569,"begin":1578045339569,"end":1578045339574},"dataEvents":[{"type":"data","timestamp":1578045339570,"os":"linux","browser":"chrome","min_response_time":0.1,"max_response_time":1.8},{"type":"data","timestamp":1578045339570,"os":"linux","browser":"firefox","min_response_time":0.2,"max_response_time":1.8},{"type":"data","timestamp":1578045339570,"os":"windows","browser":"chrome","min_response_time":0.5,"max_response_time":1.9},{"type":"data","timestamp":1578045339570,"os":"windows","browser":"firefox","min_response_time":0.4,"max_response_time":1.9},{"type":"data","timestamp":1578045339571,"os":"linux","browser":"chrome","min_response_time":0.1,"max_response_time":1.5},{"type":"data","timestamp":1578045339571,"os":"linux","browser":"firefox","min_response_time":0.5,"max_response_time":1.7},{"type":"data","timestamp":1578045339571,"os":"windows","browser":"chrome","min_response_time":0.5,"max_response_time":1.4},{"type":"data","timestamp":1578045339571,"os":"windows","browser":"firefox","min_response_time":0.6,"max_response_time":1.6},{"type":"data","timestamp":1578045339572,"os":"linux","browser":"chrome","min_response_time":0.1,"max_response_time":1.9},{"type":"data","timestamp":1578045339572,"os":"linux","browser":"firefox","min_response_time":0.9,"max_response_time":1.6},{"type":"data","timestamp":1578045339572,"os":"windows","browser":"chrome","min_response_time":0.5,"max_response_time":1.4},{"type":"data","timestamp":1578045339572,"os":"windows","browser":"firefox","min_response_time":0.6,"max_response_time":1},{"type":"data","timestamp":1578045339573,"os":"linux","browser":"chrome","min_response_time":0.5,"max_response_time":1.4},{"type":"data","timestamp":1578045339573,"os":"linux","browser":"firefox","min_response_time":0.9,"max_response_time":1.9},{"type":"data","timestamp":1578045339573,"os":"windows","browser":"chrome","min_response_time":0.4,"max_response_time":1.8},{"type":"data","timestamp":1578045339573,"os":"windows","browser":"firefox","min_response_time":0.9,"max_response_time":1.9},{"type":"data","timestamp":1578045339574,"os":"linux","browser":"chrome","min_response_time":0.8,"max_response_time":1.4},{"type":"data","timestamp":1578045339574,"os":"linux","browser":"firefox","min_response_time":0.1,"max_response_time":1.6},{"type":"data","timestamp":1578045339574,"os":"windows","browser":"chrome","min_response_time":1,"max_response_time":1.9},{"type":"data","timestamp":1578045339574,"os":"windows","browser":"firefox","min_response_time":0.2,"max_response_time":1.8}],"select":["min_response_time","max_response_time"],"groupMap":{"os":{"linux":true,"windows":true},"browser":{"chrome":true,"firefox":true}}}]

it('"processText without wasm usage"', () => {
    const events = processText(text)
    if (! (JSON.stringify(events) === JSON.stringify(eventsMapped))) {
        throw Error('processText return is different than the expected')
    }
})

it('"processEventsMapped without wasm usage" ', () => {
    const eventsMapped = processEventsMapped(processText(text))
    if (!(eventsMapped[0].datasets.length === 8)) {
        throw Error('datasets length different than the expected')
    }
})