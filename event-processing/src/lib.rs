use serde_json::{Result, Value, Map};
use serde::{Deserialize, Serialize};
use std::fmt;
use wasm_bindgen::prelude::*;
use regex::{Regex, Captures};
use std::collections::HashMap;

#[macro_use]
extern crate lazy_static;


extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, event-processing!");
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct StartValue {
    timestamp: u64,
    select: Vec<String>,
    group: Vec<String>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct SpanValue {
    timestamp: u64,
    begin: u64,
    end: u64,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct StopValue {
    timestamp: u64,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct DataValue {
    timestamp: u64,
    os: String,
    browser: String,
    min_response_time: f32,
    max_response_time: f32,
}

#[derive(Debug)]
pub enum Event {
    Start(StartValue),
    Span(SpanValue),
    Stop(StopValue),
    Data(DataValue),
    Unknown,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Point {
    value: f32,
    timestamp: u64,
}

#[wasm_bindgen]
impl Point {
    pub fn value(&self) -> f32 {
        self.value
    }
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }
}

impl Event {
    pub fn from_map(map: Map<String, Value>) -> Result<Event> {
        if map.is_empty() {
            return Ok(Event::Unknown);
        }
        Ok(match &map["type"] {
            Value::String(value) => match value.as_str() {
                "start" => Event::Start(serde_json::from_value(Value::Object(map))?),
                "span" => Event::Span(serde_json::from_value(Value::Object(map))?),
                "data" => Event::Data(serde_json::from_value(Value::Object(map))?),
                "stop" => Event::Stop(serde_json::from_value(Value::Object(map))?),
                _ => Event::Unknown
            },
            _ => Event::Unknown
        })
    }
}


#[wasm_bindgen]
#[derive(Debug)]
pub struct EventsData {
    events: Vec<Event>,
    span_event: Event,
    start_event: Event,
    stop_event: Event,
    os_map: HashMap<String, bool>,
    browser_map: HashMap<String, bool>,
    number_of_lines: u64,
}

impl Default for EventsData {
    fn default() -> EventsData {
        EventsData {
            events: Vec::new(),
            span_event: Event::Unknown,
            start_event: Event::Unknown,
            stop_event: Event::Unknown,
            os_map: HashMap::new(),
            browser_map: HashMap::new(),
            number_of_lines: 0,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Events {
    events: Vec<EventsData>,
    number_of_lines: usize,
}

#[wasm_bindgen]
impl Events {
    pub fn from_text(text: String) -> Events {
        let data_from_text = EventsData::from_text(text);
        Events {
            events: data_from_text.0,
            number_of_lines: data_from_text.1
        }
    }
    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for Events {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}\n", self)?;
        Ok(())
    }
}

#[wasm_bindgen]
impl EventsData {
    fn from_text(text: String) -> (Vec<EventsData>, usize) {
        let mut events_vec: Vec<EventsData> = Vec::new();
        let mut events = EventsData::default();
        let mut number_of_lines: u64 = 0;
        let mut has_started = false;
        let cloned_text = text.clone();
        let lines = cloned_text.lines();
        let line_count = lines.count();
        let mut line_idx = 0;
        for line in text.lines() {
            number_of_lines += 1;
            line_idx += 1;
            let string_line = line_transformation(line);
            let v: Value = match serde_json::from_str(string_line.as_str()) {
                Ok(result) => result,
                _ => Value::Null
            };
            let event_result = match v {
                Value::Object(map) => Event::from_map(map),
                _ => Ok(Event::Unknown)
            };
            match event_result {
                Ok(event) => {
                    match event {
                        Event::Stop(stop_value) => {
                            events.stop_event = Event::Stop(stop_value);
                            events.number_of_lines = number_of_lines;
                            events_vec.push(events);
                            events = EventsData::default();
                            number_of_lines = 0;
                            has_started = false;
                        }
                        Event::Start(start_value) => {
                            if has_started {
                                events.number_of_lines = number_of_lines - 1;
                                events_vec.push(events);
                                events = EventsData::default();
                                events.start_event = Event::Start(start_value);
                                number_of_lines = 1;
                            } else {
                                events.start_event = Event::Start(start_value);
                                has_started = true;
                            }
                        }
                        Event::Span(span_value) => {
                            events.span_event = Event::Span(span_value);
                        }
                        Event::Data(data_value) => {
                            if has_started {
                                events.add_event(Event::Data(data_value));
                            }
                        }
                        Event::Unknown => { }
                    };
                }
                Err(_) => {}
            };
            if line_idx == line_count {
                events.number_of_lines = number_of_lines;
                events_vec.push(events);
                events = EventsData::default();
                number_of_lines = 0;
            }
        }
        (events_vec, line_count)
    }

    fn add_event(&mut self, event: Event) {
        match &event {
            Event::Data(data_value) => {
                self.browser_map.insert(data_value.browser.clone(), true);
                self.os_map.insert(data_value.os.clone(), true);
            }
            _ => {}
        };
        self.events.push(event);
    }

    pub fn number_of_lines(&self) -> u64 {
        self.number_of_lines
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

fn line_transformation(line: &str) -> String {
    lazy_static! {
        static ref RE1: Regex = Regex::new(r"([\$\w]+)\s*:").unwrap();
        static ref RE2: Regex = Regex::new(r"'([^']+)'").unwrap();
    }
    let line_transformed = String::from(RE1.replace_all(&line.clone(), add_quotes_to_key).as_ref());
    String::from(RE2.replace_all(line_transformed.as_str(), change_single_quotes_too_double).as_ref())
}

fn add_quotes_to_key(caps: &Captures) -> String {
    format!("\"{}\":", &caps[1])
}

fn change_single_quotes_too_double(caps: &Captures) -> String {
    format!("\"{}\"", &caps[1])
}

impl fmt::Display for EventsData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}\n", self)?;
        Ok(())
    }
}
